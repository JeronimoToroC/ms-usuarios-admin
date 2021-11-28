// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';


export class CargaFotoController {
  constructor() { }
}
// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  HttpErrors, param, post,
  Request,
  requestBody,
  Response,
  RestBindings
} from '@loopback/rest';
import multer from 'multer';
import path from 'path';
import {Configuraciones as llaves} from '../config/configuraciones';
import {Usuarios} from '../models';
import {UsuariosRepository} from '../repositories';

export class CargaFotoProponente {
  constructor(
    @repository(UsuariosRepository)
    private fotoRepository: UsuariosRepository
  ) { }



  /**
   *
   * @param response
   * @param request
   */
  @post('/CargarFotoProponente/{id_proponente}', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Función de carga de la imagen de la persona.',
      },
    },
  })
  async cargarFotoProponente(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @requestBody.file() request: Request,
    @param.path.number("id_proponente") id: number
  ): Promise<object | false> {
    const rutaDocumento = path.join(__dirname, llaves.carpetaFoto);
    const res = await this.StoreFileToPath(rutaDocumento, llaves.nombreCampoFoto, request, response, llaves.extensionesPermitidasIMG);
    if (res) {
      const nombre_foto = response.req?.file?.filename;
      if (nombre_foto) {
        const foto = new Usuarios();
        await this.fotoRepository.save(foto);
        return {filename: nombre_foto};
      }
    }
    return res;
  }

  /**
   * Return a config for multer storage
   * @param path
   */
  private GetMulterStorageConfig(path: string) {
    let filename = '';
    const storage = multer.diskStorage({
      destination: function (req: any, file: any, cb: any) {
        cb(null, path)
      },
      filename: function (req: any, file: any, cb: any) {
        filename = `${Date.now()}-${file.originalname}`
        cb(null, filename);
      }
    });
    return storage;
  }

  /**
   * store the file in a specific path
   * @param storePath
   * @param request
   * @param response
   */
  private StoreFileToPath(storePath: string, fieldname: string, request: Request, response: Response, acceptedExt: string[]): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      const storage = this.GetMulterStorageConfig(storePath);
      const upload = multer({
        storage: storage,
        fileFilter: function (req: any, file: any, callback: any) {
          const ext = path.extname(file.originalname).toUpperCase();
          if (acceptedExt.includes(ext)) {
            return callback(null, true);
          }
          return callback(new HttpErrors[400]('El formato del archivo no es permitido.'));
        },
        limits: {
          fileSize: llaves.tamMaxFoto
        }
      },
      ).single(fieldname);
      upload(request, response, (err: any) => {
        if (err) {
          reject(err);
        }
        resolve(response);
      });
    });
  }

}
