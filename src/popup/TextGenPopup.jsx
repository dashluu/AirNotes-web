import "./TextGenPopup.scss";
import {useEffect, useState} from "react";
import Status from "../status/Status.jsx";

function TextGenPopup({text, closePopup}) {
    const [getCopyStatusDisplay, setCopyStatusDisplay] = useState(true);
    const [getCopyStatusIconClass, setCopyStatusIconClass] = useState("valid-icon");
    const [getCopyStatusMessageClass, setCopyStatusMessageClass] = useState("valid-message");
    const [getCopyStatusIcon, setCopyStatusIcon] = useState("check_circle");
    const [getCopyStatusMessage, setCopyStatusMessage] = useState("Copied successfully.");
    const [getText, setText] = useState(text);

    useEffect(() => {
        setText(text);
    }, [text]);

    async function copySummaryText() {
        await navigator.clipboard.writeText(getText)
            .then(() => {
                setCopyStatusDisplay(true);
                setCopyStatusIconClass("valid-icon");
                setCopyStatusMessageClass("valid-message");
                setCopyStatusIcon("check_circle");
                setCopyStatusMessage("Copied successfully.");
            })
            .catch((error) => {
                setCopyStatusDisplay(true);
                setCopyStatusIconClass("error-icon");
                setCopyStatusMessageClass("error-message");
                setCopyStatusIcon("error");
                setCopyStatusMessage(`${error.message}`);
            });
    }

    return (
        <div className="text-gen-popup">
            <div className="text-gen-container">
                <div className="text-container">{text}</div>
                <div className="action-bar">
                    <Status display={getCopyStatusDisplay}
                            iconClass={getCopyStatusIconClass}
                            messageClass={getCopyStatusMessageClass}
                            icon={getCopyStatusIcon}
                            message={getCopyStatusMessage}></Status>
                    <div className="action-container">
                        <button className="action-button copy-button"
                                onClick={() => {
                                    copySummaryText();
                                }}>
                            Copy
                        </button>
                        <button className="action-button close-button"
                                onClick={() => {
                                    closePopup();
                                }}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TextGenPopup;