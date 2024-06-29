import "./AIImage.scss";
import Status from "../status/Status.jsx";
import {useState} from "react";
import StatusController from "../StatusController.js";
import {auth, unauthorizedMessage} from "../backend.js";
import FileUploader from "../editor/FileUploader.js";

function AIImage({editor}) {
    const [getImg, setImg] = useState(null);
    const [getImgDescription, setImgDescription] = useState("");
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

    async function uploadGeneratedImg(img) {
        if (auth.currentUser) {
            statusController.displayProgress();
            await FileUploader.uploadFile(img, "png")
                .then((url) => {
                    editor.chain().focus().setImage({src: url}).run();
                    statusController.displayResult(true, "Image uploaded");
                })
                .catch((error) => {
                    statusController.displayResult(false, error.message);
                });
        } else {
            statusController.displayResult(false, unauthorizedMessage);
        }
    }

    async function generateImg() {
        if (auth.currentUser) {
            statusController.displayProgress();
            const textToImgModel = {
                text: getImgDescription
            };

            const response = await fetch(`${import.meta.env.VITE_AI_SERVER}/text-to-img`, {
                method: "post",
                body: JSON.stringify(textToImgModel),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                await response.blob()
                    .then(async (blob) => {
                        setImg(blob);
                        setImgGenDisplay("block");
                        setImgGenUrl(URL.createObjectURL(blob));
                        statusController.displayResult(true, "Image generated");
                    })
                    .catch((error) => {
                        statusController.displayResult(false, error.message);
                    });
            } else {
                statusController.displayResult(false, await response.text());
            }
        } else {
            statusController.displayResult(false, unauthorizedMessage);
        }
    }

    return (
        <div className="ai-img-container">
            <div className="title">Notes AI Image</div>
            <textarea className="img-description" placeholder="Enter the image description here..."
                      onChange={(e) => {
                          setImgDescription(e.target.value);
                      }}></textarea>
            <button className="action-button text-to-img-button"
                    onClick={() => {
                        generateImg();
                    }}>
                Generate image
            </button>
            <button className="action-button add-generated-img-button"
                    onClick={() => {
                        uploadGeneratedImg(getImg);
                    }}>
                Add image
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