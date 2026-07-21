import { useEffect, useState } from "react";

import {
  CourseCenterCard,
  CourseTemplateCard,
  CourseTitleCta,
  FilterCourse,
  HeroSection,
  PlacementTestCtaSection,
} from "@/components/Main/CoursePage";
import { useCoursesStore } from "@/services/courses/courses.store";
import type { CourseListItem } from "@/services/courses/courses.type";
import { useCoursesCategoryStore } from "@/services/coursesCategory/coursesCategory.store";
import { PUBLIC_ROUTES } from "@/shared/routes";

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const { courses, listCourses } = useCoursesStore();
  const { categories, listCategories } = useCoursesCategoryStore();
  const tags: any[] = [];

  useEffect(() => {
    void listCategories({ page: 1, page_size: 100, status: "active", sort_by: "name", sort_order: "asc" });
  }, [listCategories]);

  useEffect(() => {
    let mounted = true;

    const loadCourses = async () => {
      setLoading(true);
      try {
        await listCourses({
          page: 1,
          page_size: 100,
          search: search.trim() || undefined,
          category_id: categoryId || undefined,
          tag_ids: tagIds.length ? tagIds : undefined,
        });
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void loadCourses();

    return () => {
      mounted = false;
    };
  }, [search, categoryId, tagIds, listCourses]);

  const courseCenters = courses.filter((course) => course.mode === "center");
  const courseTemplates = courses.filter((course) => course.mode === "template");

  return (
    <>
      <HeroSection />
      <FilterCourse
        search={search}
        categoryId={categoryId}
        tagIds={tagIds}
        categories={categories}
        tags={tags}
        onSearchChange={setSearch}
        onCategoryChange={setCategoryId}
        onTagIdsChange={setTagIds}
      />
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <CourseTitleCta
            name="Khóa học tại trung tâm"
            title="Chọn chương trình học phù hợp với mục tiêu của bạn"
            description="Các khóa học trung tâm được sắp xếp theo trình độ, mục tiêu và nhịp học thực tế."
            titleLink="Xem thêm"
            link={PUBLIC_ROUTES.COURSE}
          />

          {loading ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-[420px] animate-pulse rounded-2xl border border-line bg-surface" />
              ))}
            </div>
          ) : courseCenters.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {courseCenters.map((course: CourseListItem) => (
                <CourseCenterCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-line px-6 py-14 text-center text-sm text-muted">
              Không có khóa học phù hợp với bộ lọc hiện tại.
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <CourseTitleCta
            name="Khóa học có sẵn"
            title="Chọn chương trình học phù hợp với mục tiêu của bạn"
            description="Các khóa học có sẵn được sắp xếp theo trình độ, mục tiêu và nhịp học thực tế."
            titleLink="Xem thêm"
            link={PUBLIC_ROUTES.COURSE}
          />

          {loading ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-[420px] animate-pulse rounded-2xl border border-line bg-surface" />
              ))}
            </div>
          ) : courseTemplates.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-2">
              {courseTemplates.map((course: CourseListItem) => (
                <CourseTemplateCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-line px-6 py-14 text-center text-sm text-muted">
              Không có khóa học phù hợp với bộ lọc hiện tại.
            </div>
          )}
        </div>
      </section>

      <PlacementTestCtaSection />
    </>
  );
}
