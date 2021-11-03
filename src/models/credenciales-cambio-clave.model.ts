import {Model, model, property} from '@loopback/repository';

@model()
export class CredencialesCambioClave extends Model {
  @property({
    type: 'string',
    required: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  currentPassword: string;

  @property({
    type: 'string',
    required: true,
  })
  newPassword: string;


  constructor(data?: Partial<CredencialesCambioClave>) {
    super(data);
  }
}

export interface CredencialesCambioClaveRelations {
  // describe navigational properties here
}

export type CredencialesCambioClaveWithRelations = CredencialesCambioClave & CredencialesCambioClaveRelations;
