import {RouterContext} from '@koa/router';
import ApiError from 'errors/ApiError';
import {getServerHost} from 'helpers/getServerHost';
import Koa from 'koa';
import {ImageType} from 'models/imageType';
import ImageService from 'services/imageService';
import {singleton} from 'tsyringe';
import strings from 'strings';

@singleton()
class ImageController {
  constructor(private imageService: ImageService) {}

  getImage = async (ctx: RouterContext, next: Koa.Next) => {
    const name = ctx.params.name;
    ctx.redirect(await this.imageService.getUrl(name));
  };

  save = async (ctx: RouterContext, next: Koa.Next, imageType: ImageType) => {
    if (!ctx.request.file) {
      throw ApiError.unprocessableEntity(strings.image.imageWasNotFoundInBody);
    }

    const url = await this.imageService.save(ctx.request.file, imageType);

    ctx.status = 201;
    ctx.body = {
      data: {
        url: getServerHost(ctx) + url,
      },
    };
  };
}

export default ImageController;
