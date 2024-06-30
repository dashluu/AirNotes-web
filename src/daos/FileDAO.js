import {v4 as uuidv4} from "uuid";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {statusMessages, storage} from "../backend.js";

export default class FileDAO {
    static maxFileSize = 5.;
    static extensions = ["image/png", "image/jpeg", "image/gif", "image/webp"];

    getFileSize(file) {
        return (file.size / 1024 / 1024).toFixed(2);
    }

    async uploadFile(file, extension) {
        if (this.getFileSize(file) > FileDAO.maxFileSize) {
            throw new Error(statusMessages.imgOverSize);
        }

        const fileId = uuidv4();
        const fileRef = ref(storage, `files/${fileId}.${extension}`);

        await uploadBytes(fileRef, file);
        return await getDownloadURL(fileRef);
    }
}