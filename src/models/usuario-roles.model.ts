import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    foreignKeys: {
      fk_UserRL_idUser: {
        name: 'fk_UserRL_idUser',
        entity: 'Usuarios',
        entityKey: '_id',
        foreignKey: 'usuariosId',
      },
      fk_UserRL_idRoles: {
        name: 'fk_UserRL_idRoles',
        entity: 'Roles',
        entityKey: '_id',
        foreignKey: 'rolesId',
      },
    }
  }
})
export class UsuarioRoles extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id?: string;

  @property({
    type: 'string',
  })
  rolesId?: string;

  @property({
    type: 'string',
  })
  usuariosId?: string;

  constructor(data?: Partial<UsuarioRoles>) {
    super(data);
  }
}

export interface UsuarioRolesRelations {
  // describe navigational properties here
}

export type UsuarioRolesWithRelations = UsuarioRoles & UsuarioRolesRelations;
