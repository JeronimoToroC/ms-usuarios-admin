import {Model, model, property} from '@loopback/repository';

@model()
export class NotificacionCorreo extends Model {
  @property({
    type: 'string',
    required: true,
  })
  detinatario: string;

  @property({
    type: 'string',
    required: true,
  })
  asunto: string;

  @property({
    type: 'string',
    required: true,
  })
  mensaje: string;

  @property({
    type: 'string',
  })
  adjunto?: string;


  constructor(data?: Partial<NotificacionCorreo>) {
    super(data);
  }
}

export interface NotificacionesCorreoRelations {
  // describe navigational properties here
}

export type NotificacionesCorreoWithRelations = NotificacionCorreo & NotificacionesCorreoRelations;
