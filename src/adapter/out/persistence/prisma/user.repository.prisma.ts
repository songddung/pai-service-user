import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserRepository } from 'src/application/port/out/user.repository';
import { User } from 'src/domain/model/user/user.entity';

@Injectable()
export class UserRepositoryPrisma implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!record) return null;

    return User.rehydrate({
      id: record.user_id,
      email: record.email,
      passwordHash: record.password_hash,
      address: record.address,
      latitude: record.latitude,
      longitude: record.longitude,
      createdAt: record.created_at,
    });
  }

  async save(user: User): Promise<User> {
    const record = await this.prisma.user.create({
      data: {
        email: user.getEmail(),
        password_hash: user.getPasswordHash(),
        address: user.getAddress() ?? '',
        latitude: user.getLatitude() ?? 0,
        longitude: user.getLongitude() ?? 0,
        // created_at 컬럼은 Prisma가 자동으로 넣어줌
      },
    });

    return User.rehydrate({
      id: record.user_id,
      email: record.email,
      passwordHash: record.password_hash,
      address: record.address,
      latitude: record.latitude,
      longitude: record.longitude,
      createdAt: record.created_at,
    });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email },
    });
    return count > 0;
  }
}
