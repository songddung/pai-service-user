export interface CheckEmailDuplicateUseCase {
  execute(email: string): Promise<CheckEmailDuplicateResult>;
}

export interface CheckEmailDuplicateResult {
  isAvailable: boolean; // true: 사용 가능, false: 이미 사용 중
  message: string;
}
