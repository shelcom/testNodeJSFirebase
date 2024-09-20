import {ImageType} from 'models/imageType';
import {Model} from 'objection';

export interface IImage {
  id: number;
  original: string;
  type: ImageType;
  size_500_x_500: string;
  size_100_x_100: string;
}

export class Image extends Model implements IImage {
  id: number;
  original: string;
  type: ImageType;
  size_100_x_100: string;
  size_500_x_500: string;

  static get tableName() {
    return 'Images';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['original', 'type'],

      properties: {
        id: {type: 'integer'},
        original: {type: 'string'},
        type: {type: 'string'},
        size_100_x_100: {type: 'string'},
        size_500_x_500: {type: 'string'},
      },
    };
  }
}
