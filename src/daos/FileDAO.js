import {v4 as uuidv4} from "uuid";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {storage} from "../backend.js";

export default class FileDAO {
    static maxFileSize = 5.;
    static extensions = ["image/png", "image/jpeg", "image/gif", "image/webp"];

    async uploadFile(file, extension) {
        const fileId = uuidv4();
        const fileRef = ref(storage, `files/${fileId}.${extension}`);

        await uploadBytes(fileRef, file)
            .catch((error) => {
                throw error;
            });

        return await getDownloadURL(fileRef)
            .catch((error) => {
                throw error;
            });
    }
}