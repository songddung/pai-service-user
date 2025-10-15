import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ProfileQueryPort } from 'src/application/port/out/profile.query.port';
import { Profile } from 'src/domain/model/profile/profile.entity';
import type { ProfileType } from 'pai-shared-types';

@Injectable()
export class ProfileQueryAdapter implements ProfileQueryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(profileId: number): Promise<Profile | null> {
    const record = await this.prisma.profile.findUnique({
      where: { profile_id: BigInt(profileId) },
    });

    if (!record) return null;

    return Profile.rehydrate({
      id: Number(record.profile_id),
      userId: Number(record.user_id),
      profileType: record.profile_type as ProfileType,
      name: record.name,
      birthDate: record.birth_date!,
      gender: record.gender!,
      avatarMediaId: record.avatar_media_id
        ? Number(record.avatar_media_id)
        : undefined,
      pinHash: record.pin_hash || undefined,
      voiceMediaId: record.voice_media_id
        ? Number(record.voice_media_id)
        : undefined,
      createdAt: record.created_at,
    });
  }

  async findByUserId(userId: number): Promise<Profile[]> {
    const records = await this.prisma.profile.findMany({
      where: { user_id: BigInt(userId) },
      orderBy: { created_at: 'desc' },
    });

    return records.map((record) =>
      Profile.rehydrate({
        id: Number(record.profile_id),
        userId: Number(record.user_id),
        profileType: record.profile_type as ProfileType,
        name: record.name,
        birthDate: record.birth_date!,
        gender: record.gender!,
        avatarMediaId: record.avatar_media_id
          ? Number(record.avatar_media_id)
          : undefined,
        pinHash: record.pin_hash || undefined,
        voiceMediaId: record.voice_media_id
          ? Number(record.voice_media_id)
          : undefined,
        createdAt: record.created_at,
      }),
    );
  }

  async existsById(profileId: number): Promise<boolean> {
    const count = await this.prisma.profile.count({
      where: { profile_id: BigInt(profileId) },
    });
    return count > 0;
  }

  async countByUserId(userId: number): Promise<number> {
    return await this.prisma.profile.count({
      where: { user_id: BigInt(userId) },
    });
  }
}
