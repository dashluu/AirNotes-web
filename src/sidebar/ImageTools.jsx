import "./ImageTools.scss";
import {useEffect, useRef, useState} from "react";
import FileDAO from "../daos/FileDAO.js";
import StatusController from "../ui_elements/StatusController.js";
import {statusMessages} from "../backend.js";
import Status from "../status/Status.jsx";
import SidebarActionButton from "./SidebarActionButton.jsx";

function ImageTools({user, editor, imgToolsDisplay}) {
    const fileDAO = new FileDAO();
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
        if (imgToolsDisplay !== "none") {
            // If the image tools are displayed, focus on the URL input
            urlInput.current.focus();
        }
    }, [imgToolsDisplay]);

    function addImgByUrl(url) {
        editor.chain().focus().setImage({src: url}).run();
    }

    async function uploadImg(e) {
        e.preventDefault();

        if (!user) {
            statusController.displayFailure(statusMessages.unauthorizedAccess);
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
        <div className="img-tools-container sidebar-container" style={{display: imgToolsDisplay}}>
            <div className="sidebar-title">Notes Image</div>
            <input type="text" className="text-input img-url" placeholder="Enter URL" ref={urlInput}
                   onChange={(e) => setImgUrl(e.target.value)}
                   onKeyDown={(e) => {
                       if (e.key === "Enter") {
                           addImgByUrl(getImgUrl);
                       }
                   }}/>
            <div className="sidebar-button-container">
                <SidebarActionButton icon="link" text="Add by URL" disabled={getImgUrl === ""}
                                     click={() => addImgByUrl(getImgUrl)}/>
                <SidebarActionButton icon="upload" text="Upload"
                                     click={() => fileInput.current.click()}/>
            </div>
            <input type="file" ref={fileInput} multiple accept="image/*" style={{display: "none"}}
                   onChange={(e) => {
                       uploadImg(e);
                   }}/>
            <Status display={getStatusDisplay}
                    iconClass={getStatusIconClass}
                    messageClass={getStatusMessageClass}
                    icon={getStatusIcon}
                    message={getStatusMessage}/>
        </div>
    );
}

export default ImageTools;