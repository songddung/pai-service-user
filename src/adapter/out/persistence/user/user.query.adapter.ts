import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UserQueryPort } from 'src/application/port/out/user.query.port';
import { User } from 'src/domain/model/user/entity/user.entity';

@Injectable()
export class UserQueryAdapter implements UserQueryPort {
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

  async findById(userId: number): Promise<User | null> {
    const record = await this.prisma.user.findUnique({
      where: { user_id: BigInt(userId) },
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

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email },
    });
    return count > 0;
  }
}
