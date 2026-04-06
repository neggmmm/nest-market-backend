export const FILE_STORAGE = Symbol('FILE_STORAGE');

export interface FileStorage {
  save(file?: Express.Multer.File): Promise<string | undefined>;
}
