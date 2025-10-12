import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './adapter/out/persistence/prisma/prisma.module';
import { UserModule } from './user.module';

@Module({
  imports: [
    // 전역 환경변수 설정 (.env)
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule, // Global이라면 생략 가능
    UserModule,
  ],
})
export class AppModule {}
