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

export type Message = {
  _id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  media?: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateProfileFormData = {
  fullName: string;
  email: string;
  avatar?: Avatar | string;
};
