import "./AIImage.scss";
import Status from "../status/Status.jsx";
import {useEffect, useRef, useState} from "react";
import StatusController from "../ui_elements/StatusController.js";
import {statusMessages} from "../backend.js";
import SidebarActionButton from "./SidebarActionButton.jsx";

function AIImage({user, aiImgDisplay}) {
    const [getImg, setImg] = useState(null);
    const [getImgDescription, setImgDescription] = useState("");
    const imgDescriptionInput = useRef(null);
    const [getImgGenDisplay, setImgGenDisplay] = useState("none");
    const [getImgGenUrl, setImgGenUrl] = useState("");
    const [getStatusDisplay, setStatusDisplay] = useState("none");
    const [getStatusIconClass, setStatusIconClass] = useState("");
    const [getStatusMessageClass, setStatusMessageClass] = useState("");
    const [getStatusIcon, setStatusIcon] = useState("");
    const [getStatusMessage, setStatusMessage] = useState("");
    const statusController = new StatusController(
        setStatusDisplay, setStatusIconClass, setStatusMessageClass, setStatusIcon, setStatusMessage
    );

    useEffect(() => {
        if (aiImgDisplay !== "none") {
            // If the AI image UI are displayed, focus on the image description input
            imgDescriptionInput.current.focus();
        }
    }, [aiImgDisplay]);

    async function copyGeneratedImg(img) {
        statusController.displayProgress();

        if (ClipboardItem.supports(img.type)) {
            const data = [new ClipboardItem({[img.type]: img})];

            try {
                await navigator.clipboard.write(data);
                statusController.displaySuccess(statusMessages.copiedOk);
            } catch (error) {
                statusController.displayFailure(error.message);
            }
        } else {
            statusController.displayFailure(statusMessages.invalidClipboardDataType);
        }
    }

    async function generateImg() {
        if (!user) {
            statusController.displayFailure(statusMessages.unauthorizedAccess);
            return;
        }

        statusController.displayProgress();
        const textToImgModel = {
            text: getImgDescription
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_AI_SERVER}/text-to-img`, {
                method: "post",
                body: JSON.stringify(textToImgModel),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                setImg(blob);
                setImgGenDisplay("block");
                setImgGenUrl(URL.createObjectURL(blob));
                statusController.displaySuccess(statusMessages.generatedImgOk);
            } else {
                statusController.displayFailure(await response.text());
            }
        } catch (error) {
            statusController.displayFailure(error.message);
        }
    }

    return (
        <div className="ai-img-container sidebar-container" style={{display: aiImgDisplay}}>
            <div className="sidebar-title">Notes AI Image</div>
            <textarea className="text-input img-description" placeholder="Enter the image description here"
                      ref={imgDescriptionInput}
                      onChange={(e) => setImgDescription(e.target.value)}
                      onKeyDown={(e) => {
                          if (e.key === "Enter") {
                              generateImg();
                          }
                      }}>
            </textarea>
            <div className="sidebar-button-container">
                <SidebarActionButton icon="filter_vintage" text="Generate" disabled={getImgDescription === ""}
                                     click={() => {
                                         generateImg();
                                     }}/>
                <SidebarActionButton icon="content_copy" text="Copy" disabled={getImg === null}
                                     click={() => {
                                         copyGeneratedImg(getImg);
                                     }}/>
            </div>
            <Status display={getStatusDisplay}
                    iconClass={getStatusIconClass}
                    messageClass={getStatusMessageClass}
                    icon={getStatusIcon}
                    message={getStatusMessage}/>
            <img src={getImgGenUrl} className="img-gen" alt="Generated image"
                 style={{display: getImgGenDisplay}}/>
        </div>
    );
}

export default AIImage;