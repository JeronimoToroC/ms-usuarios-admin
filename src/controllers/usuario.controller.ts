import {service} from '@loopback/core';
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
import {Configuraciones} from '../config/configuraciones';
import {Credenciales, CredencialesCambioClave, CredencialesRecuperarClave, NotificacionCorreo, NotificacionesSms, Usuarios} from '../models';
import {UsuariosRepository} from '../repositories';
import {AdminDePasswordsService, NotificacionesService, SesionUsuariosService} from '../services';

export class UsuarioController {
  constructor(
    @repository(UsuariosRepository)
    public usuariosRepository: UsuariosRepository,
    @service(AdminDePasswordsService)
    public passwordService: AdminDePasswordsService,
    @service(NotificacionesService)
    public servicioNotificaciones: NotificacionesService
    @service(SesionUsuariosService)
    private servicioSesionUsuarios: SesionUsuariosService
  ) { }

  @post('/usuarios')
  @response(200, {
    description: 'Usuarios model instance',
    content: {'application/json': {schema: getModelSchemaRef(Usuarios)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuarios, {
            title: 'NewUsuarios',
            exclude: ['_id'],
          }),
        },
      },
    })
    usuarios: Omit<Usuarios, '_id'>,
  ): Promise<Usuarios> {
    const password = this.passwordService.generateRandomPassword()
    //Aquí se hace la notificación de la clave al usuario (password )
    const notiticacion = new NotificacionCorreo();
    notiticacion.detinatario = usuarios.email;
    notiticacion.asunto = "Registro en el sistema";
    notiticacion.mensaje = `Hola${usuarios.name}<br/>Su clave de acceso al sistama es ${password} y su usuario es ${usuarios.email}`;
    this.servicioNotificaciones.enviarCorreo(notiticacion);
    const cryptingPassword = this.passwordService.cryptngText(password)
    usuarios.password = cryptingPassword
    return this.usuariosRepository.create(usuarios);
  }

  @get('/usuarios/count')
  @response(200, {
    description: 'Usuarios model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Usuarios) where?: Where<Usuarios>,
  ): Promise<Count> {
    return this.usuariosRepository.count(where);
  }

  @get('/usuarios')
  @response(200, {
    description: 'Array of Usuarios model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Usuarios, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Usuarios) filter?: Filter<Usuarios>,
  ): Promise<Usuarios[]> {
    return this.usuariosRepository.find(filter);
  }

  @patch('/usuarios')
  @response(200, {
    description: 'Usuarios PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuarios, {partial: true}),
        },
      },
    })
    usuarios: Usuarios,
    @param.where(Usuarios) where?: Where<Usuarios>,
  ): Promise<Count> {
    return this.usuariosRepository.updateAll(usuarios, where);
  }

  @get('/usuarios/{_id}')
  @response(200, {
    description: 'Usuarios model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Usuarios, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('_id') _id: string,
    @param.filter(Usuarios, {exclude: 'where'}) filter?: FilterExcludingWhere<Usuarios>
  ): Promise<Usuarios> {
    return this.usuariosRepository.findById(_id, filter);
  }

  @patch('/usuarios/{_id}')
  @response(204, {
    description: 'Usuarios PATCH success',
  })
  async updateById(
    @param.path.string('_id') _id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuarios, {partial: true}),
        },
      },
    })
    usuarios: Usuarios,
  ): Promise<void> {
    await this.usuariosRepository.updateById(_id, usuarios);
  }

  @put('/usuarios/{_id}')
  @response(204, {
    description: 'Usuarios PUT success',
  })
  async replaceById(
    @param.path.string('_id') _id: string,
    @requestBody() usuarios: Usuarios,
  ): Promise<void> {
    await this.usuariosRepository.replaceById(_id, usuarios);
  }

  @del('/usuarios/{_id}')
  @response(204, {
    description: 'Usuarios DELETE success',
  })
  async deleteById(@param.path.string('_id') _id: string): Promise<void> {
    await this.usuariosRepository.deleteById(_id);
  }


  @post("/identificar-usuario", {
    responses: {
      "200": {
        description: "Identificación de usuario"
      }
    }
  })
  async identificar(
    @requestBody() credenciales: Credenciales
  ): Promise<Object> {
    const usuario = await this.servicioSesionUsuarios.ValidarCredenciales(credenciales);
    let token = "";
    if (usuario) {
      usuario.clave = "";
      token = this.servicioSesionUsuarios.CrearToken(usuario);
    }
    return {
      tk: token,
      usuario: usuario
    };
  }

  @post("/recuperar-contraseña", {
    responses: {
      "200": {
        description: "Recuperar contraseña de usuarios "
      }
    }
  })
  async passwordRecover(
    @requestBody() credenciales: CredencialesRecuperarClave
  ): Promise<boolean> {
    const usuario = await this.usuariosRepository.findOne({
      where: {
        email: credenciales.email
      }
    });
    if (usuario) {
      const password = this.passwordService.generateRandomPassword()
      const cryptedPassword = this.passwordService.cryptngText(password)
      usuario.password = cryptedPassword
      await this.usuariosRepository.updateById(usuario._id, usuario)
      //aqui we
      const notiticacion = new NotificacionesSms();
      notiticacion.destino = usuario.cell;
      notiticacion.mensaje = `${Configuraciones.saludo_notificaciones}${usuario.name}${Configuraciones.mensaje_recuperacion_clave} ${password}`;
      this.servicioNotificaciones.enviarSms(notiticacion);
      return true
    }
    return false;
  }

  @post("/cambiar-contraseña", {
    responses: {
      "200": {
        description: "Cambiar contraseña de usuarios "
      }
    }
  })
  async passwordChanger(
    @requestBody() data: CredencialesCambioClave
  ): Promise<boolean> {
    const usuario = await this.usuariosRepository.findById(data.id);
    if (usuario) {
      if (usuario.password === data.currentPassword) {
        usuario.password = data.newPassword
        await this.usuariosRepository.updateById(data.id, usuario)
        //aqui we
        const notiticacion = new NotificacionCorreo();
        notiticacion.detinatario = usuario.email;
        notiticacion.asunto = Configuraciones.asunto_cambio_clave;
        notiticacion.mensaje = `${Configuraciones.saludo_notificaciones}${usuario.name}<br/>${Configuraciones.mensaje_cambio_clave}`;
        this.servicioNotificaciones.enviarCorreo(notiticacion);
        const cryptingPassword = this.passwordService.cryptngText(usuario.password)
        usuario.password = cryptingPassword
        return true
      } else {
        return false
      }
    }
    return false;
  }
}


