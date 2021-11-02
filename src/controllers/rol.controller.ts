import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {Roles} from '../models';
import {RolesRepository} from '../repositories';

export class RolController {
  constructor(
    @repository(RolesRepository)
    public rolesRepository: RolesRepository,
  ) { }

  @post('/roles')
  @response(200, {
    description: 'Roles model instance',
    content: {'application/json': {schema: getModelSchemaRef(Roles)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Roles, {
            title: 'NewRoles',
            exclude: ['_id'],
          }),
        },
      },
    })
    roles: Omit<Roles, '_id'>,
  ): Promise<Roles> {
    return this.rolesRepository.create(roles);
  }

  @get('/roles/count')
  @response(200, {
    description: 'Roles model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Roles) where?: Where<Roles>,
  ): Promise<Count> {
    return this.rolesRepository.count(where);
  }

  @get('/roles')
  @response(200, {
    description: 'Array of Roles model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Roles, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Roles) filter?: Filter<Roles>,
  ): Promise<Roles[]> {
    return this.rolesRepository.find(filter);
  }

  @patch('/roles')
  @response(200, {
    description: 'Roles PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Roles, {partial: true}),
        },
      },
    })
    roles: Roles,
    @param.where(Roles) where?: Where<Roles>,
  ): Promise<Count> {
    return this.rolesRepository.updateAll(roles, where);
  }

  @get('/roles/{_id}')
  @response(200, {
    description: 'Roles model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Roles, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('_id') _id: string,
    @param.filter(Roles, {exclude: 'where'}) filter?: FilterExcludingWhere<Roles>
  ): Promise<Roles> {
    return this.rolesRepository.findById(_id, filter);
  }

  @patch('/roles/{_id}')
  @response(204, {
    description: 'Roles PATCH success',
  })
  async updateById(
    @param.path.string('_id') _id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Roles, {partial: true}),
        },
      },
    })
    roles: Roles,
  ): Promise<void> {
    await this.rolesRepository.updateById(_id, roles);
  }

  @put('/roles/{_id}')
  @response(204, {
    description: 'Roles PUT success',
  })
  async replaceById(
    @param.path.string('_id') _id: string,
    @requestBody() roles: Roles,
  ): Promise<void> {
    await this.rolesRepository.replaceById(_id, roles);
  }

  @del('/roles/{_id}')
  @response(204, {
    description: 'Roles DELETE success',
  })
  async deleteById(@param.path.string('_id') _id: string): Promise<void> {
    await this.rolesRepository.deleteById(_id);
  }
}
