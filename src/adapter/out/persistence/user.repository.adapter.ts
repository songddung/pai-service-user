import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UserRepositoryPort } from 'src/application/port/out/user.repository.port';
import { User } from 'src/domain/model/user/user.entity';

@Injectable()
export class UserRepositoryAdapter implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: User): Promise<User> {
    const record = await this.prisma.user.create({
      data: {
        email: user.getEmail(),
        password_hash: user.getPasswordHash(),
        address: user.getAddress() ?? '',
        latitude: user.getLatitude() ?? 0,
        longitude: user.getLongitude() ?? 0,
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

  async update(user: User): Promise<User> {
    const userId = user.getId();
    if (!userId) {
      throw new Error('User ID is required for update');
    }

    const record = await this.prisma.user.update({
      where: { user_id: BigInt(userId) },
      data: {
        email: user.getEmail(),
        password_hash: user.getPasswordHash(),
        address: user.getAddress() ?? '',
        latitude: user.getLatitude() ?? 0,
        longitude: user.getLongitude() ?? 0,
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

  async delete(userId: number): Promise<void> {
    if (!userId) {
      throw new Error('User ID is required for delete');
    }

    await this.prisma.user.delete({
      where: { user_id: BigInt(userId) },
    });
  }
}
