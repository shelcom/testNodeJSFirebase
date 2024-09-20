import {Image} from 'models/database';
import {injectable} from 'tsyringe';
import BaseRepository from './baseRepository';

@injectable()
export default class ImageRepository extends BaseRepository<Image> {
  constructor() {
    super(Image);
  }
}
