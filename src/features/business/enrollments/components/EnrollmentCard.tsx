import React from 'react';
import { Card } from '@/components/ui/Card';

interface Enrollment {
  id: string;
  studentName: string;
  courseTitle: string;
  date: string;
}

export const EnrollmentCard: React.FC<{ enrollment: Enrollment }> = ({ enrollment }) => {
  return (
    <Card>
      <h3 className="text-lg font-bold">Inscripción: {enrollment.courseTitle}</h3>
      <p className="text-gray-600">Estudiante: {enrollment.studentName}</p>
      <p className="text-sm text-gray-500">Fecha: {enrollment.date}</p>
    </Card>
  );
};
