import { NextResponse } from "next/server";
import { Pool } from "pg";

// Esta ruta será invocada por Vercel Cron
export async function GET(request: Request) {
  // Verificar autorización (opcional pero recomendado para cron jobs en Vercel)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const DATABASE_URL = process.env.DATABASE_URL || "";
  
  if (!DATABASE_URL) {
    return NextResponse.json({ error: "DATABASE_URL not configured" }, { status: 500 });
  }

  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS dont_stop (
        id SERIAL PRIMARY KEY,
        source VARCHAR(100) DEFAULT 'vercel_cron',
        message TEXT DEFAULT 'Keep going, do not stop!',
        payload JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const result = await pool.query(
      `INSERT INTO dont_stop (source, message, payload)
       VALUES ($1, $2, $3)
       RETURNING *`,
      ['vercel_cron', 'Heartbeat automatico desde Vercel', JSON.stringify({ timestamp: new Date().toISOString() })]
    );

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (dbError: any) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  } finally {
    await pool.end();
  }
}
