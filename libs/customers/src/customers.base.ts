export type BaseCustomerType = {
  name: string
  phone: string
  email?: string
  address?: string
  attributes?: object
}

export enum CustomerStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}
