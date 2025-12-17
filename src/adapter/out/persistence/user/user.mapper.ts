import { User } from 'src/domain/model/user/entity/user.entity';
import { UserRecord } from './user.type';
import { Email } from 'src/domain/model/user/vo/email.vo';
import { PasswordHash } from 'src/domain/model/user/vo/passwordHash.vo';
import { Address } from 'src/domain/model/user/vo/address.vo';

export class UserMapper {
  static toDomain(record: UserRecord): User {
    const emailVO = Email.create(record.email);
    const passwordHashVO = PasswordHash.create(record.password_hash);
    let addressVO: Address;

    if (record.address && record.latitude && record.longitude) {
      addressVO = Address.create(
        record.address,
        record.latitude,
        record.longitude,
      );
    } else {
      throw new Error('DB이상');
    }

    return User.rehydrate({
      id: record.user_id,
      email: emailVO,
      passwordHash: passwordHashVO,
      address: addressVO,
      createdAt: record.created_at,
    });
  }

  static toPersistence(user: User): any {
    // 반환 타입은 Prisma의 'data' 객체와 동일
    const address = user.getAddress();

    return {
      // VO에서 내부 값(.getValue())을 추출합니다.
      email: user.getEmail().getValue(),
      password_hash: user.getPasswordHash().getValue(),

      // Address VO에서 필수 속성을 추출합니다.
      address: address.getAddress(),
      latitude: address.getLatitude(),
      longitude: address.getLongitude(),
      created_at: user.getCreatedAt(),
    };
  }
}
