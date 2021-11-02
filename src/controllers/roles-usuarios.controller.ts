import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
  import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
Roles,
UsuarioRoles,
Usuarios,
} from '../models';
import {RolesRepository} from '../repositories';

export class RolesUsuariosController {
  constructor(
    @repository(RolesRepository) protected rolesRepository: RolesRepository,
  ) { }

  @get('/roles/{id}/usuarios', {
    responses: {
      '200': {
        description: 'Array of Roles has many Usuarios through UsuarioRoles',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Usuarios)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Usuarios>,
  ): Promise<Usuarios[]> {
    return this.rolesRepository.usuarioRoles(id).find(filter);
  }

  @post('/roles/{id}/usuarios', {
    responses: {
      '200': {
        description: 'create a Usuarios model instance',
        content: {'application/json': {schema: getModelSchemaRef(Usuarios)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Roles.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuarios, {
            title: 'NewUsuariosInRoles',
            exclude: ['id'],
          }),
        },
      },
    }) usuarios: Omit<Usuarios, 'id'>,
  ): Promise<Usuarios> {
    return this.rolesRepository.usuarioRoles(id).create(usuarios);
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
    @param.path.number('id') id: number,
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
    return this.rolesRepository.usuarioRoles(id).patch(usuarios, where);
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
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Usuarios)) where?: Where<Usuarios>,
  ): Promise<Count> {
    return this.rolesRepository.usuarioRoles(id).delete(where);
  }
}
