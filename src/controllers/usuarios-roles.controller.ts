import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Usuarios,
  Roles,
} from '../models';
import {UsuariosRepository} from '../repositories';

export class UsuariosRolesController {
  constructor(
    @repository(UsuariosRepository)
    public usuariosRepository: UsuariosRepository,
  ) { }

  @get('/usuarios/{id}/roles', {
    responses: {
      '200': {
        description: 'Roles belonging to Usuarios',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Roles)},
          },
        },
      },
    },
  })
  async getRoles(
    @param.path.string('id') id: typeof Usuarios.prototype._id,
  ): Promise<Roles> {
    return this.usuariosRepository.roles(id);
  }
}
