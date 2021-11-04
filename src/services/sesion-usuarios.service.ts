import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Configuraciones as config} from '../config/configuraciones';
import {Credenciales, Usuarios} from '../models';
import {UsuariosRepository} from '../repositories';
const fetch =require('node-fetch');

@injectable({scope: BindingScope.TRANSIENT})
export class SesionUsuariosService {
  constructor(
    @repository(UsuariosRepository)
    private usuarioRepository: UsuariosRepository
  ) {}

  /*
   * Add service methods here
   */
  async ValidarCredenciales(credenciales:Credenciales):Usuario{
    let usuario = await this.usuariosRepository.findOne({
      where: {
        email: credenciales.usuario,
        password: credenciales.password
      }
    });
    return usuario;
  }

  async CrearToken(usuario: Usuarios): Promise<string> {
    let url_crear_token = `${config.url_crear_token}?${config.arg_nombre_token}=${usuario.name}&${config.arg_id_persona_token}=${usuario._id}`
    let token = "";
    await fetch(url_crear_token)
    .then((res: any) =>{
      token = res.text();
      console.log(token);
    })
    return token;
  }

}
