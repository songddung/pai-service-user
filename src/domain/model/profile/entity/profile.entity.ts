import { ProfileType } from 'src/domain/model/profile/enum/profile-type';
import { ProfileName } from '../vo/profile-name.vo';
import { BirthDate } from '../vo/birth-date.vo';
import { Gender } from '../vo/gender.vo';
import { PinHash } from '../vo/pin-hash.vo';

interface CreateProfileProps {
  userId: number;
  profileType: ProfileType;
  name: ProfileName;
  birthDate: BirthDate;
  gender: Gender;
  avatarMediaId?: bigint;
  pinHash?: PinHash;
  voiceMediaId?: string;
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
    private name: ProfileName,
    private birthDate: BirthDate,
    private gender: Gender,
    private avatarMediaId?: bigint,
    private pinHash?: PinHash,
    private voiceMediaId?: string,
    private readonly createdAt?: Date,
  ) {}

  static create(props: CreateProfileProps): Profile {
    // 비즈니스 규칙 검증
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

  getName(): ProfileName {
    return this.name;
  }

  getBirthDate(): BirthDate {
    return this.birthDate;
  }

  getGender(): Gender {
    return this.gender;
  }

  getAvatarMediaId(): bigint | undefined {
    return this.avatarMediaId;
  }

  getPinHash(): PinHash | undefined {
    return this.pinHash;
  }

  getVoiceMediaId(): string | undefined {
    return this.voiceMediaId;
  }

  getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  // 비즈니스 메서드
  updateName(name: ProfileName): void {
    this.name = name;
  }

  updateAvatar(avatarMediaId: bigint): void {
    this.avatarMediaId = avatarMediaId;
  }

  updateVoice(voiceId: string): void {
    this.voiceMediaId = voiceId;
  }

  updatePin(pinHash: PinHash): void {
    if (this.profileType !== 'parent') {
      throw new Error('부모 프로필만 PIN을 설정할 수 있습니다.');
    }
    this.pinHash = pinHash;
  }

  isParent(): boolean {
    return this.profileType === 'parent';
  }

  isChild(): boolean {
    return this.profileType === 'child';
  }
}
