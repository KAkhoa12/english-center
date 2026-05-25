import { create } from "zustand";

import { coursesApi } from "./courses.api";
import type { Pagination } from "@/shared/types/response";
import type {
  CourseDetail,
  CourseListItem,
  CourseOutcome,
  CourseRequirement,
  CreateCourseOutcomeRequest,
  CreateCourseRequest,
  CreateCourseRequirementRequest,
  ListCoursesQuery,
  UpdateCourseOutcomeRequest,
  UpdateCourseRequest,
  UpdateCourseRequirementRequest,
} from "./courses.type";

type CoursesState = {
  courses: CourseListItem[];
  pagination: Pagination | null;
  selectedCourse: CourseDetail | null;
  requirements: CourseRequirement[];
  outcomes: CourseOutcome[];
  isLoading: boolean;
  error: string | null;

  listCourses: (query?: ListCoursesQuery) => Promise<CourseListItem[]>;
  getCourse: (courseId: string) => Promise<CourseDetail>;
  createCourse: (data: CreateCourseRequest) => Promise<CourseDetail>;
  updateCourse: (courseId: string, data: UpdateCourseRequest) => Promise<CourseDetail>;
  uploadCourseThumbnail: (courseId: string, file: File) => Promise<void>;
  deleteCourse: (courseId: string) => Promise<void>;

  listRequirements: (courseId: string) => Promise<CourseRequirement[]>;
  createRequirement: (
    courseId: string,
    data: CreateCourseRequirementRequest
  ) => Promise<CourseRequirement>;
  updateRequirement: (
    requirementId: string,
    data: UpdateCourseRequirementRequest
  ) => Promise<CourseRequirement>;
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
  isLoading: false,
  error: null,

  listCourses: async (query) => {
    try {
      set({ isLoading: true, error: null });

      const response = await coursesApi.listCourses(query);
      set({
        courses: response.payload,
        pagination: response.pagination ?? null,
        isLoading: false,
        error: null,
      });

      return response.payload;
    } catch {
      set({ isLoading: false, error: "Lấy danh sách khóa học thất bại" });
      throw new Error("Lấy danh sách khóa học thất bại");
    }
  },

  getCourse: async (courseId) => {
    try {
      set({ isLoading: true, error: null });

      const course = await coursesApi.getCourse(courseId);
      set({
        selectedCourse: course,
        requirements: course.requirements ?? [],
        outcomes: course.outcomes ?? [],
        isLoading: false,
        error: null,
      });

      return course;
    } catch {
      set({ isLoading: false, error: "Lấy thông tin khóa học thất bại" });
      throw new Error("Lấy thông tin khóa học thất bại");
    }
  },

  createCourse: async (data) => {
    try {
      set({ isLoading: true, error: null });

      const newCourse = await coursesApi.createCourse(data);
      set((state) => ({
        courses: [newCourse, ...state.courses],
        selectedCourse: newCourse,
        requirements: newCourse.requirements ?? [],
        outcomes: newCourse.outcomes ?? [],
        isLoading: false,
        error: null,
      }));

      return newCourse;
    } catch {
      set({ isLoading: false, error: "Tạo khóa học thất bại" });
      throw new Error("Tạo khóa học thất bại");
    }
  },

  updateCourse: async (courseId, data) => {
    try {
      set({ isLoading: true, error: null });

      const updated = await coursesApi.updateCourse(courseId, data);
      set((state) => ({
        courses: state.courses.map((item) => (item.id === updated.id ? updated : item)),
        selectedCourse: state.selectedCourse?.id === updated.id ? updated : state.selectedCourse,
        requirements: updated.requirements ?? state.requirements,
        outcomes: updated.outcomes ?? state.outcomes,
        isLoading: false,
        error: null,
      }));

      return updated;
    } catch {
      set({ isLoading: false, error: "Cập nhật khóa học thất bại" });
      throw new Error("Cập nhật khóa học thất bại");
    }
  },

  uploadCourseThumbnail: async (courseId, file) => {
    try {
      set({ isLoading: true, error: null });

      const result = await coursesApi.uploadCourseThumbnail(courseId, file);
      set((state) => ({
        courses: state.courses.map((item) =>
          item.id === courseId ? { ...item, thumbnail_url: result.thumbnail_url } : item
        ),
        selectedCourse:
          state.selectedCourse?.id === courseId
            ? { ...state.selectedCourse, thumbnail_url: result.thumbnail_url }
            : state.selectedCourse,
        isLoading: false,
        error: null,
      }));
    } catch {
      set({ isLoading: false, error: "Tải ảnh khóa học thất bại" });
      throw new Error("Tải ảnh khóa học thất bại");
    }
  },

  deleteCourse: async (courseId) => {
    try {
      set({ isLoading: true, error: null });

      await coursesApi.deleteCourse(courseId);
      set((state) => ({
        courses: state.courses.filter((item) => item.id !== courseId),
        selectedCourse: state.selectedCourse?.id === courseId ? null : state.selectedCourse,
        requirements: state.selectedCourse?.id === courseId ? [] : state.requirements,
        outcomes: state.selectedCourse?.id === courseId ? [] : state.outcomes,
        isLoading: false,
        error: null,
      }));
    } catch {
      set({ isLoading: false, error: "Xóa khóa học thất bại" });
      throw new Error("Xóa khóa học thất bại");
    }
  },

  listRequirements: async (courseId) => {
    try {
      set({ isLoading: true, error: null });

      const requirements = await coursesApi.listRequirements(courseId);
      set({ requirements, isLoading: false, error: null });

      return requirements;
    } catch {
      set({ isLoading: false, error: "Lấy danh sách yêu cầu thất bại" });
      throw new Error("Lấy danh sách yêu cầu thất bại");
    }
  },

  createRequirement: async (courseId, data) => {
    try {
      set({ isLoading: true, error: null });

      const requirement = await coursesApi.createRequirement(courseId, data);
      set((state) => ({
        requirements: [...state.requirements, requirement],
        selectedCourse: state.selectedCourse
          ? { ...state.selectedCourse, requirements: [...state.requirements, requirement] }
          : state.selectedCourse,
        isLoading: false,
        error: null,
      }));

      return requirement;
    } catch {
      set({ isLoading: false, error: "Tạo yêu cầu thất bại" });
      throw new Error("Tạo yêu cầu thất bại");
    }
  },

  updateRequirement: async (requirementId, data) => {
    try {
      set({ isLoading: true, error: null });

      const requirement = await coursesApi.updateRequirement(requirementId, data);
      set((state) => {
        const requirements = state.requirements.map((item) =>
          item.id === requirement.id ? requirement : item
        );

        return {
          requirements,
          selectedCourse: state.selectedCourse
            ? { ...state.selectedCourse, requirements }
            : state.selectedCourse,
          isLoading: false,
          error: null,
        };
      });

      return requirement;
    } catch {
      set({ isLoading: false, error: "Cập nhật yêu cầu thất bại" });
      throw new Error("Cập nhật yêu cầu thất bại");
    }
  },

  deleteRequirement: async (requirementId) => {
    try {
      set({ isLoading: true, error: null });

      await coursesApi.deleteRequirement(requirementId);
      set((state) => {
        const requirements = state.requirements.filter((item) => item.id !== requirementId);

        return {
          requirements,
          selectedCourse: state.selectedCourse
            ? { ...state.selectedCourse, requirements }
            : state.selectedCourse,
          isLoading: false,
          error: null,
        };
      });
    } catch {
      set({ isLoading: false, error: "Xóa yêu cầu thất bại" });
      throw new Error("Xóa yêu cầu thất bại");
    }
  },

  listOutcomes: async (courseId) => {
    try {
      set({ isLoading: true, error: null });

      const outcomes = await coursesApi.listOutcomes(courseId);
      set({ outcomes, isLoading: false, error: null });

      return outcomes;
    } catch {
      set({ isLoading: false, error: "Lấy danh sách kết quả đầu ra thất bại" });
      throw new Error("Lấy danh sách kết quả đầu ra thất bại");
    }
  },

  createOutcome: async (courseId, data) => {
    try {
      set({ isLoading: true, error: null });

      const outcome = await coursesApi.createOutcome(courseId, data);
      set((state) => ({
        outcomes: [...state.outcomes, outcome],
        selectedCourse: state.selectedCourse
          ? { ...state.selectedCourse, outcomes: [...state.outcomes, outcome] }
          : state.selectedCourse,
        isLoading: false,
        error: null,
      }));

      return outcome;
    } catch {
      set({ isLoading: false, error: "Tạo kết quả đầu ra thất bại" });
      throw new Error("Tạo kết quả đầu ra thất bại");
    }
  },

  updateOutcome: async (outcomeId, data) => {
    try {
      set({ isLoading: true, error: null });

      const outcome = await coursesApi.updateOutcome(outcomeId, data);
      set((state) => {
        const outcomes = state.outcomes.map((item) => (item.id === outcome.id ? outcome : item));

        return {
          outcomes,
          selectedCourse: state.selectedCourse ? { ...state.selectedCourse, outcomes } : state.selectedCourse,
          isLoading: false,
          error: null,
        };
      });

      return outcome;
    } catch {
      set({ isLoading: false, error: "Cập nhật kết quả đầu ra thất bại" });
      throw new Error("Cập nhật kết quả đầu ra thất bại");
    }
  },

  deleteOutcome: async (outcomeId) => {
    try {
      set({ isLoading: true, error: null });

      await coursesApi.deleteOutcome(outcomeId);
      set((state) => {
        const outcomes = state.outcomes.filter((item) => item.id !== outcomeId);

        return {
          outcomes,
          selectedCourse: state.selectedCourse ? { ...state.selectedCourse, outcomes } : state.selectedCourse,
          isLoading: false,
          error: null,
        };
      });
    } catch {
      set({ isLoading: false, error: "Xóa kết quả đầu ra thất bại" });
      throw new Error("Xóa kết quả đầu ra thất bại");
    }
  },

  clearSelectedCourse: () => {
    set({
      selectedCourse: null,
      requirements: [],
      outcomes: [],
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));
