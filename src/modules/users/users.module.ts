import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { S3UserFileStorageService } from './infrastructure/storage/s3-user-file-storage.service';

@Module({
  imports :[TypeOrmModule.forFeature([User])],
  providers: [UsersService, S3UserFileStorageService],
  controllers: [UsersController],
  exports:[UsersService]
})
export class UsersModule {}
