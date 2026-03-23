export interface User {
  _id: string;
  fullName: string;
  email: string;
  avatar?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}
