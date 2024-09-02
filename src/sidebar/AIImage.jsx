import "./AIImage.scss";
import Status from "../status/Status.jsx";
import {useEffect, useRef, useState} from "react";
import StatusController from "../ui_elements/StatusController.js";
import {auth, statusMessages} from "../backend.js";
import {onAuthStateChanged} from "firebase/auth";

function AIImage({aiImgDisplay}) {
    const [getUser, setUser] = useState(null);
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
        const unsubUser = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => {
            unsubUser();
        };
    }, []);

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
        if (!getUser) {
            statusController.displayFailure(statusMessages.unauthorizedMessage);
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
            <textarea className="text-input img-description" placeholder="Enter the image description here..."
                      ref={imgDescriptionInput}
                      onChange={(e) => {
                          setImgDescription(e.target.value);
                      }}></textarea>
            <button className="sidebar-action-button"
                    onClick={() => {
                        generateImg();
                    }}>
                Generate image
            </button>
            <button className="sidebar-action-button"
                    disabled={getImgGenUrl === ""}
                    onClick={() => {
                        copyGeneratedImg(getImg);
                    }}>
                Copy image
            </button>
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