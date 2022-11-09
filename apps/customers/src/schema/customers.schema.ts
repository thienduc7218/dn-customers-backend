import { BaseCustomerType, CustomerStatusEnum } from '@dn/customers'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { object } from 'joi'
import mongoose, { Document } from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'

export type CustomerDoc = Document & Customer

@Schema({ timestamps: true })
export class Customer implements BaseCustomerType {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  phone: string

  //   @Prop({ type: CustomerStatusEnum })
  //   status: CustomerStatusEnum

  @Prop({ required: false, default: '' })
  email?: string

  @Prop({ required: false, default: '' })
  address?: string

  @Prop({ required: false, default: {}, type: Object })
  attributes?: object
}

const CustomerSchema = SchemaFactory.createForClass(Customer)
CustomerSchema.plugin(paginate)

export { CustomerSchema }
