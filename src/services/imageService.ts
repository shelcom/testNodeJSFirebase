import ApiError from 'errors/ApiError';
import strings from 'strings';
import {injectable} from 'tsyringe';
import ImageRepository from 'repositories/imageRepository';
import minio from 'configs/minio';
import {v4} from 'uuid';
import multer from '@koa/multer';
import {ImageType} from 'models/imageType';

@injectable()
class ImageService {
  constructor(private imageRepository: ImageRepository) {}

  save = async (file: multer.File, type: ImageType) => {
    file.filename = this.configureNameFromMimetype(file.mimetype);
    await this.saveToBucket(
      file.filename,
      file.size,
      file.buffer,
      file.mimetype,
    );
    await this.imageRepository.create({original: file.filename, type});
    return file.filename;
  };

  checkIfImagesExist = async (imageUrls: string[], type: ImageType) => {
    const names = imageUrls.map((url) => url.getImageName());
    return await this.imageRepository.valuesExistIn(
      {
        key: 'original',
        values: names,
      },
      {type},
    );
  };

  replaceImages = async (oldLinks: string[], newLinks: string[]) => {
    const linksToRemove = oldLinks.filter((item) => !newLinks.includes(item));

    for (let index = 0; index < linksToRemove.length; index++) {
      await this.delete(linksToRemove[index]);
    }
  };

  getUrl = async (name: string) => {
    const url = await minio.presignedGetObject(process.env.BUCKET_NAME, name);
    return url;
  };

  private delete = async (link: string) => {
    const name = link.getImageName();

    const image = await this.imageRepository.findOneByCondition({
      original: name,
    });

    if (image) {
      await this.deleteFromBucket(name);
      await this.imageRepository.delete(image);
    }
  };

  private configureNameFromMimetype = (mimetype: string) => {
    const type = mimetype.split('/')[1];
    return v4() + '_original.' + type;
  };

  private saveToBucket = async (
    fileName: string,
    fileSize: number,
    fileBuffer: Buffer,
    contentType: string,
  ) => {
    const metadata = {
      'Content-type': contentType,
    };

    await minio.putObject(
      process.env.BUCKET_NAME,
      fileName,
      fileBuffer,
      fileSize,
      metadata,
    );
  };

  private deleteFromBucket = async (name: string) => {
    return await minio.removeObject(process.env.BUCKET_NAME, name);
  };
}

export default ImageService;
