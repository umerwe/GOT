export interface SocialLoginData {
  token: string;
  unique_id: string;
  email: string | null | undefined;
  medium: string;
}

export interface SocialLoginResult {
  data: {
    auth_token: string;
    id: string | number;
  };
}

export interface SocialLoginResponse {
  user: {
    name: string;
    email: string;
    image: string;
  };
  expires: string;
  socialLoginResult: {
    message: string;
    data: {
      id: number;
      name: string;
      email: string;
      email_verified_at: string | null;
      dob: string | null;
      blood: string | null;
      phoneNumber: string | null;
      coverImage: string | null;
      status: number;
      licenseCategory: string | null;
      licenceCountry: string | null;
      bikeType: string | null;
      emergencyContact: string | null;
      medicalCondition: string | null;
      mileage: string | null;
      isPremium: number;
      profileCompletd: number;
      login_medium: "google" | "facebook" | "apple" | string;
      auth_token: string;
      fcm_token: string | null;
      latitude: string | null;
      longitude: string | null;
      created_at: string;
      updated_at: string;
    };
  };
}

export interface ExtendedSession {
  socialLoginResult?: SocialLoginResult;
}