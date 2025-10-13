import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ProfileRepository } from 'src/application/port/out/profile.repository';
import { Profile } from 'src/domain/model/profile/profile.entity';
import type { ProfileType } from 'pai-shared-types';

@Injectable()
export class ProfileRepositoryPrisma implements ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(profile: Profile): Promise<Profile> {
    const gender = profile.getGender();

    if (!gender) {
      throw new Error('성별은 필수입니다.');
    }

    const data = {
      user_id: BigInt(profile.getUserId()),
      profile_type: profile.getProfileType() as any, // Prisma enum
      name: profile.getName(),
      birth_date: profile.getBirthDate(),
      gender: gender,
      avatar_media_id: profile.getAvatarMediaId()
        ? BigInt(profile.getAvatarMediaId()!)
        : null,
      pin_hash: profile.getPinHash() || null,
      voice_media_id: profile.getVoiceMediaId()
        ? BigInt(profile.getVoiceMediaId()!)
        : null,
    };

    const saved = await this.prisma.profile.create({
      data,
    });

    return Profile.rehydrate({
      id: Number(saved.profile_id),
      userId: Number(saved.user_id),
      profileType: saved.profile_type as ProfileType,
      name: saved.name,
      birthDate: saved.birth_date,
      gender: saved.gender,
      avatarMediaId: saved.avatar_media_id
        ? Number(saved.avatar_media_id)
        : undefined,
      pinHash: saved.pin_hash || undefined,
      voiceMediaId: saved.voice_media_id
        ? Number(saved.voice_media_id)
        : undefined,
      createdAt: saved.created_at,
    });
  }

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
      birthDate: record.birth_date,
      gender: record.gender,
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
        birthDate: record.birth_date,
        gender: record.gender,
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

  async delete(profileId: number): Promise<void> {
    await this.prisma.profile.delete({
      where: { profile_id: BigInt(profileId) },
    });
  }
}
