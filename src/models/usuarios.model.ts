import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {FotoUsers} from './foto-users.model';
import {Roles} from './roles.model';

@model()
export class Usuarios extends Entity {
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
    required: true,
  })
  lastName: string;

  @property({
    type: 'string',
    required: true,
  })
  document: string;

  @property({
    type: 'string',
    required: false,
  })
  password: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  cell: string;

  @belongsTo(() => Roles)
  rolesId: string;

  @property({
    type: 'string',
  })
  foto?: string;

  @hasMany(() => FotoUsers, {keyTo: 'usuariosId'})
  fotoUsers: FotoUsers[];

  constructor(data?: Partial<Usuarios>) {
    super(data);
  }
}

export interface UsuariosRelations {
  // describe navigational properties here
}

export type UsuariosWithRelations = Usuarios & UsuariosRelations;
