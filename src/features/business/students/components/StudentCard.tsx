import React from 'react';
import { Card } from '@/components/ui/Card';

interface Student {
  id: string;
  name: string;
  email: string;
}

export const StudentCard: React.FC<{ student: Student }> = ({ student }) => {
  return (
    <Card>
      <h3 className="text-lg font-bold">{student.name}</h3>
      <p className="text-gray-600">{student.email}</p>
    </Card>
  );
};
