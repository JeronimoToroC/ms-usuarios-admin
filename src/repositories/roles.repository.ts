import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Roles, RolesRelations, Usuarios, UsuarioRoles} from '../models';
import {UsuarioRolesRepository} from './usuario-roles.repository';
import {UsuariosRepository} from './usuarios.repository';

export class RolesRepository extends DefaultCrudRepository<
  Roles,
  typeof Roles.prototype.id,
  RolesRelations
> {

  public readonly usuarioRoles: HasManyThroughRepositoryFactory<Usuarios, typeof Usuarios.prototype.id,
          UsuarioRoles,
          typeof Roles.prototype.id
        >;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('UsuarioRolesRepository') protected usuarioRolesRepositoryGetter: Getter<UsuarioRolesRepository>, @repository.getter('UsuariosRepository') protected usuariosRepositoryGetter: Getter<UsuariosRepository>,
  ) {
    super(Roles, dataSource);
    this.usuarioRoles = this.createHasManyThroughRepositoryFactoryFor('usuarioRoles', usuariosRepositoryGetter, usuarioRolesRepositoryGetter,);
    this.registerInclusionResolver('usuarioRoles', this.usuarioRoles.inclusionResolver);
  }
}
