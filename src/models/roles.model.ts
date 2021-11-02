import {Entity, hasMany, model, property} from '@loopback/repository';
import {UsuarioRoles} from './usuario-roles.model';
import {Usuarios} from './usuarios.model';

@model()
export class Roles extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  nombre: string;

  @hasMany(() => Usuarios, {through: {model: () => UsuarioRoles}})
  usuarioRoles: Usuarios[];

  constructor(data?: Partial<Roles>) {
    super(data);
  }
}

export interface RolesRelations {
  // describe navigational properties here
}

export type RolesWithRelations = Roles & RolesRelations;
