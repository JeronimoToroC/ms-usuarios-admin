import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {UsuarioRoles, UsuarioRolesRelations} from '../models';

export class UsuarioRolesRepository extends DefaultCrudRepository<
  UsuarioRoles,
  typeof UsuarioRoles.prototype._id,
  UsuarioRolesRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(UsuarioRoles, dataSource);
  }
}
