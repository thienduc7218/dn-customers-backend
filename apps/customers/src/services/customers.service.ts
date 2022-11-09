import { CreateCustomerDto, CustomerResponse, IdParams, UpdateCustomerDto } from '@dn/customers'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Customer, CustomerDoc } from '../schema/customers.schema'

@Injectable()
export class CustomersService {
  constructor(@InjectModel(Customer.name) private readonly model: Model<CustomerDoc>) {}

  async getAllCustomers(): Promise<CustomerResponse[]> {
    const customers = await this.model.find()
    const result = customers.map(cus => ({
      id: cus._id,
      name: cus.name,
      phone: cus.phone,
      address: cus.address,
      email: cus.email,
    }))
    return result
  }

  async getCustomerById({ id }: IdParams): Promise<CustomerResponse> {
    const customer = await this.model.findById(id)
    if (!customer) {
      throw new NotFoundException('Customer not found!')
    }
    return {
      id: customer._id,
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
      email: customer.email,
    }
  }

  async createCustomer(payload: CreateCustomerDto): Promise<CustomerResponse> {
    const { name, phone } = payload
    const [nameExited, phoneExisted] = await Promise.all([this.model.findOne({ name }), this.model.findOne({ phone })])
    if (nameExited) {
      throw new BadRequestException('name is already registered!')
    }
    if (phoneExisted) {
      throw new BadRequestException('phone is already registered!')
    }
    const newCustomer = new this.model(payload)
    await newCustomer.save()
    return {
      id: newCustomer._id,
      name: newCustomer.name,
      phone: newCustomer.phone,
      address: newCustomer.address,
      email: newCustomer.email,
    }
  }

  async updateCustomer({ id }: IdParams, payload: UpdateCustomerDto): Promise<CustomerResponse> {
    const customer = await this.model.findByIdAndUpdate(id, payload)
    if (!customer) {
      throw new NotFoundException('Customer not found!')
    }
    const updated = await this.model.findById(id)
    return {
      id: updated._id,
      name: updated.name,
      phone: updated.phone,
      address: updated.address,
      email: updated.email,
    }
  }

  async deleteCustomerById({ id }: IdParams): Promise<void> {
    await this.model.findByIdAndRemove(id)
    return
  }
}
