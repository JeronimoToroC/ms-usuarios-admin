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
import {FotoUsers} from '../models';
import {FotoUsersRepository} from '../repositories';

export class FotoUsersController {
  constructor(
    @repository(FotoUsersRepository)
    public fotoUsersRepository : FotoUsersRepository,
  ) {}

  @post('/foto-users')
  @response(200, {
    description: 'FotoUsers model instance',
    content: {'application/json': {schema: getModelSchemaRef(FotoUsers)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FotoUsers, {
            title: 'NewFotoUsers',
            exclude: ['_id'],
          }),
        },
      },
    })
    fotoUsers: Omit<FotoUsers, '_id'>,
  ): Promise<FotoUsers> {
    return this.fotoUsersRepository.create(fotoUsers);
  }

  @get('/foto-users/count')
  @response(200, {
    description: 'FotoUsers model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(FotoUsers) where?: Where<FotoUsers>,
  ): Promise<Count> {
    return this.fotoUsersRepository.count(where);
  }

  @get('/foto-users')
  @response(200, {
    description: 'Array of FotoUsers model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(FotoUsers, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(FotoUsers) filter?: Filter<FotoUsers>,
  ): Promise<FotoUsers[]> {
    return this.fotoUsersRepository.find(filter);
  }

  @patch('/foto-users')
  @response(200, {
    description: 'FotoUsers PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FotoUsers, {partial: true}),
        },
      },
    })
    fotoUsers: FotoUsers,
    @param.where(FotoUsers) where?: Where<FotoUsers>,
  ): Promise<Count> {
    return this.fotoUsersRepository.updateAll(fotoUsers, where);
  }

  @get('/foto-users/{id}')
  @response(200, {
    description: 'FotoUsers model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(FotoUsers, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(FotoUsers, {exclude: 'where'}) filter?: FilterExcludingWhere<FotoUsers>
  ): Promise<FotoUsers> {
    return this.fotoUsersRepository.findById(id, filter);
  }

  @patch('/foto-users/{id}')
  @response(204, {
    description: 'FotoUsers PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FotoUsers, {partial: true}),
        },
      },
    })
    fotoUsers: FotoUsers,
  ): Promise<void> {
    await this.fotoUsersRepository.updateById(id, fotoUsers);
  }

  @put('/foto-users/{id}')
  @response(204, {
    description: 'FotoUsers PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() fotoUsers: FotoUsers,
  ): Promise<void> {
    await this.fotoUsersRepository.replaceById(id, fotoUsers);
  }

  @del('/foto-users/{id}')
  @response(204, {
    description: 'FotoUsers DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.fotoUsersRepository.deleteById(id);
  }
}
