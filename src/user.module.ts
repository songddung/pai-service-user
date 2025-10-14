import { Module } from '@nestjs/common';

// Controllers
import { SignupController } from './adapter/in/http/controllers/signup.controller';
import { LoginController } from './adapter/in/http/controllers/login.controller';
import { CreateProfileController } from './adapter/in/http/controllers/create-profile.controller';
import { CheckEmailController } from './adapter/in/http/controllers/check-email.controller';
import { GetParentProfilesController } from './adapter/in/http/controllers/get-parent-profiles.controller';
import { GetChildProfilesController } from './adapter/in/http/controllers/get-child-profiles.controller';

// Tokens
import { USER_TOKENS } from './user.token';

// UseCase 구현체
import { SignupService } from './application/use-cases/signup.service';
import { LoginService } from './application/use-cases/login.service';
import { CheckEmailDuplicateService } from './application/use-cases/check-email-duplicate.service';
import { CreateProfileService } from './application/use-cases/create-profile.service';
import { GetParentProfilesService } from './application/use-cases/get-parent-profiles.service';
import { GetChildProfilesService } from './application/use-cases/get-child-profiles.service';

// Query Adapter 구현체
import { UserQueryAdapter } from './adapter/out/persistence/prisma/user.query.adapter';
import { ProfileQueryAdapter } from './adapter/out/persistence/prisma/profile.query.adapter';

// Repository Adapter 구현체
import { UserRepositoryAdapter } from './adapter/out/persistence/prisma/user.repository.adapter';
import { ProfileRepositoryAdapter } from './adapter/out/persistence/prisma/profile.repository.adapter';

// Kakao API Adapter 구현체
import { KakaoAddressAdapter } from './adapter/out/http/kakao/kakao-address.adapter';

// Mapper
import { SignupMapper } from './mapper/signup.mapper';
import { LoginMapper } from './mapper/login.mapper';
import { ProfileMapper } from './mapper/profile.mapper';

// Guard
import { BasicAuthGuard } from './adapter/in/http/auth/guards/basic-auth.guard';
import { ParentGuard } from './adapter/in/http/auth/guards/parent.guard';

import { AuthModule } from './adapter/out/security/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [
    SignupController,
    LoginController,
    CheckEmailController,
    CreateProfileController,
    GetParentProfilesController,
    GetChildProfilesController,
  ],
  providers: [
    // Guard
    BasicAuthGuard,
    ParentGuard,

    // Mapper
    SignupMapper,
    LoginMapper,
    ProfileMapper,

    // UseCase 바인딩
    { provide: USER_TOKENS.SignupUseCase, useClass: SignupService },
    { provide: USER_TOKENS.LoginUseCase, useClass: LoginService },
    { provide: USER_TOKENS.CreateProfileUseCase, useClass: CreateProfileService },
    {
      provide: USER_TOKENS.CheckEmailDuplicateUseCase,
      useClass: CheckEmailDuplicateService,
    },
    { provide: USER_TOKENS.GetParentProfilesUseCase, useClass: GetParentProfilesService },
    { provide: USER_TOKENS.GetChildProfilesUseCase, useClass: GetChildProfilesService },

    // Query 바인딩 (읽기)
    { provide: USER_TOKENS.UserQueryPort, useClass: UserQueryAdapter },
    { provide: USER_TOKENS.ProfileQueryPort, useClass: ProfileQueryAdapter },

    // Repository 바인딩 (쓰기)
    { provide: USER_TOKENS.UserRepositoryPort, useClass: UserRepositoryAdapter },
    { provide: USER_TOKENS.ProfileRepositoryPort, useClass: ProfileRepositoryAdapter },

    // External API 바인딩 (Kakao)
    { provide: USER_TOKENS.KakaoAddressService, useClass: KakaoAddressAdapter },
  ],
})
export class UserModule {}
