export type User = {
  _id: string;
  fullName: string;
  email: string;
  avatar?: string;
};

export type LoginFormData = {
  email: string;
  password: string;
};

export type RegisterFormData = {
  email: string;
  password: string;
  fullName: string;
  confirmPassword?: string;
};
