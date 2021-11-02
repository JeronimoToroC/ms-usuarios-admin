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
import {UsuarioRoles} from '../models';
import {UsuarioRolesRepository} from '../repositories';

export class UsuarioRolesController {
  constructor(
    @repository(UsuarioRolesRepository)
    public usuarioRolesRepository: UsuarioRolesRepository,
  ) { }

  @post('/usuario-roles')
  @response(200, {
    description: 'UsuarioRoles model instance',
    content: {'application/json': {schema: getModelSchemaRef(UsuarioRoles)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UsuarioRoles, {
            title: 'NewUsuarioRoles',
            exclude: ['_id'],
          }),
        },
      },
    })
    usuarioRoles: Omit<UsuarioRoles, '_id'>,
  ): Promise<UsuarioRoles> {
    return this.usuarioRolesRepository.create(usuarioRoles);
  }

  @get('/usuario-roles/count')
  @response(200, {
    description: 'UsuarioRoles model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(UsuarioRoles) where?: Where<UsuarioRoles>,
  ): Promise<Count> {
    return this.usuarioRolesRepository.count(where);
  }

  @get('/usuario-roles')
  @response(200, {
    description: 'Array of UsuarioRoles model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(UsuarioRoles, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(UsuarioRoles) filter?: Filter<UsuarioRoles>,
  ): Promise<UsuarioRoles[]> {
    return this.usuarioRolesRepository.find(filter);
  }

  @patch('/usuario-roles')
  @response(200, {
    description: 'UsuarioRoles PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UsuarioRoles, {partial: true}),
        },
      },
    })
    usuarioRoles: UsuarioRoles,
    @param.where(UsuarioRoles) where?: Where<UsuarioRoles>,
  ): Promise<Count> {
    return this.usuarioRolesRepository.updateAll(usuarioRoles, where);
  }

  @get('/usuario-roles/{_id}')
  @response(200, {
    description: 'UsuarioRoles model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UsuarioRoles, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('_id') _id: string,
    @param.filter(UsuarioRoles, {exclude: 'where'}) filter?: FilterExcludingWhere<UsuarioRoles>
  ): Promise<UsuarioRoles> {
    return this.usuarioRolesRepository.findById(_id, filter);
  }

  @patch('/usuario-roles/{_id}')
  @response(204, {
    description: 'UsuarioRoles PATCH success',
  })
  async updateById(
    @param.path.string('_id') _id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UsuarioRoles, {partial: true}),
        },
      },
    })
    usuarioRoles: UsuarioRoles,
  ): Promise<void> {
    await this.usuarioRolesRepository.updateById(_id, usuarioRoles);
  }

  @put('/usuario-roles/{_id}')
  @response(204, {
    description: 'UsuarioRoles PUT success',
  })
  async replaceById(
    @param.path.string('_id') _id: string,
    @requestBody() usuarioRoles: UsuarioRoles,
  ): Promise<void> {
    await this.usuarioRolesRepository.replaceById(_id, usuarioRoles);
  }

  @del('/usuario-roles/{_id}')
  @response(204, {
    description: 'UsuarioRoles DELETE success',
  })
  async deleteById(@param.path.string('_id') _id: string): Promise<void> {
    await this.usuarioRolesRepository.deleteById(_id);
  }
}
