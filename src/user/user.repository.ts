import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findUserOrCreate({ uuid, name }) {
    const user = await this.prismaService.user.findUnique({
      where: { uuid },
    });

    if (user) {
      return user;
    }
    return this.prismaService.user.create({
      data: {
        uuid,
        name,
      },
    });
  }
}
