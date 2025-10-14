export const USER_TOKENS = {
  // UseCase (Input Ports)
  SignupUseCase: Symbol('SignupUseCase'),
  LoginUseCase: Symbol('LoginUseCase'),
  CheckEmailDuplicateUseCase: Symbol('CheckEmailDuplicateUseCase'),
  CreateProfileUseCase: Symbol('CreateProfileUseCase'),
  GetParentProfilesUseCase: Symbol('GetParentProfilesUseCase'),
  GetChildProfilesUseCase: Symbol('GetChildProfilesUseCase'),

  // Repository (Output Ports - Write)
  UserRepositoryPort: Symbol('UserRepositoryPort'),
  ProfileRepositoryPort: Symbol('ProfileRepositoryPort'),

  // Query (Output Ports - Read)
  UserQueryPort: Symbol('UserQueryPort'),
  ProfileQueryPort: Symbol('ProfileQueryPort'),

  // External Services (Output Ports)
  KakaoAddressService: Symbol('KakaoAddressService'),
  GeocodingService: Symbol('GeocodingService'),

  // Security (Output Ports)
  TokenProvider: Symbol('TokenProvider'),
  PasswordHasher: Symbol('PasswordHasher'),
};
