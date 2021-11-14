import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Roles, RolesRelations, Usuarios} from '../models';
import {UsuariosRepository} from './usuarios.repository';

export class RolesRepository extends DefaultCrudRepository<
  Roles,
  typeof Roles.prototype._id,
  RolesRelations
> {

  public readonly usuarios: HasManyRepositoryFactory<Usuarios, typeof Roles.prototype._id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('UsuariosRepository') protected usuariosRepositoryGetter: Getter<UsuariosRepository>,
  ) {
    super(Roles, dataSource);
    this.usuarios = this.createHasManyRepositoryFactoryFor('usuarios', usuariosRepositoryGetter,);
    this.registerInclusionResolver('usuarios', this.usuarios.inclusionResolver);
  }
}
