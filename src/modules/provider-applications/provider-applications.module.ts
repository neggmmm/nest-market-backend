import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProviderApplicationsController } from './provider-applications.controller';
import { ProviderApplicationsService } from './provider-applications.service';
import { ProviderApplication } from './infrastructure/typeorm/provider-application.orm-entity';
import { User } from '../users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProviderApplication, User])],
  controllers: [ProviderApplicationsController],
  providers: [ProviderApplicationsService],
})
export class ProviderApplicationsModule {}
