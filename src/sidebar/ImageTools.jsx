import "./ImageTools.scss";
import {useEffect, useRef, useState} from "react";
import FileDAO from "../daos/FileDAO.js";
import StatusController from "../StatusController.js";
import {onAuthStateChanged} from "firebase/auth";
import {auth, statusMessages} from "../backend.js";
import Status from "../status/Status.jsx";

function ImageTools({editor, sidebarDisplay, imgToolsDisplay}) {
    const fileDAO = new FileDAO();
    const [getUser, setUser] = useState(null);
    const fileInput = useRef(null);
    const [getImgUrl, setImgUrl] = useState("");
    const urlInput = useRef(null);
    const [getStatusDisplay, setStatusDisplay] = useState("none");
    const [getStatusIconClass, setStatusIconClass] = useState("");
    const [getStatusMessageClass, setStatusMessageClass] = useState("");
    const [getStatusIcon, setStatusIcon] = useState("");
    const [getStatusMessage, setStatusMessage] = useState("");
    const statusController = new StatusController(
        setStatusDisplay, setStatusIconClass, setStatusMessageClass, setStatusIcon, setStatusMessage
    );

    useEffect(() => {
        const unsubUser = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => {
            unsubUser();
        };
    }, []);

    useEffect(() => {
        if (sidebarDisplay !== "hidden" && imgToolsDisplay !== "none") {
            // If the sidebar and image tools are displayed, focus on the URL input
            urlInput.current.focus();
        }
    }, [sidebarDisplay, imgToolsDisplay]);

    function addImgByUrl(url) {
        editor.chain().focus().setImage({src: url}).run();
    }

    async function uploadImg(e) {
        e.preventDefault();

        if (!getUser) {
            statusController.displayFailure(statusMessages.unauthorizedMessage);
            return;
        }

        statusController.displayProgress();
        const fileList = e.target.files;

        try {
            for (const file of fileList) {
                const reader = new FileReader();
                const extension = file.name.split(".").pop();
                const url = await fileDAO.uploadFile(file, extension);
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
            }

            statusController.displaySuccess(statusMessages.uploadedImgOk);
        } catch (error) {
            e.target.value = "";
            statusController.displayFailure(error.message);
        }
    }

    return (
        <div className="img-tools-container">
            <div className="title">Notes Image</div>
            <input type="text" className="img-url" placeholder="Enter URL..." ref={urlInput}
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
            <Status display={getStatusDisplay}
                    iconClass={getStatusIconClass}
                    messageClass={getStatusMessageClass}
                    icon={getStatusIcon}
                    message={getStatusMessage}/>
        </div>
    );
}

export default ImageTools;