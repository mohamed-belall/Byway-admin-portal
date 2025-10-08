import api from "./api";

const authService = {
  login: async (credentials) => {
    console.log(credentials);
    const response = await api.post("/Account/loginAdmin", credentials);
    console.log(response);

    if (!response.data.success) {
      throw new Error(response.data.message || "Login failed");
    }

    if (response.data.success && response.data.data.token) {
      localStorage.setItem("token", response.data.data.token);
    
    }

    return {
      user: {
        displayName: response.data.data.displayName,
        email: response.data.data.email,
      },
      token: response.data.data.token,
   
    };
  },
  logout: async () => {
    localStorage.removeItem("token");
   
    // localStorage.removeItem("role");

    const response  = await api.post("/Account/logout");
        if (!response.data.success) {
      throw new Error(response.data.message || "logout failed");
    }
  },
};

export default authService;
