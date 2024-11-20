import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findUserOrCreate({
    uuid,
    name,
  }: Pick<User, 'uuid' | 'name'>): Promise<User> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { uuid },
      });

      if (user) {
        return user;
      }
    } catch (error) {
      throw new Error(`Failed to find user: ${error.message}`);
    }

    // if user not exist, then create user
    return this.prismaService.user.create({
      data: {
        uuid,
        name,
      },
    });
  }
}
