import { Injectable } from '@nestjs/common';
import { UserRepositoryPort } from 'src/application/port/out/user.repository.port';
import { User } from 'src/domain/model/user/entity/user.entity';
import { UserMapper } from './user.mapper';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserRepositoryAdapter implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: User): Promise<User> {
    const dataToSave = UserMapper.toPersistence(user);

    const record = await this.prisma.user.create({
      data: dataToSave,
    });

    return UserMapper.toDomain(record);
  }

  async update(user: User): Promise<User> {
    const userId = user.getId();
    if (!userId) {
      throw new Error('User ID is required for update');
    }

    const dataToUpdate = UserMapper.toPersistence(user);

    const record = await this.prisma.user.update({
      where: { user_id: userId },
      data: dataToUpdate,
    });

    return UserMapper.toDomain(record);
  }

  async delete(userId: number): Promise<void> {
    if (!userId) {
      throw new Error('User ID is required for delete');
    }

    await this.prisma.user.delete({
      where: { user_id: userId },
    });
  }
}
