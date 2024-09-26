import ApiError from 'errors/ApiError';
import Joi from 'joi';
import {Socket} from 'socket.io';
import {CommonEventType, EmitEventType} from './eventType';
import strings from 'strings';

export class BaseSocketServer {
  protected socket: Socket = null;

  protected inform = (message: string) => {
    this.socket.emit(EmitEventType.inform, message);
  };

  protected roomName = (id: number) => {
    return 'base_room';
  };

  protected error = (err: ApiError) => {
    this.socket.emit(EmitEventType.error, {
      message: err.message,
      errors: err.errors,
    });
  };

  protected validate = async (schema: Object, data: Object) => {
    return new Promise<void>((resolve) => {
      const joiObject = Joi.object(schema);
      const {error} = joiObject.validate(data);
      if (error) {
        return this.error(
          ApiError.unprocessableEntity(
            strings.common.validationError,
            error.details,
          ),
        );
      }

      resolve();
    });
  };

  protected emitToRoom = (id: number, event: CommonEventType, message: any) => {
    this.socket.to(this.roomName(id)).emit(event, message);
    this.socket.emit(event, message);
  };
}
