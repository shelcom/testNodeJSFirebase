import {Comment} from 'models/database';
import {injectable} from 'tsyringe';
import BaseRepository from './baseRepository';

@injectable()
export default class CommentRepository extends BaseRepository<Comment> {
  constructor() {
    super(Comment);
  }
}
