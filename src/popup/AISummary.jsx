import "./AISummary.scss";
import Status from "../status/Status.jsx";
import {useEffect, useState} from "react";

function AISummary({text}) {
    const [getCopyStatusDisplay, setCopyStatusDisplay] = useState(true);
    const [getCopyStatusIconClass, setCopyStatusIconClass] = useState("pending-icon");
    const [getCopyStatusMessageClass, setCopyStatusMessageClass] = useState("pending-message");
    const [getCopyStatusIcon, setCopyStatusIcon] = useState("progress_activity");
    const [getCopyStatusMessage, setCopyStatusMessage] = useState("Processing...");
    const [getText, setText] = useState(text);
    const [getCopyDisabled, setCopyDisabled] = useState(true);

    useEffect(() => {
        setText(text);
        setCopyDisabled(text === "");
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
        <div className="ai-summary-container">
            <div className="title">Summary</div>
            <Status display={getCopyStatusDisplay}
                    iconClass={getCopyStatusIconClass}
                    messageClass={getCopyStatusMessageClass}
                    icon={getCopyStatusIcon}
                    message={getCopyStatusMessage}/>
            <button className="copy-button"
                    disabled={getCopyDisabled}
                    onClick={() => {
                        copySummaryText();
                    }}>Copy
            </button>
            <div className="summary-text">{text}</div>
        </div>
    );
}

export default AISummary;