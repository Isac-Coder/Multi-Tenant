import React from 'react';
import { Card } from '@/components/ui/Card';

interface Course {
  id: string;
  title: string;
  description: string;
}

export const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  return (
    <Card>
      <h3 className="text-lg font-bold">{course.title}</h3>
      <p className="text-gray-600">{course.description}</p>
    </Card>
  );
};
