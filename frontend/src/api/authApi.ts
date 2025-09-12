import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface User {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface TokenVerificationResponse {
  valid: boolean;
  user_id: number;
}

class AuthApi {
  private baseURL = `${API_BASE_URL}/api/auth`;

  // Set token in localStorage and axios headers
  setToken(token: string) {
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  // Remove token from localStorage and axios headers
  clearToken() {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  }

  // Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem("token");
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Login user
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/login`, credentials);
      const { access_token, token_type } = response.data;

      this.setToken(access_token);
      return { access_token, token_type };
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Login failed");
    }
  }

  // Signup user
  async signup(userData: SignupRequest): Promise<User> {
    try {
      const response = await axios.post(`${this.baseURL}/signup`, userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Signup failed");
    }
  }

  // Get current user info
  async getCurrentUser(): Promise<User> {
    try {
      const response = await axios.get(`${this.baseURL}/me`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail || "Failed to get user info"
      );
    }
  }

  // Verify token
  async verifyToken(): Promise<TokenVerificationResponse> {
    try {
      const response = await axios.get(`${this.baseURL}/verify-token`);
      return response.data;
    } catch (error: any) {
      throw new Error("Token verification failed");
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await axios.post(`${this.baseURL}/logout`);
    } catch (error) {
      // Even if logout fails on server, clear local token
      console.warn("Logout request failed, but clearing local token");
    } finally {
      this.clearToken();
    }
  }

  // Initialize auth state on app start
  async initializeAuth(): Promise<User | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      this.setToken(token);
      const user = await this.getCurrentUser();
      return user;
    } catch (error) {
      this.clearToken();
      return null;
    }
  }
}

export const authApi = new AuthApi();
