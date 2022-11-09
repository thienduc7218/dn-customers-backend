import { IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator'
import { BaseCustomerType } from './customers.base'

export class CreateCustomerDto implements Partial<BaseCustomerType> {
  @IsNotEmpty() @IsString() name: string
  @IsNotEmpty() @IsPhoneNumber('VN') phone: string
  @IsOptional() @IsString() email?: string
  @IsOptional() @IsString() address?: string
}

export class UpdateCustomerDto implements Partial<CreateCustomerDto> {
  @IsOptional() @IsString() name?: string
  @IsOptional() @IsPhoneNumber('VN') phone?: string
  @IsOptional() @IsString() email?: string
  @IsOptional() @IsString() address?: string
}

export class IdParams {
  @IsString() @IsNotEmpty() id: string
}
