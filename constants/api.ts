const BASE_URL = "https://sowlab.com/assignment/user";

interface ApiResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    full_name: string;
    email: string;
    avatar?: string;
    device_token?: string;
    type?: string;
    social_id?: string;
  };
  account_preference?: {
    locale: string;
    time_zone: string;
    currency: string;
  };
  is_verified?: boolean;
}

interface LoginParams {
  email: string;
  password: string;
  role?: string;
  socialId?: string;
  type?: string;
}

interface RegisterParams {
  full_name: string;
  email: string;
  password: string;
  phone: string;
  role?: string;
  device_token?: string;
  business_name?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  business_hours?: string;
  socialId?: string;
  type?: string;
}

interface ForgotPasswordParams {
  mobile: string;
}

interface VerifyOtpParams {
  mobile: string;
  otp: string;
}

interface ResetPasswordParams {
  mobile: string;
  password: string;
  confirm_password: string;
  otp: string;
}

async function apiRequest(
  endpoint: string,
  body: Record<string, any>,
): Promise<ApiResponse> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: "Network error. Please check your connection and try again.",
    };
  }
}

export async function loginWithEmail(
  params: LoginParams,
): Promise<ApiResponse> {
  return apiRequest("/login", {
    email: params.email,
    password: params.password,
    type: "email",
    role: params.role || "farmer",
  });
}

export async function loginWithGoogle(params: any): Promise<ApiResponse> {
  return apiRequest("/login", {
    email: params.email || "",
    password: params.password || "",
    socialId: params.socialId || "",
    type: "google",
    role: "farmer",
  });
}

export async function registerUser(
  params: RegisterParams,
): Promise<ApiResponse> {
  return apiRequest("/register", {
    full_name: params.full_name,
    email: params.email,
    password: params.password,
    phone: params.phone,
    social_id: params.socialId || "none",
    type: params.type || "email",
    role: params.role || "farmer",
    device_token: params.device_token || "expo-device",
    business_name: params.business_name || "",
    address: params.address || "",
    city: params.city || "",
    state: params.state || "",
    zip_code: params.zip_code || "",
    business_hours: params.business_hours || "",
  });
}

export async function forgotPassword(
  params: ForgotPasswordParams,
): Promise<ApiResponse> {
  return apiRequest("/forgot-password", {
    mobile: params.mobile,
  });
}

export async function verifyOtp(params: VerifyOtpParams): Promise<ApiResponse> {
  return apiRequest("/verify-otp", {
    mobile: params.mobile,
    otp: params.otp,
  });
}

export async function resetPassword(
  params: ResetPasswordParams,
): Promise<ApiResponse> {
  return apiRequest("/reset-password", {
    mobile: params.mobile,
    password: params.password,
    confirm_password: params.confirm_password,
    otp: params.otp,
  });
}

export type {
    ApiResponse,
    ForgotPasswordParams,
    LoginParams,
    RegisterParams,
    ResetPasswordParams,
    VerifyOtpParams
};

