import api from "./api";

const CourseService = {
  getCourses: async ({ pageSize, pageIndex, categoryId, search, sort }) => {
    try {
      const response = await api.get("/course/all", {
        params: {
          PageSize: pageSize,
          PageIndex: pageIndex,
          CategoryId: categoryId,
          Search: search,
          Sort: sort,
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.Message);
      }
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  getCategories: async () => {
    const response = await api.get("/Course/AllCategories");
    return response.data.data;
  },

   getInstructorsAndCategories: async () => {
    const response = await api.get("/Course/InstructorsAndCategories");
    return response.data.data;
  },

  createCourse: async (courseData) => {
    try {
      const response = await api.post("/course/add", courseData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data;
    } catch (e) {
      throw e;
    }
  },
  getCourseById: async (id) => {
    try {
      const response = await api.get(`/course/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  updateCourse: async (id, courseData) => {
    try {
      const response = await api.put(`/course/edit/${id}`, courseData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  deleteCourse: async (id) => {
    try {
      const response = await api.delete(`/course/delete/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return true;
    } catch (error) {
      throw error;
    }
  },
};

export default CourseService;
