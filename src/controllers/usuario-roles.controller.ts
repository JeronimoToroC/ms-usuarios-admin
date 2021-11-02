import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {UsuarioRoles} from '../models';
import {UsuarioRolesRepository} from '../repositories';

export class UsuarioRolesController {
  constructor(
    @repository(UsuarioRolesRepository)
    public usuarioRolesRepository : UsuarioRolesRepository,
  ) {}

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
            exclude: ['id'],
          }),
        },
      },
    })
    usuarioRoles: Omit<UsuarioRoles, 'id'>,
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

  @get('/usuario-roles/{id}')
  @response(200, {
    description: 'UsuarioRoles model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UsuarioRoles, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(UsuarioRoles, {exclude: 'where'}) filter?: FilterExcludingWhere<UsuarioRoles>
  ): Promise<UsuarioRoles> {
    return this.usuarioRolesRepository.findById(id, filter);
  }

  @patch('/usuario-roles/{id}')
  @response(204, {
    description: 'UsuarioRoles PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UsuarioRoles, {partial: true}),
        },
      },
    })
    usuarioRoles: UsuarioRoles,
  ): Promise<void> {
    await this.usuarioRolesRepository.updateById(id, usuarioRoles);
  }

  @put('/usuario-roles/{id}')
  @response(204, {
    description: 'UsuarioRoles PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() usuarioRoles: UsuarioRoles,
  ): Promise<void> {
    await this.usuarioRolesRepository.replaceById(id, usuarioRoles);
  }

  @del('/usuario-roles/{id}')
  @response(204, {
    description: 'UsuarioRoles DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.usuarioRolesRepository.deleteById(id);
  }
}
