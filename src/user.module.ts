import { Module } from '@nestjs/common';

// Controllers
import { AuthController } from './adapter/in/http/controllers/auth.controller';
import { ProfileController } from './adapter/in/http/controllers/profile.controller';
import { InternalController } from './adapter/in/http/controllers/internal.controller';

// Tokens
import { USER_TOKENS } from './user.token';

// UseCase 구현체
import { SignupService } from './application/use-cases/signup.service';
import { LoginService } from './application/use-cases/login.service';
import { LogoutService } from './application/use-cases/logout.service';
import { RefreshTokenService } from './application/use-cases/refresh-token.service';
import { CheckEmailDuplicateService } from './application/use-cases/check-email-duplicate.service';
import { CreateProfileService } from './application/use-cases/create-profile.service';
import { SelectProfileService } from './application/use-cases/select-profile.service';
import { UpdateProfileService } from './application/use-cases/update-profile.service';
import { DeleteProfileService } from './application/use-cases/delete-profile.service';
import { GetProfileIdService } from './application/use-cases/get-profileId.service';
import { GetProfilesService } from './application/use-cases/get-profiles.service';

// Query Adapter 구현체
import { ProfileQueryAdapter } from './adapter/out/persistence/profile/profile.query.adapter';
import { RedisRefreshTokenQueryAdapter } from './adapter/out/cache/redis-refresh-token.query.adapter';
import { RedisTokenVersionQueryAdapter } from './adapter/out/cache/redis-token-version.query.adapter';
import { UserQueryAdapter } from './adapter/out/persistence/user/user.query.adapter';

// Repository Adapter 구현체
import { ProfileRepositoryAdapter } from './adapter/out/persistence/profile/profile.repository.adapter';
import { RedisTokenVersionRepositoryAdapter } from './adapter/out/cache/redis-token-version.repository.adapter';
import { RedisRefreshTokenRepositoryAdapter } from './adapter/out/cache/redis-refresh-token.repository.adapter';
import { UserRepositoryAdapter } from './adapter/out/persistence/user/user.repository.adapter';

// Redis Module
import { RedisModule } from './adapter/out/cache/redis.module';

// Kakao API Adapter 구현체
import { KakaoAddressAdapter } from './adapter/out/http/kakao/kakao-address.adapter';
import { MediaServiceAdapter } from './adapter/out/external/media-service.adapter';

// Mapper
import { ProfileMapper } from './adapter/in/http/mapper/profile.mapper';
import { AuthMapper } from './adapter/in/http/mapper/auth.mapper';

// Guard
import { BasicAuthGuard } from './adapter/in/http/auth/guards/basic-auth.guard';
import { ParentGuard } from './adapter/in/http/auth/guards/parent.guard';

import { AuthModule } from './adapter/out/security/auth.module';
import { CreateVoiceService } from './application/use-cases/create-voice.service';
import { ElevenLabsService } from './adapter/out/external/elevenLabs.service.adapter';
import { SynthesizeVoiceService } from './application/use-cases/synthesize-voice.service';

@Module({
  imports: [AuthModule, RedisModule],
  controllers: [AuthController, ProfileController, InternalController],
  providers: [
    // Guard
    BasicAuthGuard,
    ParentGuard,

    // Mapper
    ProfileMapper,
    AuthMapper,

    // UseCase 바인딩
    { provide: USER_TOKENS.SignupUseCase, useClass: SignupService },
    { provide: USER_TOKENS.LoginUseCase, useClass: LoginService },
    { provide: USER_TOKENS.LogoutUseCase, useClass: LogoutService },
    { provide: USER_TOKENS.RefreshTokenUseCase, useClass: RefreshTokenService },
    {
      provide: USER_TOKENS.CreateProfileUseCase,
      useClass: CreateProfileService,
    },
    {
      provide: USER_TOKENS.SelectProfileUseCase,
      useClass: SelectProfileService,
    },
    {
      provide: USER_TOKENS.UpdateProfileUseCase,
      useClass: UpdateProfileService,
    },
    {
      provide: USER_TOKENS.DeleteProfileUseCase,
      useClass: DeleteProfileService,
    },
    {
      provide: USER_TOKENS.CreateVoiceUseCase,
      useClass: CreateVoiceService,
    },
    {
      provide: USER_TOKENS.CheckEmailDuplicateUseCase,
      useClass: CheckEmailDuplicateService,
    },

    {
      provide: USER_TOKENS.GetProfilesUseCase,
      useClass: GetProfilesService,
    },
    {
      provide: USER_TOKENS.GetProfileIdUseCase,
      useClass: GetProfileIdService,
    },
    {
      provide: USER_TOKENS.ElevenLabsUseCase,
      useClass: ElevenLabsService,
    },
    {
      provide: USER_TOKENS.SynthesizeVoiceUseCase,
      useClass: SynthesizeVoiceService,
    },

    // Query 바인딩 (읽기)
    { provide: USER_TOKENS.UserQueryPort, useClass: UserQueryAdapter },
    { provide: USER_TOKENS.ProfileQueryPort, useClass: ProfileQueryAdapter },
    {
      provide: USER_TOKENS.RefreshTokenQueryPort,
      useClass: RedisRefreshTokenQueryAdapter,
    },
    {
      provide: USER_TOKENS.TokenVersionQueryPort,
      useClass: RedisTokenVersionQueryAdapter,
    },

    // Repository 바인딩 (쓰기)
    {
      provide: USER_TOKENS.UserRepositoryPort,
      useClass: UserRepositoryAdapter,
    },
    {
      provide: USER_TOKENS.ProfileRepositoryPort,
      useClass: ProfileRepositoryAdapter,
    },
    {
      provide: USER_TOKENS.RefreshTokenRepositoryPort,
      useClass: RedisRefreshTokenRepositoryAdapter,
    },
    {
      provide: USER_TOKENS.TokenVersionRepositoryPort,
      useClass: RedisTokenVersionRepositoryAdapter,
    },

    // External API 바인딩 (Kakao)
    { provide: USER_TOKENS.KakaoAddressService, useClass: KakaoAddressAdapter },
    { provide: USER_TOKENS.MediaServicePort, useClass: MediaServiceAdapter },
  ],
})
export class UserModule {}
