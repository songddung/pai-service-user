export const USER_TOKENS = {
  // UseCase (Input Ports)
  SignupUseCase: Symbol('SignupUseCase'),
  LoginUseCase: Symbol('LoginUseCase'),
  LogoutUseCase: Symbol('LogoutUseCase'),
  RefreshTokenUseCase: Symbol('RefreshTokenUseCase'),
  CheckEmailDuplicateUseCase: Symbol('CheckEmailDuplicateUseCase'),
  CreateProfileUseCase: Symbol('CreateProfileUseCase'),
  SelectProfileUseCase: Symbol('SelectProfileUseCase'),
  UpdateProfileUseCase: Symbol('UpdateProfileUseCase'),
  DeleteProfileUseCase: Symbol('DeleteProfileUseCase'),
  GetParentProfilesUseCase: Symbol('GetParentProfilesUseCase'),
  GetChildProfilesUseCase: Symbol('GetChildProfilesUseCase'),

  // Repository (Output Ports - Write)
  UserRepositoryPort: Symbol('UserRepositoryPort'),
  ProfileRepositoryPort: Symbol('ProfileRepositoryPort'),
  RefreshTokenRepositoryPort: Symbol('RefreshTokenRepositoryPort'),
  TokenVersionRepositoryPort: Symbol('TokenVersionRepositoryPort'),

  // Query (Output Ports - Read)
  UserQueryPort: Symbol('UserQueryPort'),
  ProfileQueryPort: Symbol('ProfileQueryPort'),
  RefreshTokenQueryPort: Symbol('RefreshTokenQueryPort'),
  TokenVersionQueryPort: Symbol('TokenVersionQueryPort'),

  // External Services (Output Ports)
  KakaoAddressService: Symbol('KakaoAddressService'),
  GeocodingService: Symbol('GeocodingService'),

  // Security (Output Ports)
  TokenProvider: Symbol('TokenProvider'),
  PasswordHasher: Symbol('PasswordHasher'),
};
