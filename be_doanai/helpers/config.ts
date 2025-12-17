import { diskStorage } from 'multer';
import { Request } from 'express';
import { FileCallback, Options } from 'multer';

export const storageConfig = (folder: string) =>
    diskStorage({
        destination: `uploads/${folder}`,
        filename:(req,file,cb) => {
            cb(null, Date.now() + '-' + file.originalname);
        }
    });
