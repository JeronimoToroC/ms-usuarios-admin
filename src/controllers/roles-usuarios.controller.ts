import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {
  Roles,
  Usuarios
} from '../models';
import {RolesRepository} from '../repositories';

export class RolesUsuariosController {
  constructor(
    @repository(RolesRepository) protected rolesRepository: RolesRepository,
  ) { }

  @get('/roles/{id}/usuarios', {
    responses: {
      '200': {
        description: 'Array of Roles has many Usuarios',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Usuarios)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Usuarios>,
  ): Promise<Usuarios[]> {
    return this.rolesRepository.usuarios(id).find(filter);
  }

  @post('/roles/{id}/usuarios', {
    responses: {
      '200': {
        description: 'Roles model instance',
        content: {'application/json': {schema: getModelSchemaRef(Usuarios)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Roles.prototype._id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuarios, {
            title: 'NewUsuariosInRoles',
            exclude: ['_id'],
            optional: ['rolesId']
          }),
        },
      },
    }) usuarios: Omit<Usuarios, '_id'>,
  ): Promise<Usuarios> {
    return this.rolesRepository.usuarios(id).create(usuarios);
  }

  @patch('/roles/{id}/usuarios', {
    responses: {
      '200': {
        description: 'Roles.Usuarios PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuarios, {partial: true}),
        },
      },
    })
    usuarios: Partial<Usuarios>,
    @param.query.object('where', getWhereSchemaFor(Usuarios)) where?: Where<Usuarios>,
  ): Promise<Count> {
    return this.rolesRepository.usuarios(id).patch(usuarios, where);
  }

  @del('/roles/{id}/usuarios', {
    responses: {
      '200': {
        description: 'Roles.Usuarios DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Usuarios)) where?: Where<Usuarios>,
  ): Promise<Count> {
    return this.rolesRepository.usuarios(id).delete(where);
  }
}
