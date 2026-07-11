import { CourseCenterClassesSection } from "@/components/Dashboard/Courses/CourseCenterClassesSection";
import type { ClassCreateRequest, ClassItem, ClassUpdateRequest } from "@/services/classes/classes.type";

type CourseCenterProps = {
  courseId: string;
  courseName: string;
  classes: ClassItem[];
  onCreateClass: (payload: ClassCreateRequest) => Promise<void>;
  onUpdateClass: (classId: string, payload: ClassUpdateRequest) => Promise<void>;
  onDeleteClass: (classId: string) => Promise<void>;
};

export function CourseCenter({ courseId, courseName, classes, onCreateClass, onUpdateClass, onDeleteClass }: CourseCenterProps) {
  return (
    <div className="space-y-5">
      <CourseCenterClassesSection
        courseId={courseId}
        courseName={courseName}
        classes={classes}
        onCreateClass={onCreateClass}
        onUpdateClass={onUpdateClass}
        onDeleteClass={onDeleteClass}
      />
    </div>
  );
}

export default CourseCenter;
