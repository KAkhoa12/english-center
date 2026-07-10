import { CourseTemplateModulesSection } from "@/components/Dashboard/Courses/CourseTemplateModulesSection";

type CourseTemplateProps = {
  courseId: string;
};

export function CourseTemplate({ courseId }: CourseTemplateProps) {
  return <CourseTemplateModulesSection courseId={courseId} />;
}

export default CourseTemplate;
