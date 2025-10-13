import { Module } from '@nestjs/common';

// Controllers
import { SignupController } from './adapter/in/http/controllers/signup.controller';
import { LoginController } from './adapter/in/http/controllers/login.controller';
import { CreateProfileController } from './adapter/in/http/controllers/create-profile.controller';
import { CheckEmailController } from './adapter/in/http/controllers/check-email.controller';

// UseCase 구현체
import { SignupService } from './application/use-cases/signup.service';
import { LoginService } from './application/use-cases/login.service';
import { CheckEmailDuplicateService } from './application/use-cases/check-email-duplicate.service';
import { CreateProfileService } from './application/use-cases/create-profile.service';

// Repository Adapter 구현체
import { UserRepositoryPrisma } from './adapter/out/persistence/prisma/user.repository.prisma';
import { ProfileRepositoryPrisma } from './adapter/out/persistence/prisma/profile.repository.prisma';

// Kakao API Adapter 구현체
import { KakaoAddressServiceImpl } from './adapter/out/http/kakao/kakao-address.service.impl';

import { AuthModule } from './adapter/out/security/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [
    SignupController,
    LoginController,
    CheckEmailController,
    CreateProfileController,
  ],
  providers: [
    // UseCase 바인딩
    { provide: 'SignupUseCase', useClass: SignupService },
    { provide: 'LoginUseCase', useClass: LoginService },
    { provide: 'CreateProfileUseCase', useClass: CreateProfileService },
    {
      provide: 'CheckEmailDuplicateUseCase',
      useClass: CheckEmailDuplicateService,
    },

    // Repository 바인딩
    { provide: 'UserRepository', useClass: UserRepositoryPrisma },
    { provide: 'ProfileRepository', useClass: ProfileRepositoryPrisma },

    // External API 바인딩 (Kakao)
    { provide: 'KakaoAddressService', useClass: KakaoAddressServiceImpl },
  ],
})
export class UserModule {}
