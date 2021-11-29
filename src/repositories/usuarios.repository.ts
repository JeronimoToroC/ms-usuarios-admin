import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Usuarios, UsuariosRelations, Roles, FotoUsers} from '../models';
import {RolesRepository} from './roles.repository';
import {FotoUsersRepository} from './foto-users.repository';

export class UsuariosRepository extends DefaultCrudRepository<
  Usuarios,
  typeof Usuarios.prototype._id,
  UsuariosRelations
> {

  public readonly roles: BelongsToAccessor<Roles, typeof Usuarios.prototype._id>;

  public readonly fotoUsers: HasManyRepositoryFactory<FotoUsers, typeof Usuarios.prototype._id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('RolesRepository') protected rolesRepositoryGetter: Getter<RolesRepository>, @repository.getter('FotoUsersRepository') protected fotoUsersRepositoryGetter: Getter<FotoUsersRepository>,
  ) {
    super(Usuarios, dataSource);
    this.fotoUsers = this.createHasManyRepositoryFactoryFor('fotoUsers', fotoUsersRepositoryGetter,);
    this.registerInclusionResolver('fotoUsers', this.fotoUsers.inclusionResolver);
    this.roles = this.createBelongsToAccessorFor('roles', rolesRepositoryGetter,);
    this.registerInclusionResolver('roles', this.roles.inclusionResolver);
  }
}
