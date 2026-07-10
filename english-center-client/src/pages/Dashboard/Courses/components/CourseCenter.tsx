import { CourseClassSchedulesSection } from "@/components/Dashboard/Courses/CourseClassSchedulesSection";
import { CourseCenterClassesSection } from "@/components/Dashboard/Courses/CourseCenterClassesSection";
import type { ClassItem, ClassCreateRequest } from "@/services/classes/classes.type";

type CourseCenterProps = {
  courseId: string;
  courseName: string;
  classes: ClassItem[];
  onCreateClass: (payload: ClassCreateRequest) => Promise<void>;
  onDeleteClass: (classId: string) => Promise<void>;
};

export function CourseCenter({ courseId, courseName, classes, onCreateClass, onDeleteClass }: CourseCenterProps) {
  return (
    <div className="space-y-5">
      <CourseClassSchedulesSection classes={classes} />
      <CourseCenterClassesSection
        courseId={courseId}
        courseName={courseName}
        classes={classes}
        onCreateClass={onCreateClass}
        onDeleteClass={onDeleteClass}
      />
    </div>
  );
}

export default CourseCenter;
