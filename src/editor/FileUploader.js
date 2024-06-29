import {v4 as uuidv4} from "uuid";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {storage} from "../backend.js";

export default class FileUploader {
    static imageExtension = ["image/png", "image/jpeg", "image/gif", "image/webp"];

    static async uploadFile(file, extension) {
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

    static async #dropPasteHelper(editor, fileList, pos) {
        for (const file of fileList) {
            const reader = new FileReader();
            const extension = file.name.split(".").pop();
            await FileUploader.uploadFile(file, extension)
                .then((url) => {
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                        editor.chain().insertContentAt(pos, {
                            type: "image",
                            attrs: {
                                src: url,
                            },
                        }).focus().run();
                    };
                })
                .catch((error) => {
                    throw error;
                });
        }
    }

    static pasteFile(editor, fileList, htmlContent) {
        if (htmlContent) {
            return false;
        }

        FileUploader.#dropPasteHelper(editor, fileList, editor.state.selection.anchor);
    }

    static dropFile(editor, fileList, pos) {
        FileUploader.#dropPasteHelper(editor, fileList, pos);
    }
}