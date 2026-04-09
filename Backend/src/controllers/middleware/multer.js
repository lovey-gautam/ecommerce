import multer from "multer";
const storage = multer.memoryStorage();

export const singleUpload = multer({storage}).single("file")// for single file

export const multipleUpload = multer({storage}).array("files",5)// multiple file 5 is no of images upload