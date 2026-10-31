# EduTenant SaaS — Guía de implementación UI para Gemini

> **Stack de estilos:** Tailwind CSS · **Iconos:** Lucide React · **Tipografía:** Inter (Google Fonts)  
> **Artifact de referencia visual:** https://claude.ai/artifact/FPQQHssmtVRaEq38AZGEgT

---

## 🎨 Sistema de diseño base

### Paleta de colores (Tailwind custom tokens)

```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      accent: {
        DEFAULT: '#185fa5',
        mid:     '#378add',
        light:   '#e6f1fb',
      },
      surface: {
        0: '#f5f5f3',   // page bg
        1: '#f9f9f8',   // metric cards, subtle bg
        2: '#ffffff',   // cards, panels
      },
      brand: {
        text:   '#1a1a18',
        muted:  '#6b6b68',
        hint:   '#a0a09c',
        border: '#e4e4e1',
        'border-strong': '#c8c8c4',
      },
      success: { DEFAULT: '#3b6d11', bg: '#eaf3de' },
      danger:  { DEFAULT: '#a32d2d', bg: '#fcebeb' },
      warning: { DEFAULT: '#854f0b', bg: '#faeeda' },
      purple:  { DEFAULT: '#534ab7', bg: '#eeedfe' },
      teal:    { DEFAULT: '#0f6e56', bg: '#e1f5ee' },
    },
    borderRadius: {
      card: '12px',
    },
  }
}
```

### Componentes atómicos reutilizables

#### Badge
```tsx
// variants: success | danger | accent | purple | teal | warning | neutral
const Badge = ({ variant, children }) => {
  const styles = {
    success: 'bg-success-bg text-success',
    danger:  'bg-danger-bg text-danger',
    accent:  'bg-accent-light text-accent',
    purple:  'bg-purple-bg text-purple',
    teal:    'bg-teal-bg text-teal',
    warning: 'bg-warning-bg text-warning',
    neutral: 'bg-surface-1 text-brand-muted',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${styles[variant]}`}>
      {children}
    </span>
  )
}
```

#### Button
```tsx
// variants: primary | secondary | ghost | danger
const Button = ({ variant = 'secondary', size = 'md', children, ...props }) => {
  const base = 'inline-flex items-center gap-1.5 font-medium rounded-lg transition-all'
  const sizes = { sm: 'px-2.5 py-1 text-xs', md: 'px-3.5 py-1.5 text-sm', lg: 'px-4 py-2 text-sm' }
  const variants = {
    primary:   'bg-accent text-white border border-accent hover:opacity-90',
    secondary: 'bg-surface-2 text-brand-text border border-brand-border-strong hover:bg-surface-1',
    ghost:     'bg-transparent text-brand-muted border-transparent hover:bg-surface-1 hover:text-brand-text',
    danger:    'bg-danger-bg text-danger border border-red-200',
  }
  return <button className={`${base} ${sizes[size]} ${variants[variant]}`} {...props}>{children}</button>
}
```

#### Input / Select
```tsx
const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-xs font-medium text-brand-muted">{label}</label>}
    <input
      className="w-full px-2.5 py-1.5 text-sm bg-surface-2 border border-brand-border-strong rounded-lg
                 text-brand-text placeholder:text-brand-hint
                 focus:outline-none focus:border-accent-mid focus:ring-2 focus:ring-accent-light
                 transition-colors"
      {...props}
    />
  </div>
)
```

#### Card
```tsx
const Card = ({ children, className = '' }) => (
  <div className={`bg-surface-2 border border-brand-border rounded-card p-5 ${className}`}>
    {children}
  </div>
)

