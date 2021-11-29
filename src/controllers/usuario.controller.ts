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
    public servicioNotificaciones: NotificacionesService,
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
    let password = this.passwordService.generateRandomPassword()
    //console.log(password)
    //Aquí se hace la notificación de la clave al usuario (password )
    const notiticacion = new NotificacionCorreo();
    notiticacion.email = usuarios.email;
    notiticacion.asunto = "Registro en el sistema";
    notiticacion.mensaje = `${Configuraciones.saludo_notificaciones} ${usuarios.name}<br/>${Configuraciones.asunto_generacion_clave} ${password} ${Configuraciones.asunto_definicion_usuario} ${usuarios.email}`;
    this.servicioNotificaciones.enviarCorreo(notiticacion);
    let cryptingPassword = this.passwordService.cryptngText(password)
    usuarios.password = cryptingPassword
    console.log(usuarios.password)
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
      '200': {
        description: "Identificación de usuarios"
      }
    }
  })
  async identificar(
    @requestBody() credenciales: Credenciales
  ): Promise<object> {
    const usuario = await this.servicioSesionUsuarios.ValidarCredenciales(credenciales);
    let token = "";
    if (usuario) {
      usuario.password = "";
      token = await this.servicioSesionUsuarios.CrearToken(usuario);
    }
    return {
      tk: token,
      usuario: usuario
    };
  }

  @post("/recuperar-contrasenia", {
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
      let password = this.passwordService.generateRandomPassword()
      let cryptedPassword = this.passwordService.cryptngText(password)
      usuario.password = this.passwordService.cryptngText(password)
      await this.usuariosRepository.updateById(usuario._id, usuario)
      //aqui we
      const notiticacion = new NotificacionesSms();
      notiticacion.destino = usuario.cell;
      notiticacion.mensaje = `${Configuraciones.saludo_notificaciones} ${usuario.name} ${Configuraciones.mensaje_recuperacion_clave} ${password}`;
      this.servicioNotificaciones.enviarSms(notiticacion);
      return true
    }
    return false;
  }

  @post("/enviar-contrasenia", {
    responses: {
      "200": {
        description: "Recuperar contraseña de usuarios "
      }
    }
  })
  async passwordSender(
    @requestBody() credenciales: CredencialesRecuperarClave
  ): Promise<boolean> {
    const usuario = await this.usuariosRepository.findOne({
      where: {
        email: credenciales.email
      }
    });
    if (usuario) {
      /* let password = this.passwordService.generateRandomPassword()
      let cryptedPassword = this.passwordService.cryptngText(password)
      usuario.password = this.passwordService.cryptngText(password)
      await this.usuariosRepository.updateById(usuario._id, usuario)
      //aqui we
      const notiticacion = new NotificacionCorreo();
      notiticacion.email = usuario.email;
      notiticacion.asunto = Configuraciones.asunto_generar_clave;
      notiticacion.mensaje = `${Configuraciones.saludo_notificaciones}${usuario.name}<br/>${Configuraciones.mensaje_generacion_clave}${password}`;
      console.log("--------------", usuario.password)
      console.log("MMMMMMMMMMMMMMM", password)
      this.servicioNotificaciones.enviarCorreo(notiticacion);
      const cryptingPassword = this.passwordService.cryptngText(usuario.password)
      usuario.password = cryptingPassword */
      return true
    }
    return false;
  }

  @post("/cambiar-contrasenia", {
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
        notiticacion.email = usuario.email;
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


