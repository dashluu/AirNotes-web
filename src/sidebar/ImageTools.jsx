import "./ImageTools.scss";
import {useState} from "react";
import {auth, imgStorage} from "../backend.js";
import StatusController from "../StatusController.js";
import Status from "../status/Status.jsx";
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {v4 as uuidv4} from "uuid";

function ImageTools({editor}) {
    const [getImg, setImg] = useState(null);
    const [getImgUrl, setImgUrl] = useState("");
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

    function addImgByUrl(url) {
        editor.chain().focus().setImage({src: url}).run();
    }

    async function uploadGeneratedImg(img) {
        const imgId = uuidv4();
        const imgRef = ref(imgStorage, `images/${imgId}.jpg`);

        await uploadBytes(imgRef, img)
            .then(async () => {
                await getDownloadURL(imgRef)
                    .then((url) => {
                        editor.chain().focus().setImage({src: url}).run();
                        statusController.displayResult(true, "Image uploaded");
                    })
                    .catch((error) => {
                        statusController.displayResult(false, error.message);
                    });
            })
            .catch((error) => {
                statusController.displayResult(false, error.message);
            });
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
            statusController.displayResult(false, "Unauthorized access");
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
                Generate image
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

export default ImageTools;