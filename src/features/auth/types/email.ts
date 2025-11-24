export type SendEmailCodeRequest = {
  email: string;
};

export type SendEmailCodeResponse = {
  message: string;
  expireIn: number;
};

export type VerifyEmailCodeRepuest = {
  email: string;
  code: string;
};

export type VerifyEmailCodeResponse = {
  message: string;
  verificationToken: string;
};
