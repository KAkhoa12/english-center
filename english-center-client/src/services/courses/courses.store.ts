import { create } from "zustand";

import type { ApiResponse, Pagination } from "@/shared/types/response";

import { coursesApi } from "./courses.api";
import type {
  CourseDetail,
  CourseListItem,
  CourseOutcome,
  CourseRequirement,
  CourseStatistic,
  CreateCourseOutcomeRequest,
  CreateCourseRequest,
  CreateCourseRequirementRequest,
  ListCoursesQuery,
  UpdateCourseOutcomeRequest,
  UpdateCourseRequest,
  UpdateCourseRequirementRequest,
} from "./courses.type";

const unwrap = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (!response.success) throw new Error(response.message || fallbackMessage);
  return response.payload;
};

type CoursesState = {
  courses: CourseListItem[];
  pagination: Pagination | null;
  selectedCourse: CourseDetail | null;
  requirements: CourseRequirement[];
  outcomes: CourseOutcome[];
  statistics: CourseStatistic[];
  isLoading: boolean;
  error: string | null;

  listCourses: (query?: ListCoursesQuery) => Promise<CourseListItem[]>;
  getCourse: (courseId: string) => Promise<CourseDetail>;
  getCourseBySlug: (slug: string) => Promise<CourseDetail>;
  getCourseStatistics: (mode: "center" | "template") => Promise<CourseStatistic[]>;
  createCourse: (data: CreateCourseRequest) => Promise<CourseDetail>;
  updateCourse: (courseId: string, data: UpdateCourseRequest) => Promise<CourseDetail>;
  uploadCourseThumbnail: (courseId: string, file: File) => Promise<void>;
  deleteCourse: (courseId: string) => Promise<void>;
  listRequirements: (courseId: string) => Promise<CourseRequirement[]>;
  createRequirement: (courseId: string, data: CreateCourseRequirementRequest) => Promise<CourseRequirement>;
  updateRequirement: (requirementId: string, data: UpdateCourseRequirementRequest) => Promise<CourseRequirement>;
  deleteRequirement: (requirementId: string) => Promise<void>;
  listOutcomes: (courseId: string) => Promise<CourseOutcome[]>;
  createOutcome: (courseId: string, data: CreateCourseOutcomeRequest) => Promise<CourseOutcome>;
  updateOutcome: (outcomeId: string, data: UpdateCourseOutcomeRequest) => Promise<CourseOutcome>;
  deleteOutcome: (outcomeId: string) => Promise<void>;
  clearSelectedCourse: () => void;
  clearError: () => void;
};

