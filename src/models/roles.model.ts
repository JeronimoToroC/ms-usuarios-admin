import {Entity, hasMany, model, property} from '@loopback/repository';
import {Usuarios} from './usuarios.model';

@model()
export class Roles extends Entity {
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
  nombre: string;

  @hasMany(() => Usuarios, {keyTo: 'roles.Id'})
  usuarios: Usuarios[];

  constructor(data?: Partial<Roles>) {
    super(data);
  }
}

export interface RolesRelations {
  // describe navigational properties here
}

export type RolesWithRelations = Roles & RolesRelations;
