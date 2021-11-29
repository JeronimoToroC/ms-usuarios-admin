import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {FotoUsers, FotoUsersRelations} from '../models';

export class FotoUsersRepository extends DefaultCrudRepository<
  FotoUsers,
  typeof FotoUsers.prototype._id,
  FotoUsersRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(FotoUsers, dataSource);
  }
}
