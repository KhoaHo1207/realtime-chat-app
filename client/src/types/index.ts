export type User = {
  _id: string;
  fullName: string;
  email: string;
  avatar?: Avatar;
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

export type Avatar = {
  public_id: string;
  url: string;
};
