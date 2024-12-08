import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { ImageModule } from './image/image.module';
import { CommentModule } from './comment/comment.module';
import { BuildingModule } from './building/building.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    PostModule,
    ImageModule,
    CommentModule,
    BuildingModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
