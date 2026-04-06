import { Injectable } from '@nestjs/common';
import { FileStorage } from '../../application/ports/file-storage.port';

@Injectable()
export class LocalFileStorageService implements FileStorage {
  async save(file?: Express.Multer.File): Promise<string | undefined> {
    return file?.path;
  }
}
