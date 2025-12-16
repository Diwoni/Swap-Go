export type SendEmailCodeRequest = {
  email: string;
};

export type SendEmailCodeResponse = {
  message: string;
  expireIn: number;
};

export type VerifyEmailCodeRequest = {
  email: string;
  verificationCode: string;
};

export type VerifyEmailCodeResponse = {
  message: string;
  verificationToken: string;
};
