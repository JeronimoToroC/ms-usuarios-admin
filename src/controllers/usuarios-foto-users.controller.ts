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
  Usuarios,
  FotoUsers,
} from '../models';
import {UsuariosRepository} from '../repositories';

export class UsuariosFotoUsersController {
  constructor(
    @repository(UsuariosRepository) protected usuariosRepository: UsuariosRepository,
  ) { }

  @get('/usuarios/{id}/foto-users', {
    responses: {
      '200': {
        description: 'Array of Usuarios has many FotoUsers',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(FotoUsers)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<FotoUsers>,
  ): Promise<FotoUsers[]> {
    return this.usuariosRepository.fotoUsers(id).find(filter);
  }

  @post('/usuarios/{id}/foto-users', {
    responses: {
      '200': {
        description: 'Usuarios model instance',
        content: {'application/json': {schema: getModelSchemaRef(FotoUsers)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Usuarios.prototype._id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FotoUsers, {
            title: 'NewFotoUsersInUsuarios',
            exclude: ['_id'],
            optional: ['usuariosId']
          }),
        },
      },
    }) fotoUsers: Omit<FotoUsers, '_id'>,
  ): Promise<FotoUsers> {
    return this.usuariosRepository.fotoUsers(id).create(fotoUsers);
  }

  @patch('/usuarios/{id}/foto-users', {
    responses: {
      '200': {
        description: 'Usuarios.FotoUsers PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FotoUsers, {partial: true}),
        },
      },
    })
    fotoUsers: Partial<FotoUsers>,
    @param.query.object('where', getWhereSchemaFor(FotoUsers)) where?: Where<FotoUsers>,
  ): Promise<Count> {
    return this.usuariosRepository.fotoUsers(id).patch(fotoUsers, where);
  }

  @del('/usuarios/{id}/foto-users', {
    responses: {
      '200': {
        description: 'Usuarios.FotoUsers DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(FotoUsers)) where?: Where<FotoUsers>,
  ): Promise<Count> {
    return this.usuariosRepository.fotoUsers(id).delete(where);
  }
}
