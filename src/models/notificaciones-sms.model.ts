import {Model, model, property} from '@loopback/repository';

@model()
export class NotificacionesSms extends Model {
  @property({
    type: 'string',
    required: true,
  })
  destino: string;

  @property({
    type: 'string',
    required: true,
  })
  mensaje: string;


  constructor(data?: Partial<NotificacionesSms>) {
    super(data);
  }
}

export interface NotificacionesSmsRelations {
  // describe navigational properties here
}

export type NotificacionesSmsWithRelations = NotificacionesSms & NotificacionesSmsRelations;
