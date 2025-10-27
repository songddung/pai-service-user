import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProfileRepositoryPort } from 'src/application/port/out/profile.repository.port';
import { Profile } from 'src/domain/model/profile/entity/profile.entity';
import type { ProfileType } from 'pai-shared-types';

@Injectable()
export class ProfileRepositoryAdapter implements ProfileRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async save(profile: Profile): Promise<Profile> {
    const gender = profile.getGender();

    if (!gender) {
      throw new Error('성별은 필수입니다.');
    }

    const data = {
      user_id: BigInt(profile.getUserId()),
      profile_type: profile.getProfileType() as any,
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
      birthDate: saved.birth_date!,
      gender: saved.gender!,
      avatarMediaId: saved.avatar_media_id
        ? String(saved.avatar_media_id)
        : undefined,
      pinHash: saved.pin_hash || undefined,
      voiceMediaId: saved.voice_media_id
        ? String(saved.voice_media_id)
        : undefined,
      createdAt: saved.created_at,
    });
  }

  async update(profile: Profile): Promise<Profile> {
    const gender = profile.getGender();

    if (!gender) {
      throw new Error('성별은 필수입니다.');
    }

    const updated = await this.prisma.profile.update({
      where: { profile_id: BigInt(profile.getId()) },
      data: {
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
      },
    });

    return Profile.rehydrate({
      id: Number(updated.profile_id),
      userId: Number(updated.user_id),
      profileType: updated.profile_type as ProfileType,
      name: updated.name,
      birthDate: updated.birth_date!,
      gender: updated.gender!,
      avatarMediaId: updated.avatar_media_id
        ? String(updated.avatar_media_id)
        : undefined,
      pinHash: updated.pin_hash || undefined,
      voiceMediaId: updated.voice_media_id
        ? String(updated.voice_media_id)
        : undefined,
      createdAt: updated.created_at,
    });
  }

  async delete(profileId: number): Promise<void> {
    await this.prisma.profile.delete({
      where: { profile_id: BigInt(profileId) },
    });
  }
}
