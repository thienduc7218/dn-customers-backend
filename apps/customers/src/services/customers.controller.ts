import { CreateCustomerDto, CustomerResponse, IdParams, UpdateCustomerDto } from '@dn/customers'
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CustomersService } from './customers.service'

@Controller('customers')
@ApiTags('Customers')
export class CustomersController {
  constructor(private readonly service: CustomersService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllCustomers(): Promise<CustomerResponse[]> {
    return this.service.getAllCustomers()
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async getCustomerById(@Param() param: IdParams): Promise<CustomerResponse> {
    return this.service.getCustomerById(param)
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createCustomer(@Body() payload: CreateCustomerDto): Promise<CustomerResponse> {
    try {
      return this.service.createCustomer(payload)
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  @HttpCode(HttpStatus.OK)
  @Put('/:id')
  async updateCustomer(@Body() payload: UpdateCustomerDto, @Param() param: IdParams): Promise<CustomerResponse> {
    return this.service.updateCustomer(param, payload)
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  async deleteCustomerById(@Param() param: IdParams): Promise<void> {
    return this.service.deleteCustomerById(param)
  }
}
