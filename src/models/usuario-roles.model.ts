import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    foreignKeys: {
      fk_UserRL_idUser: {
        name: 'fk_UserRL_idUser',
        entity: 'Usuarios',
        entityKey: 'id',
        foreignKey: 'usuariosId',
      },
      fk_UserRL_idRoles: {
        name: 'fk_UserRL_idRoles',
        entity: 'Roles',
        entityKey: 'id',
        foreignKey: 'rolesId',
      },
    }
  }
})
export class UsuarioRoles extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
  })
  rolesId?: number;

  @property({
    type: 'number',
  })
  usuariosId?: number;

  constructor(data?: Partial<UsuarioRoles>) {
    super(data);
  }
}

export interface UsuarioRolesRelations {
  // describe navigational properties here
}

export type UsuarioRolesWithRelations = UsuarioRoles & UsuarioRolesRelations;
