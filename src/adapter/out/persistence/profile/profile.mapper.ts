import { Profile } from 'src/domain/model/profile/entity/profile.entity';
import { ProfileRecord } from './profile.type';
import { ProfileName } from 'src/domain/model/profile/vo/profile-name.vo';
import { BirthDate } from 'src/domain/model/profile/vo/birth-date.vo';
import { Gender } from 'src/domain/model/profile/vo/gender.vo';
import { PinHash } from 'src/domain/model/profile/vo/pin-hash.vo';
import type { ProfileType } from 'pai-shared-types';

export class ProfileMapper {
  static toDomain(record: ProfileRecord): Profile {
    const nameVO = ProfileName.create(record.name);
    const birthDateVO = BirthDate.create(record.birth_date);
    const genderVO = Gender.create(record.gender);
    const pinHashVO = record.pin_hash
      ? PinHash.create(record.pin_hash)
      : undefined;

    return Profile.rehydrate({
      id: Number(record.profile_id),
      userId: Number(record.user_id),
      profileType: record.profile_type as ProfileType,
      name: nameVO,
      birthDate: birthDateVO,
      gender: genderVO,
      avatarMediaId: record.avatar_media_id ?? undefined,
      pinHash: pinHashVO,
      voiceMediaId: record.voice_media_id ?? undefined,
      createdAt: record.created_at,
    });
  }

  static toPersistence(profile: Profile): any {
    // 반환 타입은 Prisma의 'data' 객체와 동일
    return {
      user_id: profile.getUserId(),
      profile_type: profile.getProfileType(),
      name: profile.getName().getValue(),
      birth_date: profile.getBirthDate().getValue(),
      gender: profile.getGender().getValue(),
      avatar_media_id: profile.getAvatarMediaId() ?? null,
      pin_hash: profile.getPinHash()?.getValue() ?? null,
      voice_media_id: profile.getVoiceMediaId() ?? null,
    };
  }
}
