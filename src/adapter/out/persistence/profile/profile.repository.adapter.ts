import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProfileRepositoryPort } from 'src/application/port/out/profile.repository.port';
import { Profile } from 'src/domain/model/profile/entity/profile.entity';
import { ProfileMapper } from './profile.mapper';

@Injectable()
export class ProfileRepositoryAdapter implements ProfileRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async save(profile: Profile): Promise<Profile> {
    const data = ProfileMapper.toPersistence(profile);

    const saved = await this.prisma.profile.create({
      data,
    });

    return ProfileMapper.toDomain(saved);
  }

  async update(profile: Profile): Promise<Profile> {
    const data = ProfileMapper.toPersistence(profile);

    const updated = await this.prisma.profile.update({
      where: { profile_id: profile.getId() },
      data,
    });

    return ProfileMapper.toDomain(updated);
  }

  async delete(profileId: number): Promise<void> {
    await this.prisma.profile.delete({
      where: { profile_id: profileId },
    });
  }
}
