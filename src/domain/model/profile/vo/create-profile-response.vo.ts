import { ProfileType } from 'src/domain/model/profile/enum/profile-type';

export class CreateProfileResponseVO {
  private constructor(
    private readonly userId: number,
    private readonly profileId: number,
    private readonly profileType: ProfileType,
    private readonly name: string,
    private readonly birth_date: string,
    private readonly gender: string,
    private readonly avatar_media_id: string | null,
  ) {
    if (!userId || userId <= 0) {
      throw new Error('유효한 사용자 ID가 필요합니다.');
    }
    if (!profileId || profileId <= 0) {
      throw new Error('유효한 프로필 ID가 필요합니다.');
    }
    if (!profileType) {
      throw new Error('유효한 프로필 타입이 필요합니다.');
    }
    if (!name) {
      throw new Error('유효한 이름이 필요합니다.');
    }
    if (!birth_date) {
      throw new Error('유효한 생년월일이 필요합니다.');
    }
    if (!gender) {
      throw new Error('유효한 성별이 필요합니다.');
    }
  }

  static create(
    userId: number,
    profileId: number,
    profileType: ProfileType,
    name: string,
    birth_date: string,
    gender: string,
    avatar_media_id: string | null,
  ): CreateProfileResponseVO {
    return new CreateProfileResponseVO(
      userId,
      profileId,
      profileType,
      name,
      birth_date,
      gender,
      avatar_media_id,
    );
  }

  getUserId(): number {
    return this.userId;
  }

  getProfileId(): number {
    return this.profileId;
  }

  getProfileType(): ProfileType {
    return this.profileType;
  }

  getName(): string {
    return this.name;
  }

  getBirthDate(): string {
    return this.birth_date;
  }

  getGender(): string {
    return this.gender;
  }

  getAvatarMediaId(): string | null {
    return this.avatar_media_id;
  }

  equals(other: CreateProfileResponseVO): boolean {
    if (!other) return false;
    if (!(other instanceof CreateProfileResponseVO)) return false;
    return (
      this.userId === other.userId &&
      this.profileId === other.profileId &&
      this.profileType === other.profileType &&
      this.name === other.name &&
      this.birth_date === other.birth_date &&
      this.gender === other.gender &&
      this.avatar_media_id === other.avatar_media_id
    );
  }

  hashCode(): string {
    return `${this.userId}-${this.profileId}-${this.profileType}-${this.name}`;
  }
}
