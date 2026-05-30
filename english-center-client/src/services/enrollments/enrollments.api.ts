import { apiClient } from "@/config/api-client";

import type { Enrollment, ListEnrollmentsQuery } from "./enrollments.type";

const appendQuery = (url: string, query?: Record<string, unknown>): string => {
  if (!query) return url;

  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    params.set(key, String(value));
  });

  const queryString = params.toString();
  return queryString ? `${url}?${queryString}` : url;
};

export const enrollmentsApi = {
  listEnrollments: (query?: ListEnrollmentsQuery) =>
    apiClient.getWithMeta<Enrollment[]>(appendQuery("/enrollments", query)),

  myEnrollments: (query?: ListEnrollmentsQuery) =>
    apiClient.getWithMeta<Enrollment[]>(appendQuery("/enrollments/my", query)),
};
