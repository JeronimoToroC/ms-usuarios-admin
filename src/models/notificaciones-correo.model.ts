import {Model, model, property} from '@loopback/repository';

@model()
export class NotificacionCorreo extends Model {
  @property({
    type: 'string',
    required: true,
  })
  email: string;

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


  constructor(data?: Partial<NotificacionCorreo>) {
    super(data);
  }
}

export interface NotificacionesCorreoRelations {
  // describe navigational properties here
}

export type NotificacionesCorreoWithRelations = NotificacionCorreo & NotificacionesCorreoRelations;
