import "./AISummaryPopup.scss";
import {useEffect, useState} from "react";
import Status from "../status/Status.jsx";

function AISummaryPopup({title, text, closePopup}) {
    const [getCopyStatusDisplay, setCopyStatusDisplay] = useState(false);
    const [getCopyStatusIconClass, setCopyStatusIconClass] = useState("");
    const [getCopyStatusMessageClass, setCopyStatusMessageClass] = useState("");
    const [getCopyStatusIcon, setCopyStatusIcon] = useState("");
    const [getCopyStatusMessage, setCopyStatusMessage] = useState("");
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
                setCopyStatusMessage("Copied successfully");
            })
            .catch(() => {
                setCopyStatusDisplay(true);
                setCopyStatusIconClass("error-icon");
                setCopyStatusMessageClass("error-message");
                setCopyStatusIcon("error");
                setCopyStatusMessage("Failed to copy");
            });
    }

    return (
        <div className="ai-summary-popup">
            <div className="ai-summary-container">
                <div className="title">{title}</div>
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

export default AISummaryPopup;