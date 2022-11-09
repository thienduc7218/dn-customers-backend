import { Expose } from 'class-transformer'
import { BaseCustomerType } from './customers.base'

export class CustomerResponse implements BaseCustomerType {
  @Expose() id: string
  @Expose() name: string
  @Expose() phone: string
  @Expose() email?: string
  @Expose() address?: string
}

export class PageInfo {
  @Expose() limit: number
  @Expose() offset: number
  @Expose() total: number
}
