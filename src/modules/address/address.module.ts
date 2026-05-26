import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { Address } from './address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address])],
  providers: [AddressService],
  controllers: [AddressController],
  exports: [TypeOrmModule]
})
export class AddressModule {}