const MetricCard = ({ label, value, sub, subColor = 'text-brand-hint' }) => (
  <div className="bg-surface-1 rounded-lg p-3.5">
    <p className="text-xs text-brand-muted mb-1">{label}</p>
    <p className="text-[22px] font-medium text-brand-text">{value}</p>
    {sub && <p className={`text-[11px] mt-0.5 ${subColor}`}>{sub}</p>}
  </div>
)
```

#### Avatar / Iniciales
```tsx
const Avatar = ({ initials, color = 'purple', size = 'md' }) => {
  const sizes = { sm: 'w-6 h-6 text-[10px]', md: 'w-[30px] h-[30px] text-[11px]', lg: 'w-11 h-11 text-[14px]' }
  const colors = {
    purple: 'bg-purple-bg text-purple',
    teal:   'bg-teal-bg text-teal',
    accent: 'bg-accent-light text-accent',
    warning:'bg-warning-bg text-warning',
    danger: 'bg-danger-bg text-danger',
  }
  return (
    <div className={`${sizes[size]} ${colors[color]} rounded-full flex items-center justify-center font-semibold flex-shrink-0`}>
      {initials}
    </div>
  )
}
```

#### Progress Bar
```tsx
const ProgressBar = ({ value, color = 'bg-accent-mid' }) => (
  <div className="h-1 bg-brand-border rounded-full overflow-hidden">
    <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }} />
  </div>
)
```

---

## 📄 Página 1 — Landing (SSG)

```
┌─────────────────────────────────────────────────────────────┐
│  🔲 EduTenant                                     [Login] [Crear cuenta] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│          ✦ SaaS para Academias e Institutos                 │
│                                                             │
│     Gestiona tu academia,                                   │
│     sin complicaciones                                      │
│                                                             │
│  Una plataforma completa para administrar estudiantes,      │
│  cursos e inscripciones. Datos aislados y seguros.         │
│                                                             │
│          [Crear cuenta gratis]  [Ver demo]                  │
│                                                             │
│    +240 academias    |   18k+ estudiantes  |  99.9% uptime  │
│                                                             │
├────────────┬────────────┬────────────┬───────────┬──────────┤
│ 🎓          │  📚         │  📋         │  🔒        │  ⚡      │
│ Gestión    │ Catálogo   │ Inscripc.  │ Aislamien │ Idempot. │
│ estudiant. │ de cursos  │ ágiles     │ to total  │ garantiz │
├────────────┴────────────┴────────────┴───────────┴──────────┤
│  Planes: Starter $0 | Pro $29/mes ★ | Enterprise Custom     │
└─────────────────────────────────────────────────────────────┘
```

### Estructura JSX completa

```tsx
// app/page.tsx — SSG (sin "use client")
import { ChevronRight, Shield, Zap, BookOpen, Users, ClipboardList, Star } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-0 font-sans">

      {/* Navbar */}
      <nav className="bg-surface-2 border-b border-brand-border px-6 h-13 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 font-semibold text-[15px]">
          <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
            <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-[2px] bg-white opacity-90 w-1.5 h-1.5" />
              ))}
            </div>
          </div>
          EduTenant
        </div>
        <div className="flex gap-2">
          <Button variant="ghost">Iniciar sesión</Button>
          <Button variant="primary">Crear cuenta</Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-surface-2 border-b border-brand-border px-10 py-20 text-center">
        <span className="inline-flex items-center gap-1 bg-accent-light text-accent text-xs font-medium px-3 py-1 rounded-full mb-4">
          <Star className="w-3 h-3" /> SaaS para Academias e Institutos
        </span>
        <h1 className="text-4xl font-semibold text-brand-text mb-3 leading-tight">
          Gestiona tu academia,<br />sin complicaciones
        </h1>
        <p className="text-base text-brand-muted max-w-lg mx-auto mb-7">
          Una plataforma completa para administrar estudiantes, cursos e inscripciones.
          Cada academia con sus propios datos, aislados y seguros.
        </p>
        <div className="flex justify-center gap-2.5">
          <Button variant="primary" size="lg">
            Crear cuenta gratis <ChevronRight className="w-4 h-4" />
          </Button>
          <Button variant="secondary" size="lg">Ver demo</Button>
        </div>
        {/* Stats */}
        <div className="flex justify-center gap-8 mt-10">
          {[
            { value: '+240', label: 'Academias activas' },
            { value: '18k+', label: 'Estudiantes gestionados' },
            { value: '99.9%', label: 'Uptime garantizado' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-xl font-semibold text-brand-text">{stat.value}</div>
              <div className="text-xs text-brand-muted mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section className="px-10 py-12 max-w-5xl mx-auto">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-hint mb-3">Funcionalidades</p>
        <h2 className="text-xl font-medium text-brand-text mb-1">Todo lo que tu academia necesita</h2>
        <p className="text-sm text-brand-muted mb-6">Desde el registro de un alumno hasta el seguimiento de sus cursos.</p>
        <div className="grid grid-cols-3 gap-4">
          {features.map(f => (
            <Card key={f.title}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${f.iconBg}`}>
                <f.icon className={`w-5 h-5 ${f.iconColor}`} />
              </div>
              <h3 className="text-sm font-medium text-brand-text mb-1.5">{f.title}</h3>
              <p className="text-[13px] text-brand-muted leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-surface-1 px-10 py-12">
        <div className="max-w-2xl mx-auto">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-hint mb-3 text-center">Planes</p>
          <h2 className="text-xl font-medium text-brand-text mb-6 text-center">Precio sencillo, sin sorpresas</h2>
          <div className="grid grid-cols-3 gap-4">
            {plans.map(p => (
              <div key={p.name}
                className={`bg-surface-2 rounded-card p-6 border ${p.featured ? 'border-accent-mid border-2' : 'border-brand-border'}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-brand-muted">{p.name}</p>
                  {p.featured && <Badge variant="accent">Popular</Badge>}
                </div>
                <p className="text-[28px] font-semibold text-brand-text">{p.price}</p>
                <p className="text-xs text-brand-hint mb-4">{p.period}</p>
                <div className="h-px bg-brand-border mb-4" />
                <ul className="space-y-2 mb-5">
                  {p.features.map(f => (
                    <li key={f} className="flex items-center gap-1.5 text-[13px] text-brand-muted">
                      <span className="text-success font-semibold text-xs">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Button variant={p.featured ? 'primary' : 'secondary'} className="w-full justify-center">
                  {p.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-2 border-t border-brand-border px-10 py-8 flex items-center justify-between text-xs text-brand-muted">
        <div className="flex items-center gap-1.5 font-semibold text-sm text-brand-text">
          <div className="w-2 h-2 rounded-full bg-accent-mid" />
          EduTenant
        </div>
        <span>© 2026 EduTenant · Términos · Privacidad</span>
        <div className="flex gap-4">
          {['Documentación', 'Estado', 'Contacto'].map(l => (
            <a key={l} href="#" className="text-accent-mid hover:underline">{l}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}
```

### Datos de features y planes

```tsx
const features = [
  { title: 'Gestión de estudiantes', desc: 'Registro completo con historial de inscripciones y datos de contacto por academia.', icon: Users, iconBg: 'bg-accent-light', iconColor: 'text-accent' },
  { title: 'Catálogo de cursos', desc: 'Crea y organiza cursos con descripción, capacidad y estado por academia.', icon: BookOpen, iconBg: 'bg-teal-bg', iconColor: 'text-teal' },
  { title: 'Inscripciones ágiles', desc: 'Asocia estudiantes a cursos en segundos. Control de estado completo.', icon: ClipboardList, iconBg: 'bg-purple-bg', iconColor: 'text-purple' },
  { title: 'Aislamiento total de datos', desc: 'Arquitectura multitenant. Los datos de una academia nunca son visibles para otra.', icon: Shield, iconBg: 'bg-success-bg', iconColor: 'text-success' },
  { title: 'Idempotencia garantizada', desc: 'Operaciones seguras ante reintentos. Envía la misma petición dos veces, se ejecuta una.', icon: Zap, iconBg: 'bg-warning-bg', iconColor: 'text-warning' },
  { title: 'Rate limiting inteligente', desc: 'Protección por tenant y usuario. Respuesta 429 con Retry-After al superar el límite.', icon: Shield, iconBg: 'bg-danger-bg', iconColor: 'text-danger' },
]

const plans = [
  { name: 'Starter', price: '$0', period: 'por mes', cta: 'Empezar gratis', featured: false,
    features: ['Hasta 50 estudiantes', '5 cursos activos', '1 administrador', 'Soporte por email'] },
  { name: 'Pro', price: '$29', period: 'por mes · por academia', cta: 'Iniciar prueba 14 días', featured: true,
    features: ['Estudiantes ilimitados', 'Cursos ilimitados', '5 administradores', 'Soporte prioritario', 'API access'] },
  { name: 'Enterprise', price: 'Custom', period: 'cotización personalizada', cta: 'Contactar ventas', featured: false,
    features: ['Todo lo de Pro', 'SLA garantizado', 'Integración n8n', 'SSO / SAML', 'Soporte 24/7'] },
]
```

---

## 📄 Página 2 — Login

```
┌────────────────────────────────┐
│        🔲 EduTenant            │
│    Inicia sesión en tu academia│
│                                │
│  ℹ️ Cookie httpOnly · no localStorage │
│                                │
│  Correo electrónico            │
│  [admin@academia.com        ]  │
│                                │
│  Contraseña                    │
│  [••••••••                  ]  │
│                                │
│  ☑ Recordarme   ¿Olvidaste?   │
│                                │
│  [    Iniciar sesión         ] │
│                                │
│  ─────── o continúa con ───── │
│  [G  Continuar con Google    ] │
│                                │
│  ¿No tienes cuenta? Crear ac. │
│                                │
│ ┌── 429 Rate Limit (hidden) ──┐│
│ │ Demasiados intentos         ││
│ │ Retry-After: 60s            ││
│ └─────────────────────────────┘│
└────────────────────────────────┘
```

### Estructura JSX

```tsx
// features/auth/components/LoginForm.tsx
'use client'
import { useState } from 'react'
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [rateLimited, setRateLimited] = useState(false)

  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center p-6">
      <div className="bg-surface-2 border border-brand-border rounded-[16px] p-9 w-[380px]">

        {/* Logo */}
        <div className="text-center mb-7">
          <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center mx-auto mb-2.5">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-[17px] font-semibold text-brand-text">EduTenant</h1>
          <p className="text-xs text-brand-muted mt-0.5">Inicia sesión en tu academia</p>
        </div>

        {/* Info alert */}
        <div className="flex items-start gap-2 bg-accent-light text-accent text-xs p-2.5 rounded-lg border-l-[3px] border-accent-mid mb-5">
          <Lock className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
          Sesión guardada en cookie httpOnly — no expuesta en localStorage
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-brand-muted block mb-1">Correo electrónico</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-brand-hint" />
              <input
                type="email"
                defaultValue="admin@prestige.edu"
                className="w-full pl-8 pr-3 py-2 text-sm bg-surface-2 border border-brand-border-strong rounded-lg
                           focus:outline-none focus:border-accent-mid focus:ring-2 focus:ring-accent-light"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-brand-muted block mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-brand-hint" />
              <input
                type={showPassword ? 'text' : 'password'}
                defaultValue="supersecret"
                className="w-full pl-8 pr-9 py-2 text-sm bg-surface-2 border border-brand-border-strong rounded-lg
                           focus:outline-none focus:border-accent-mid focus:ring-2 focus:ring-accent-light"
              />
              <button onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-hint hover:text-brand-text">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-1.5 text-brand-muted cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded" /> Recordarme
            </label>
            <a href="#" className="text-accent-mid hover:underline">¿Olvidaste tu contraseña?</a>
          </div>

          <Button variant="primary" size="lg" className="w-full justify-center">
            Iniciar sesión
          </Button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4 text-brand-hint text-xs">
          <div className="flex-1 h-px bg-brand-border" />
          o continúa con
          <div className="flex-1 h-px bg-brand-border" />
        </div>

        <button className="w-full flex items-center justify-center gap-2 py-2 text-sm border border-brand-border-strong rounded-lg bg-surface-2 hover:bg-surface-1 transition-colors">
          {/* Google SVG icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57C21.36 18.36 22.56 15.5 22.56 12.25z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continuar con Google
        </button>

        <p className="text-center mt-5 text-[13px] text-brand-muted">
          ¿No tienes cuenta?{' '}
          <a href="/register" className="text-accent-mid hover:underline">Crear academia</a>
        </p>

        {/* Rate limit warning */}
        {rateLimited && (
          <div className="mt-4 bg-danger-bg border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-danger text-xs font-medium mb-1">
              <AlertCircle className="w-3.5 h-3.5" /> Demasiados intentos
            </div>
            <p className="text-xs text-brand-muted">
              Rate limit alcanzado. Reintenta en <strong>60 segundos</strong>
              <code className="ml-1 bg-white px-1 rounded text-[10px]">Retry-After: 60</code>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
```

---

## 📄 Página 3 — Registro + Onboarding (wizard 3 pasos)

```
Paso 1 ──✓── Paso 2 ──●── Paso 3
[Cuenta]   [Academia]   [Confirmar]

┌────────────────────────────────────┐
│  Cuéntanos sobre tu academia       │
│  Creará tu tenant y schema aislado │
│                                    │
│  Nombre de la academia *           │
│  [Instituto de Idiomas Prestige  ] │
│                                    │
│  Slug único *       Ciudad         │
│  [prestige      ]  [Cartagena   ]  │
│  prestige.edutenant.app            │
│                                    │
│  Descripción breve                 │
│  [Cursos de inglés, francés…    ]  │
│                                    │
│  ℹ️ Idempotency-Key en este registro│
│                                    │
│       [Atrás]  [Crear academia →] │
└────────────────────────────────────┘
```

### Step indicator component

```tsx
// components/ui/StepIndicator.tsx
import { Check } from 'lucide-react'

interface Step { label: string; status: 'done' | 'active' | 'pending' }

export const StepIndicator = ({ steps }: { steps: Step[] }) => (
  <div className="flex items-start mb-7">
    {steps.map((step, i) => (
      <div key={i} className="flex-1 flex flex-col items-center relative">
        {/* Connector line */}
        {i < steps.length - 1 && (
          <div className={`absolute top-3.5 left-1/2 w-full h-px z-0 ${step.status === 'done' ? 'bg-accent' : 'bg-brand-border'}`} />
        )}
        {/* Circle */}
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold z-10 relative
          ${step.status === 'done' ? 'bg-accent text-white' :
            step.status === 'active' ? 'bg-accent-mid text-white ring-2 ring-accent' :
            'bg-surface-1 text-brand-hint border border-brand-border'}`}>
          {step.status === 'done' ? <Check className="w-3.5 h-3.5" /> : i + 1}
        </div>
        {/* Label */}
        <span className={`text-[11px] mt-1.5 text-center ${step.status === 'active' ? 'text-accent font-medium' : 'text-brand-muted'}`}>
          {step.label}
        </span>
      </div>
    ))}
  </div>
)
```

### Formulario de registro de academia

```tsx
// app/register/page.tsx
'use client'
import { Building2, MapPin, Info, Key } from 'lucide-react'

export default function RegisterPage() {
  const steps = [
    { label: 'Cuenta', status: 'done' as const },
    { label: 'Academia', status: 'active' as const },
    { label: 'Confirmar', status: 'pending' as const },
  ]

  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center py-10 px-4">
      <div className="w-[520px]">
        <div className="text-center mb-5">
          {/* logo igual que Login */}
          <h1 className="text-[17px] font-semibold text-brand-text">EduTenant</h1>
          <p className="text-xs text-brand-muted">Crea tu academia en minutos</p>
        </div>

        <StepIndicator steps={steps} />

        <Card>
          <h2 className="text-[15px] font-medium text-brand-text mb-1">Cuéntanos sobre tu academia</h2>
          <p className="text-[13px] text-brand-muted mb-5">Esto creará tu tenant y schema aislado en la base de datos.</p>

          <div className="space-y-4">
            <Input label="Nombre de la academia *" placeholder="Ej: Academia Central" defaultValue="Instituto de Idiomas Prestige" />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Input label="Slug único (subdominio) *" placeholder="mi-academia" defaultValue="prestige" />
                <p className="text-[11px] text-brand-hint mt-1">prestige.edutenant.app</p>
              </div>
              <Input label="Ciudad" placeholder="Ciudad principal" defaultValue="Cartagena, Colombia" />
            </div>

            <div>
              <label className="text-xs font-medium text-brand-muted block mb-1">Descripción breve</label>
              <textarea
                rows={2}
                className="w-full px-2.5 py-1.5 text-sm bg-surface-2 border border-brand-border-strong rounded-lg
                           resize-none focus:outline-none focus:border-accent-mid focus:ring-2 focus:ring-accent-light"
                defaultValue="Cursos de inglés, francés y portugués para todos los niveles."
              />
            </div>

            <Input label="Correo de contacto" type="email" defaultValue="info@prestige.edu" />

            {/* Idempotency alert */}
            <div className="flex items-start gap-2 bg-accent-light text-accent text-xs p-3 rounded-lg border-l-[3px] border-accent-mid">
              <Key className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span><strong>Idempotencia:</strong> Este registro usa <code className="bg-accent/10 px-1 rounded">Idempotency-Key</code> — puedes enviarlo varias veces de forma segura.</span>
            </div>
          </div>

          <div className="flex justify-end gap-2.5 mt-5">
            <Button variant="secondary">Atrás</Button>
            <Button variant="primary">
              Crear academia <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
```

---

## 📄 Página 4 — Onboarding (creación de schema en tiempo real)

```
┌────────────────────────────────────┐
│       ⚙️ Creando tu espacio        │
│                                    │
│  ✅ Tenant creado         [Listo]  │
│  ✅ Schema "prestige"     [Listo]  │
│  🔵 Tablas students/courses  [En…] │
│  ⬜ Datos de ejemplo       [Pend.] │
│                                    │
│  ████████████░░░░░ 65%            │
│                                    │
│       [Ir al panel →]              │
└────────────────────────────────────┘
```

```tsx
// Componente de paso de progreso
const SetupStep = ({ label, status, detail }: { label: string; status: 'done'|'loading'|'pending'; detail?: string }) => {
  const icons = {
    done:    <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />,
    loading: <Loader2 className="w-4 h-4 text-accent-mid flex-shrink-0 animate-spin" />,
    pending: <Circle className="w-4 h-4 text-brand-hint flex-shrink-0" />,
  }
  const badges = {
    done:    <Badge variant="success">✓ Listo</Badge>,
    loading: <Badge variant="accent">En proceso…</Badge>,
    pending: <Badge variant="neutral">Pendiente</Badge>,
  }
  return (
    <div className="flex items-center gap-2.5 py-2 border-b border-brand-border last:border-0">
      {icons[status]}
      <span className="flex-1 text-[13px] text-brand-text">{label}
        {detail && <code className="ml-1 text-[11px] bg-surface-1 px-1 rounded font-mono">{detail}</code>}
      </span>
      {badges[status]}
    </div>
  )
}
```

---

## 📄 Página 5 — Dashboard principal

```
┌─ Sidebar ──┬─────────────── Main content ──────────────────┐
│ IP Instituto│  Dashboard            [Exportar] [+ Nuevo]   │
│ Prestige    │                                               │
│             │  [148 est.] [12 cur.] [203 inscrip.] [74%]  │
│ ■ Dashboard │  (Métricas)                                   │
│   Estudiant.│                                               │
│   Cursos    │  ┌── Inscripciones recientes ──┐ ┌─ Info ──┐│
│   Inscripc. │  │ ML María  Inglés B2  Activa │ │Tenant ID││
│             │  │ CR Carlos Francés A1 Activa │ │Schema   ││
│ Sistema     │  │ AS Ana    Portugués  Compl. │ │Plan Pro ││
│   Tenants   │  └────────────────────────────┘ └─────────┘│
│   Config.   │                                               │
│             │  ┌── Cursos populares ────────┐ ┌─ Rate──┐ │
│ ten_4f29b1  │  │ Inglés B2  ████████ 80%   │ │847/10k ││
│ prestige    │  │ Francés A1 █████░░░ 53%   │ │ 8.5%   ││
└─────────────┴───────────────────────────────────────────────┘
```

### Layout con Sidebar

```tsx
// app/dashboard/layout.tsx
import { LayoutDashboard, Users, BookOpen, ClipboardList, Home, Settings } from 'lucide-react'

const Sidebar = ({ tenant }) => (
  <aside className="w-[220px] min-w-[220px] bg-surface-2 border-r border-brand-border p-3 min-h-screen">
    {/* Tenant header */}
    <div className="flex items-center gap-3 mb-6 px-2">
      <div className="w-11 h-11 rounded-lg bg-accent flex items-center justify-center text-white font-semibold text-lg">
        {tenant.initials}
      </div>
      <div>
        <p className="text-[13px] font-medium text-brand-text">{tenant.name}</p>
        <p className="text-[11px] text-brand-hint">{tenant.slug}.edutenant.app</p>
      </div>
    </div>

    {/* Nav */}
    <div className="space-y-0.5 mb-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.07em] text-brand-hint px-2.5 mb-1.5">General</p>
      {navItems.map(item => (
        <SidebarItem key={item.href} {...item} />
      ))}
    </div>

    <div className="space-y-0.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.07em] text-brand-hint px-2.5 mb-1.5">Sistema</p>
      <SidebarItem href="/tenants" icon={Home} label="Todos los tenants" />
      <SidebarItem href="/settings" icon={Settings} label="Configuración" />
    </div>
  </aside>
)

const SidebarItem = ({ href, icon: Icon, label, count, active }) => (
  <a href={href} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[13px] transition-colors
    ${active ? 'bg-accent-light text-accent font-medium' : 'text-brand-muted hover:bg-surface-1 hover:text-brand-text'}`}>
    <Icon className="w-4 h-4 flex-shrink-0" />
    <span className="flex-1">{label}</span>
    {count && (
      <span className="text-[11px] bg-surface-1 text-brand-hint px-1.5 py-0.5 rounded-full">{count}</span>
    )}
  </a>
)
```

### Métricas del dashboard

```tsx
const dashboardMetrics = [
  { label: 'Estudiantes activos', value: '148', sub: '↑ 12 este mes', subColor: 'text-success' },
  { label: 'Cursos activos',      value: '12',  sub: '↑ 2 nuevos',   subColor: 'text-success' },
  { label: 'Inscripciones',       value: '203', sub: '↑ 18 esta semana', subColor: 'text-accent' },
  { label: 'Tasa de finalización',value: '74%', sub: '↓ 3% vs mes anterior', subColor: 'text-warning' },
]

// En el dashboard:
<div className="grid grid-cols-4 gap-3 mb-6">
  {dashboardMetrics.map(m => <MetricCard key={m.label} {...m} />)}
</div>
```

---

## 📄 Página 6 — Gestión de Estudiantes

```
┌─ Dashboard/Estudiantes ──────────────────────────────────────┐
│  Estudiantes          148 en Instituto Prestige  [+ Nuevo]  │
│                                                              │
│  [Buscar por nombre…] [Estado ▼] [Ordenar ▼]               │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Estudiante     │ Email     │ Inscrip. │ Fecha │ Est. │   │
│  ├────────────────┼───────────┼──────────┼───────┼──────┤   │
│  │ ML María López │ maria@…  │ 3 cursos │ 15sep │ ✅   │   │
│  │ CR Carlos Ríos │ carlos@… │ 2 cursos │ 02oct │ ✅   │   │
│  │ AS Ana Suárez  │ ana@…    │ 1 curso  │ 20oct │ ✅   │   │
│  │ JM Juan Mora   │ juan@…   │ 2 cursos │ 28oct │ ⚫   │   │
│  └──────────────────────────────────────────────────────┘   │
│  Mostrando 1-5 de 148   [←] [1] [2] [3] […] [30] [→]      │
└──────────────────────────────────────────────────────────────┘
```

### Tabla de estudiantes

```tsx
// features/business/students/components/StudentsTable.tsx
import { MoreHorizontal, Search, SlidersHorizontal } from 'lucide-react'

export const StudentsTable = ({ students }) => (
  <div>
    {/* Filters */}
    <div className="flex gap-2.5 mb-4">
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-brand-hint" />
        <input placeholder="Buscar por nombre o email…"
          className="pl-8 pr-3 py-1.5 text-sm bg-surface-2 border border-brand-border-strong rounded-lg w-72 focus:outline-none focus:border-accent-mid focus:ring-2 focus:ring-accent-light" />
      </div>
      <select className="text-sm bg-surface-2 border border-brand-border-strong rounded-lg px-2.5 py-1.5 text-brand-text focus:outline-none">
        <option>Todos los estados</option>
        <option>Activos</option>
        <option>Inactivos</option>
      </select>
      <select className="text-sm bg-surface-2 border border-brand-border-strong rounded-lg px-2.5 py-1.5 text-brand-text focus:outline-none">
        <option>Ordenar: recientes</option>
        <option>A-Z</option>
        <option>Más inscripciones</option>
      </select>
    </div>

    {/* Table */}
    <div className="bg-surface-2 border border-brand-border rounded-card overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-brand-border">
            {['Estudiante', 'Email', 'Inscripciones', 'Fecha de registro', 'Estado', ''].map(h => (
              <th key={h} className="text-left text-[11px] font-medium uppercase tracking-[0.05em] text-brand-hint px-3.5 py-2.5">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s.id} className="border-b border-brand-border last:border-0 hover:bg-surface-1 transition-colors">
              <td className="px-3.5 py-3">
                <div className="flex items-center gap-2.5">
                  <Avatar initials={s.initials} color={s.color} size="sm" />
                  <div>
                    <p className="text-[13px] font-medium text-brand-text">{s.name}</p>
                    <p className="text-[11px] text-brand-hint">ID: {s.id}</p>
                  </div>
                </div>
              </td>
              <td className="px-3.5 py-3 text-[13px] text-brand-muted">{s.email}</td>
              <td className="px-3.5 py-3"><Badge variant="accent">{s.courses} cursos</Badge></td>
              <td className="px-3.5 py-3 text-xs text-brand-muted">{s.date}</td>
              <td className="px-3.5 py-3"><Badge variant={s.active ? 'success' : 'neutral'}>{s.active ? 'Activo' : 'Inactivo'}</Badge></td>
              <td className="px-3.5 py-3">
                <button className="p-1 rounded hover:bg-surface-1 text-brand-hint">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="px-3.5 py-3 border-t border-brand-border flex items-center">
        <p className="text-xs text-brand-muted flex-1">Mostrando 1-5 de 148</p>
        <div className="flex gap-1">
          {['←', '1', '2', '3', '…', '30', '→'].map((p, i) => (
            <button key={i} className={`w-7 h-7 rounded-lg text-xs flex items-center justify-center border transition-colors
              ${p === '1' ? 'bg-accent text-white border-accent' : 'bg-surface-2 text-brand-muted border-brand-border hover:bg-surface-1'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
)
```

### Modal — Nuevo estudiante

```tsx
// Aparece sobre la tabla con backdrop
import { X, Key } from 'lucide-react'

const NewStudentModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black/45 z-50 flex items-center justify-center">
    <Card className="w-[440px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[15px] font-medium text-brand-text">Nuevo estudiante</h2>
        <button onClick={onClose} className="p-1 rounded hover:bg-surface-1 text-brand-hint">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Input label="Nombre *" placeholder="Nombre" />
        <Input label="Apellido *" placeholder="Apellido" />
      </div>
      <div className="space-y-3">
        <Input label="Correo electrónico *" type="email" placeholder="nombre@email.com" />
        <Input label="Teléfono" placeholder="+57 300 000 0000" />
        <Input label="Fecha de nacimiento" type="date" />
      </div>
      <div className="flex items-start gap-2 bg-accent-light text-accent text-xs p-2.5 rounded-lg border-l-[3px] border-accent-mid mt-4">
        <Key className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
        Idempotency-Key generada automáticamente. Doble clic en guardar no crea duplicados.
      </div>
      <div className="flex justify-end gap-2 mt-5">
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button variant="primary">Guardar estudiante</Button>
      </div>
    </Card>
  </div>
)
```

---

## 📄 Página 7 — Catálogo de Cursos

```
┌──── Grid de cursos ──────────────────────────────────────┐
│  Cursos     12 en catálogo  [+ Nuevo curso]              │
│                                                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │ 🇺🇸          │ │ 🇫🇷          │ │ 🇬🇧          │       │
│  │ Inglés B2   │ │ Francés A1  │ │ Inglés C1   │       │
│  │ Activo  ✅  │ │ Activo  ✅  │ │ Activo  ✅  │       │
│  │ ████████ 80%│ │ █████░ 53%  │ │ ████░░ 47%  │       │
│  │ 48/60 est.  │ │ 32/60 est.  │ │ 28/60 est.  │       │
│  └─────────────┘ └─────────────┘ └─────────────┘       │
│  ┌─────────────┐ ┌─────────────┐ ┌── + Agregar ┐       │
│  │ 🇧🇷 Portug. │ │ 🇩🇪 Alemán  │ │             │       │
│  │ Activo  ✅  │ │ Inactivo ⚫ │ │      +      │       │
│  │ ██░░░░ 32%  │ │ Sin alumnos │ │  Agregar    │       │
│  └─────────────┘ └─────────────┘ └─────────────┘       │
└──────────────────────────────────────────────────────────┘
```

```tsx
// features/business/courses/components/CourseCard.tsx
import { BookOpen, Users } from 'lucide-react'

export const CourseCard = ({ course }) => (
  <Card className="cursor-pointer hover:border-brand-border-strong transition-colors group">
    <div className="flex items-start justify-between mb-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${course.iconBg}`}>
        {course.flag}
      </div>
      <Badge variant={course.active ? 'success' : 'neutral'}>
        {course.active ? 'Activo' : 'Inactivo'}
      </Badge>
    </div>
    <h3 className="text-sm font-medium text-brand-text mb-1">{course.title}</h3>
    <p className="text-xs text-brand-muted mb-3.5">{course.level} — {course.hours} hrs</p>
    {course.capacity && (
      <>
        <ProgressBar value={(course.enrolled / course.capacity) * 100} color={course.barColor} />
        <div className="flex justify-between text-[11px] text-brand-muted mt-1.5">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" /> {course.enrolled} / {course.capacity}
          </span>
          <span>{Math.round((course.enrolled / course.capacity) * 100)}% lleno</span>
        </div>
      </>
    )}
  </Card>
)

// Card para agregar nuevo curso
export const AddCourseCard = ({ onClick }) => (
  <button onClick={onClick}
    className="bg-surface-2 border border-dashed border-brand-border-strong rounded-card p-5
               flex flex-col items-center justify-center min-h-[150px] cursor-pointer
               hover:border-accent hover:bg-accent-light/30 transition-colors group w-full">
    <div className="text-3xl text-brand-hint group-hover:text-accent mb-2">+</div>
    <p className="text-[13px] text-brand-hint group-hover:text-accent">Agregar curso</p>
  </button>
)
```

---

## 📄 Página 8 — Inscripciones (con Idempotency-Key visible)

```
┌── Inscripciones ─────────────────────────────────────────────┐
│  203 inscripciones  [Todas] [Activas] [Pendientes] [Compl.] │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Idem-Key     │ Estudiante  │ Curso    │ Estado │ Fecha  │  │
│  │ idk_4f8a12b  │ ML María   │ Inglés B2│ Activa │ Hoy   │  │
│  │ idk_7c3d45e  │ CR Carlos  │ Francés  │ Activa │ Hoy   │  │
│  │ idk_9a1b23c  │ AS Ana     │ Portug.  │ Compl. │ Ayer  │  │
│  │ idk_2f6g78h  │ JM Juan    │ Inglés C1│ Pend.  │ Ayer  │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  🔑 Demo idempotencia:                                       │
│  ✓ POST /api/enrollments idk_4f8a12b → 201 Created          │
│  → POST /api/enrollments idk_4f8a12b → 200 OK (cached)      │
│  ℹ Mismo resultado · sin duplicados en BD                    │
└──────────────────────────────────────────────────────────────┘
```

```tsx
// Componente demo de idempotencia
import { Key, CheckCircle, ArrowRight, Info } from 'lucide-react'

const IdempotencyDemo = () => (
  <Card className="mt-4">
    <div className="flex items-center gap-2 mb-3">
      <Key className="w-4 h-4 text-brand-muted" />
      <h3 className="text-sm font-medium text-brand-text">Idempotencia en acción</h3>
    </div>
    <p className="text-[13px] text-brand-muted mb-3">
      Envía la misma inscripción dos veces con la misma clave — solo se crea un registro.
    </p>
    <div className="bg-surface-1 rounded-lg p-4 border border-brand-border space-y-2">
      {[
        { icon: <CheckCircle className="w-3.5 h-3.5 text-success" />, req: 'POST /api/enrollments', key: 'idk_4f8a12b', badge: { label: '201 Created', variant: 'success' }, muted: false },
        { icon: <ArrowRight className="w-3.5 h-3.5 text-brand-hint" />, req: 'POST /api/enrollments (reintento)', key: 'idk_4f8a12b', badge: { label: '200 OK (cached)', variant: 'accent' }, muted: true },
      ].map((row, i) => (
        <div key={i} className={`flex items-center gap-2 py-1.5 border-b border-brand-border last:border-0 ${row.muted ? 'opacity-75' : ''}`}>
          {row.icon}
          <span className="flex-1 text-xs font-mono text-brand-muted">{row.req}</span>
          <code className="text-[10px] bg-surface-2 border border-brand-border px-1.5 py-0.5 rounded font-mono">{row.key}</code>
          <Badge variant={row.badge.variant as any} className="text-[10px]">{row.badge.label}</Badge>
        </div>
      ))}
      <div className="flex items-center gap-1.5 pt-1">
        <Info className="w-3 h-3 text-brand-hint" />
        <span className="text-[11px] text-brand-hint">Mismo resultado devuelto · ningún registro duplicado en la base de datos</span>
      </div>
    </div>
  </Card>
)
```

---

## 📄 Página 9 — Panel de Tenants (Super Admin)

```
┌── Tenants registrados ────────────────────────────────────────┐
│  7 academias activas                         [Exportar CSV]  │
│                                                               │
│  [Tenants: 7] [Estudiantes: 1,240] [Peticiones: 12,847]     │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐    │
│  │ Academia    │ Slug    │ Plan │ Estud.│ Req/día │ Est. │    │
│  │ IP Prestige │prestige │ Pro  │  148  │ 847/10k │  ✅  │    │
│  │ LA Language │lang-ac. │Start │   43  │ 312/5k  │  ✅  │    │
│  │ CE Centro N.│centro-n.│ Pro  │  289  │2101/10k │  ✅  │    │
│  │ AC Central  │acad-cen.│Start │   12  │4890/5k⚠ │  🟡  │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌── Rate Limiting ──────┐ ┌── Idempotencia Tenant ────────┐ │
│  │ 429 Academia Central  │ │ ✓ POST /api/tenants → 201     │ │
│  │ Retry-After: 3600     │ │ → POST /api/tenants → 200 ok  │ │
│  └───────────────────────┘ └───────────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

```tsx
// Alerta de rate limit
import { AlertTriangle, Clock } from 'lucide-react'

const RateLimitAlert = ({ tenant, retryAfter }) => (
  <div className="bg-warning-bg border border-amber-200 rounded-lg p-3.5">
    <div className="flex items-center gap-2 text-warning text-xs font-medium mb-1.5">
      <AlertTriangle className="w-3.5 h-3.5" />
      429 Too Many Requests — {tenant}
    </div>
    <p className="text-xs text-brand-muted">
      Límite diario alcanzado<br />
      Header enviado:{' '}
      <code className="bg-white px-1.5 py-0.5 rounded text-[10px] font-mono">Retry-After: {retryAfter}</code>
    </p>
    <div className="flex items-center gap-1 mt-2 text-[11px] text-brand-hint">
      <Clock className="w-3 h-3" />
      Estrategia: ventana deslizante · límite por tenant y usuario
    </div>
  </div>
)
```

---

## 🗺️ Mapa de navegación y flechas de flujo

```
                        ┌─────────────┐
                        │   Landing   │ ←── SSG (página estática)
                        │   /         │
                        └──────┬──────┘
                    ┌──────────┼──────────┐
                    ▼          ▼          ▼
             ┌──────────┐ ┌──────────┐  (ver demo)
             │  Login   │ │ Registro │
             │ /login   │ │/register │
             └────┬─────┘ └────┬─────┘
                  │            │ Crear academia
                  │            ▼
                  │      ┌──────────────┐
                  │      │  Onboarding  │ schema creado
                  │      │  /onboarding │ automáticamente
                  │      └──────┬───────┘
                  └─────────────┘
                          │ JWT cookie httpOnly
                          ▼
              ┌───────────────────────────┐
              │        Dashboard          │ ←── SSR / CSR
              │      /dashboard           │
              └───┬───────┬──────┬────────┘
                  │       │      │
                  ▼       ▼      ▼
          ┌────────┐ ┌────────┐ ┌──────────────┐
          │Estudian│ │ Cursos │ │ Inscripciones│
          │/student│ │/courses│ │ /enrollments │
          └────────┘ └────────┘ └──────────────┘
                          │ (Super Admin)
                          ▼
                   ┌───────────┐
                   │  Tenants  │
                   │ /tenants  │
                   └───────────┘
```

### Componente de diagrama de flujo (Lucide + Tailwind)

```tsx
// components/ui/FlowArrow.tsx
import { ArrowRight, ArrowDown } from 'lucide-react'

export const FlowArrow = ({ direction = 'right', label }: { direction?: 'right' | 'down'; label?: string }) => (
  <div className={`flex ${direction === 'down' ? 'flex-col' : 'flex-row'} items-center gap-1 text-brand-hint`}>
    {label && <span className="text-[10px] text-brand-hint">{label}</span>}
    {direction === 'down'
      ? <ArrowDown className="w-4 h-4" />
      : <ArrowRight className="w-4 h-4" />
    }
  </div>
)

// Ejemplo de diagrama de flujo completo
export const NavigationFlow = () => (
  <div className="flex items-center gap-2 p-4 bg-surface-1 rounded-card border border-brand-border">
    <FlowNode icon={Globe} label="Landing" tag="SSG" color="teal" />
    <FlowArrow label="login" />
    <FlowNode icon={Lock} label="Auth" tag="CSR" color="purple" />
    <FlowArrow label="JWT cookie" />
    <FlowNode icon={LayoutDashboard} label="Dashboard" tag="SSR" color="accent" />
    <FlowArrow />
    <FlowNode icon={Users} label="CRUD" tag="CSR" color="success" />
  </div>
)

const FlowNode = ({ icon: Icon, label, tag, color }) => {
  const colors = {
    teal:    'bg-teal-bg text-teal border-teal/30',
    purple:  'bg-purple-bg text-purple border-purple/30',
    accent:  'bg-accent-light text-accent border-accent/30',
    success: 'bg-success-bg text-success border-success/30',
  }
  return (
    <div className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg border ${colors[color]}`}>
      <Icon className="w-4 h-4" />
      <span className="text-[11px] font-medium">{label}</span>
      <span className="text-[9px] opacity-70">{tag}</span>
    </div>
  )
}
```

---

## 📦 Estructura de carpetas recomendada

```
src/
├── app/
│   ├── page.tsx                    # Landing (SSG)
│   ├── login/page.tsx              # Login (CSR)
│   ├── register/page.tsx           # Registro (CSR)
│   ├── onboarding/page.tsx         # Onboarding (CSR)
│   └── [slug]/
│       ├── dashboard/page.tsx      # Dashboard (SSR)
│       ├── students/page.tsx       # Estudiantes (CSR)
│       ├── courses/page.tsx        # Cursos (CSR)
│       └── enrollments/page.tsx    # Inscripciones (CSR)
│
├── components/
│   └── ui/
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Avatar.tsx
│       ├── ProgressBar.tsx
│       ├── StepIndicator.tsx
│       ├── SidebarItem.tsx
│       └── FlowArrow.tsx
│
└── features/
    ├── auth/
    │   └── components/LoginForm.tsx
    ├── business/
    │   ├── students/components/
    │   │   ├── StudentsTable.tsx
    │   │   └── NewStudentModal.tsx
    │   ├── courses/components/
    │   │   ├── CourseCard.tsx
    │   │   └── AddCourseCard.tsx
    │   └── enrollments/components/
    │       ├── EnrollmentsTable.tsx
    │       └── IdempotencyDemo.tsx
    └── tenants/
        └── components/
            ├── TenantsTable.tsx
            └── RateLimitAlert.tsx
```

---

## ⚙️ Dependencias necesarias

```bash
npm install lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

```json
// package.json (fragmento)
{
  "dependencies": {
    "lucide-react": "^0.383.0",
    "next": "^15.0.0",
    "react": "^18.3.0"
  }
}
```

### Iconos Lucide utilizados por página

| Página | Iconos |
|---|---|
| Landing | `Star`, `ChevronRight`, `Shield`, `Zap`, `BookOpen`, `Users`, `ClipboardList` |
| Login | `Lock`, `Mail`, `Eye`, `EyeOff`, `AlertCircle` |
| Registro | `Building2`, `MapPin`, `Key`, `Check` |
| Onboarding | `CheckCircle2`, `Loader2`, `Circle` |
| Dashboard | `LayoutDashboard`, `TrendingUp`, `TrendingDown` |
| Sidebar | `LayoutDashboard`, `Users`, `BookOpen`, `ClipboardList`, `Home`, `Settings` |
| Estudiantes | `Search`, `MoreHorizontal`, `SlidersHorizontal`, `X` |
| Cursos | `BookOpen`, `Users` |
| Inscripciones | `Key`, `CheckCircle`, `ArrowRight`, `Info` |
| Tenants | `AlertTriangle`, `Clock`, `ShieldAlert` |
| Flujo nav. | `Globe`, `Lock`, `LayoutDashboard`, `ArrowRight`, `ArrowDown` |

---

*Referencia visual interactiva: https://claude.ai/artifact/FPQQHssmtVRaEq38AZGEgT*
