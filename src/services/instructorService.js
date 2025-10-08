import api from "./api";

const instructorService = {
  getInstructors: async ({ pageSize = 8, pageIndex = 1, search = "" }) => {
    try {
      const response = await api.get("/Instructor/all", {
        params: {
          PageSize: pageSize,
          PageIndex: pageIndex,
          Search: search,
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  addInstructor: async (instructorData) => {
    try {
      const response = await api.post("/Instructor/add", instructorData, {
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

  updateInstructor: async (id, instructorData) => {
    try {
      const response = await api.put(
        `/Instructor/update/${id}`,
        instructorData,{
        headers: { "Content-Type": "multipart/form-data" },
      }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  deleteInstructor: async (id) => {
 
      const response = await api.delete(`/Instructor/delete/${id}`);


      return response.data;
   
  },
  getInstructorById: async (id) => {
    try {
      const response = await api.get(`/Instructor/${id}`);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
};

export default instructorService;
