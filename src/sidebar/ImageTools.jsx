import "./ImageTools.scss";
import {useRef, useState} from "react";
import FileDAO from "../daos/FileDAO.js";

function ImageTools({editor}) {
    const fileDAO = new FileDAO();
    const fileInput = useRef(null);
    const [getImgUrl, setImgUrl] = useState("");

    function addImgByUrl(url) {
        editor.chain().focus().setImage({src: url}).run();
    }

    async function uploadImg(e) {
        e.preventDefault();
        const fileList = e.target.files;

        for (const file of fileList) {
            const reader = new FileReader();
            const extension = file.name.split(".").pop();

            await fileDAO.uploadFile(file, extension)
                .then((url) => {
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                        // Insert an image at the current cursor position
                        editor.chain().insertContentAt(editor.state.selection.anchor, {
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

    return (
        <div className="img-tools-container">
            <div className="title">Notes Image</div>
            <input type="text" className="img-url" placeholder="Enter URL..."
                   onChange={(e) => {
                       setImgUrl(e.target.value);
                   }}/>
            <button className="action-button add-img-by-url-button"
                    onClick={() => {
                        addImgByUrl(getImgUrl);
                    }}>
                Add image
            </button>
            <input type="file" ref={fileInput} multiple accept="image/*" style={{display: "none"}}
                   onChange={(e) => {
                       uploadImg(e);
                   }}/>
            <button className="action-button upload-img-files-button"
                    onClick={() => {
                        fileInput.current.click();
                    }}>
                Upload images
            </button>
        </div>
    );
}

export default ImageTools;