export const useCoursesStore = create<CoursesState>()((set) => ({
  courses: [],
  pagination: null,
  selectedCourse: null,
  requirements: [],
  outcomes: [],
  statistics: [],
  isLoading: false,
  error: null,

  listCourses: async (query) => {
    const response = await coursesApi.listCourses(query);
    const courses = unwrap(response, "Lay danh sach khoa hoc that bai");
    set({ courses, pagination: response.pagination ?? null });
    return courses;
  },

  getCourse: async (courseId) => {
    const response = await coursesApi.getCourse(courseId);
    const course = unwrap(response, "Lay thong tin khoa hoc that bai");
    set({ selectedCourse: course, requirements: course.requirements ?? [], outcomes: course.outcomes ?? [] });
    return course;
  },

  getCourseBySlug: async (slug) => {
    const response = await coursesApi.getCourseBySlug(slug);
    const course = unwrap(response, "Lay thong tin khoa hoc that bai");
    set({ selectedCourse: course, requirements: course.requirements ?? [], outcomes: course.outcomes ?? [] });
    return course;
  },

  getCourseStatistics: async (mode) => {
    set({ isLoading: true, error: null });
    try {
      const response = await coursesApi.getCourseStatistics(mode);
      const statistics = unwrap(response, "Lay thong ke khoa hoc that bai");
      set({ statistics, isLoading: false });
      return statistics;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Lay thong ke khoa hoc that bai";
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  createCourse: async (data) => {
    const response = await coursesApi.createCourse(data);
    const newCourse = unwrap(response, "Tao khoa hoc that bai");
    set((state) => ({
      courses: [newCourse, ...state.courses],
      selectedCourse: newCourse,
      requirements: newCourse.requirements ?? [],
      outcomes: newCourse.outcomes ?? [],
    }));
    return newCourse;
  },

  updateCourse: async (courseId, data) => {
    const response = await coursesApi.updateCourse(courseId, data);
    const updated = unwrap(response, "Cap nhat khoa hoc that bai");
    set((state) => ({
      courses: state.courses.map((item) => (item.id === updated.id ? updated : item)),
      selectedCourse: state.selectedCourse?.id === updated.id ? updated : state.selectedCourse,
      requirements: updated.requirements ?? state.requirements,
      outcomes: updated.outcomes ?? state.outcomes,
    }));
    return updated;
  },

  uploadCourseThumbnail: async (courseId, file) => {
    const response = await coursesApi.uploadCourseThumbnail(courseId, file);
    const result = unwrap(response, "Tai anh khoa hoc that bai");
    set((state) => ({
      courses: state.courses.map((item) =>
        item.id === courseId ? { ...item, thumbnail_url: result.thumbnail_url } : item
      ),
      selectedCourse:
        state.selectedCourse?.id === courseId
          ? { ...state.selectedCourse, thumbnail_url: result.thumbnail_url }
          : state.selectedCourse,
    }));
  },

  deleteCourse: async (courseId) => {
    const response = await coursesApi.deleteCourse(courseId);
    unwrap(response, "Xoa khoa hoc that bai");
    set((state) => ({
      courses: state.courses.filter((item) => item.id !== courseId),
      selectedCourse: state.selectedCourse?.id === courseId ? null : state.selectedCourse,
      requirements: state.selectedCourse?.id === courseId ? [] : state.requirements,
      outcomes: state.selectedCourse?.id === courseId ? [] : state.outcomes,
    }));
  },

  listRequirements: async (courseId) => {
    const response = await coursesApi.listRequirements(courseId);
    const requirements = unwrap(response, "Lay danh sach yeu cau that bai");
    set({ requirements });
    return requirements;
  },

  createRequirement: async (courseId, data) => {
    const response = await coursesApi.createRequirement(courseId, data);
    const requirement = unwrap(response, "Tao yeu cau that bai");
    set((state) => ({
      requirements: [...state.requirements, requirement],
      selectedCourse: state.selectedCourse
        ? { ...state.selectedCourse, requirements: [...state.requirements, requirement] }
        : state.selectedCourse,
    }));
    return requirement;
  },

  updateRequirement: async (requirementId, data) => {
    const response = await coursesApi.updateRequirement(requirementId, data);
    const requirement = unwrap(response, "Cap nhat yeu cau that bai");
    set((state) => {
      const requirements = state.requirements.map((item) =>
        item.id === requirement.id ? requirement : item
      );
      return {
        requirements,
        selectedCourse: state.selectedCourse ? { ...state.selectedCourse, requirements } : state.selectedCourse,
      };
    });
    return requirement;
  },

  deleteRequirement: async (requirementId) => {
    const response = await coursesApi.deleteRequirement(requirementId);
    unwrap(response, "Xoa yeu cau that bai");
    set((state) => {
      const requirements = state.requirements.filter((item) => item.id !== requirementId);
      return {
        requirements,
        selectedCourse: state.selectedCourse ? { ...state.selectedCourse, requirements } : state.selectedCourse,
      };
    });
  },

  listOutcomes: async (courseId) => {
    const response = await coursesApi.listOutcomes(courseId);
    const outcomes = unwrap(response, "Lay danh sach ket qua dau ra that bai");
    set({ outcomes });
    return outcomes;
  },

  createOutcome: async (courseId, data) => {
    const response = await coursesApi.createOutcome(courseId, data);
    const outcome = unwrap(response, "Tao ket qua dau ra that bai");
    set((state) => ({
      outcomes: [...state.outcomes, outcome],
      selectedCourse: state.selectedCourse
        ? { ...state.selectedCourse, outcomes: [...state.outcomes, outcome] }
        : state.selectedCourse,
    }));
    return outcome;
  },

  updateOutcome: async (outcomeId, data) => {
    const response = await coursesApi.updateOutcome(outcomeId, data);
    const outcome = unwrap(response, "Cap nhat ket qua dau ra that bai");
    set((state) => {
      const outcomes = state.outcomes.map((item) => (item.id === outcome.id ? outcome : item));
      return {
        outcomes,
        selectedCourse: state.selectedCourse ? { ...state.selectedCourse, outcomes } : state.selectedCourse,
      };
    });
    return outcome;
  },

  deleteOutcome: async (outcomeId) => {
    const response = await coursesApi.deleteOutcome(outcomeId);
    unwrap(response, "Xoa ket qua dau ra that bai");
    set((state) => {
      const outcomes = state.outcomes.filter((item) => item.id !== outcomeId);
      return {
        outcomes,
        selectedCourse: state.selectedCourse ? { ...state.selectedCourse, outcomes } : state.selectedCourse,
      };
    });
  },

  clearSelectedCourse: () => set({ selectedCourse: null, requirements: [], outcomes: [] }),
  clearError: () => set({ error: null }),
}));
