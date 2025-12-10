import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProfileQueryPort } from 'src/application/port/out/profile.query.port';
import { Profile } from 'src/domain/model/profile/entity/profile.entity';
import { ProfileMapper } from './profile.mapper';

@Injectable()
export class ProfileQueryAdapter implements ProfileQueryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(profileId: number): Promise<Profile | null> {
    const record = await this.prisma.profile.findUnique({
      where: { profile_id: profileId },
    });

    if (!record) return null;

    return ProfileMapper.toDomain(record);
  }

  async findByUserId(userId: number): Promise<Profile[]> {
    const records = await this.prisma.profile.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });

    return records.map((record) => ProfileMapper.toDomain(record));
  }

  async existsById(profileId: number): Promise<boolean> {
    const count = await this.prisma.profile.count({
      where: { profile_id: profileId },
    });
    return count > 0;
  }

  async countByUserId(userId: number): Promise<number> {
    return await this.prisma.profile.count({
      where: { user_id: userId },
    });
  }
}
