import axios from "axios";
import { clearLoginTimestamp, isSessionExpired } from "@/lib/auth-session";
import { getAuth, signOut } from "firebase/auth";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_API_BASE_URL,
});

apiClient.interceptors.request.use(
  async (config) => {
    const auth = getAuth();

    // Check local session before attaching token
    if (isSessionExpired()) {
      await signOut(auth);
      clearLoginTimestamp();
      // Optionally redirect or force page reload
      window.location.href = "/login";
      return Promise.reject("Session Expired");
    }

    const user = auth.currentUser;

    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default apiClient;
