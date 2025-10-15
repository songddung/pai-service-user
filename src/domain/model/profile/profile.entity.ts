import type { ProfileType } from 'pai-shared-types';

interface CreateProfileProps {
  userId: number;
  profileType: ProfileType;
  name: string;
  birthDate: Date;
  gender: string;
  avatarMediaId?: number;
  pinHash?: string;
  voiceMediaId?: number;
}

interface RehydrateProfileProps extends CreateProfileProps {
  id: number;
  createdAt: Date;
}

export class Profile {
  private constructor(
    private readonly id: number,
    private readonly userId: number,
    private readonly profileType: ProfileType,
    private name: string,
    private birthDate: Date,
    private gender: string,
    private avatarMediaId?: number,
    private pinHash?: string,
    private voiceMediaId?: number,
    private readonly createdAt?: Date,
  ) {}

  static create(props: CreateProfileProps): Profile {
    // 비즈니스 규칙 검증
    if (!props.name || props.name.trim() === '') {
      throw new Error('이름은 필수입니다.');
    }

    if (props.profileType === 'parent' && !props.pinHash) {
      throw new Error('부모 프로필은 PIN이 필수입니다.');
    }

    return new Profile(
      0, // ID는 저장 시 생성
      props.userId,
      props.profileType,
      props.name,
      props.birthDate,
      props.gender,
      props.avatarMediaId,
      props.pinHash,
      props.voiceMediaId,
    );
  }

  static rehydrate(props: RehydrateProfileProps): Profile {
    return new Profile(
      props.id,
      props.userId,
      props.profileType,
      props.name,
      props.birthDate,
      props.gender,
      props.avatarMediaId,
      props.pinHash,
      props.voiceMediaId,
      props.createdAt,
    );
  }

  // Getters
  getId(): number {
    return this.id;
  }

  getUserId(): number {
    return this.userId;
  }

  getProfileType(): ProfileType {
    return this.profileType;
  }

  getName(): string {
    return this.name;
  }

  getBirthDate(): Date {
    return this.birthDate;
  }

  getGender(): string | undefined {
    return this.gender;
  }

  getAvatarMediaId(): number | undefined {
    return this.avatarMediaId;
  }

  getPinHash(): string | undefined {
    return this.pinHash;
  }

  getVoiceMediaId(): number | undefined {
    return this.voiceMediaId;
  }

  getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  // 비즈니스 메서드
  updateName(name: string): void {
    if (!name || name.trim() === '') {
      throw new Error('이름은 필수입니다.');
    }
    this.name = name;
  }

  updateAvatar(avatarMediaId: number): void {
    this.avatarMediaId = avatarMediaId;
  }

  updatePin(pinHash: string): void {
    if (this.profileType !== 'parent') {
      throw new Error('부모 프로필만 PIN을 설정할 수 있습니다.');
    }
    this.pinHash = pinHash;
  }

  isparent(): boolean {
    return this.profileType === 'parent';
  }

  ischild(): boolean {
    return this.profileType === 'child';
  }
}
