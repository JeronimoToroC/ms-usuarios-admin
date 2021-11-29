import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class FotoUsers extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  usuariosId?: string;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<FotoUsers>) {
    super(data);
  }
}

export interface FotoUsersRelations {
  // describe navigational properties here
}

export type FotoUsersWithRelations = FotoUsers & FotoUsersRelations;
