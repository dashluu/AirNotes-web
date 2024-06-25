import "./AISummary.scss";
import Status from "../status/Status.jsx";
import {useEffect, useState} from "react";
import StatusController from "../StatusController.js";
import {auth} from "../backend.js";

function AISummary({editorContent}) {
    const [getStatusDisplay, setStatusDisplay] = useState("none");
    const [getStatusIconClass, setStatusIconClass] = useState("");
    const [getStatusMessageClass, setStatusMessageClass] = useState("");
    const [getStatusIcon, setStatusIcon] = useState("");
    const [getStatusMessage, setStatusMessage] = useState("");
    const [getCopyDisabled, setCopyDisabled] = useState(true);
    const [getCopyText, setCopyText] = useState("");
    const statusController = new StatusController(
        setStatusDisplay, setStatusIconClass, setStatusMessageClass, setStatusIcon, setStatusMessage
    );

    useEffect(() => {
        setCopyDisabled(getCopyText === "");
    }, [getCopyText]);

    async function summarize() {
        if (auth.currentUser) {
            statusController.displayProgress();
            const summaryModel = {
                text: editorContent
            };

            const response = await fetch("http://localhost:8000/summarize", {
                method: "post",
                body: JSON.stringify(summaryModel),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                await response.json()
                    .then((summaryText) => {
                        setCopyText(summaryText);
                        statusController.displayResult(true, "Summary loaded");
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

    async function copySummaryText() {
        await navigator.clipboard.writeText(getCopyText)
            .then(() => {
                statusController.displaySuccess("Copied successfully");
            })
            .catch((error) => {
                statusController.displayFailure(error.message);
            });
    }

    return (
        <div className="ai-summary-container">
            <div className="title">Note summary</div>
            <button className="action-button summarize-button"
                    onClick={() => {
                        summarize();
                    }}>
                Summarize
            </button>
            <button className="action-button copy-button"
                    disabled={getCopyDisabled}
                    onClick={() => {
                        copySummaryText();
                    }}>
                Copy
            </button>
            <Status display={getStatusDisplay}
                    iconClass={getStatusIconClass}
                    messageClass={getStatusMessageClass}
                    icon={getStatusIcon}
                    message={getStatusMessage}/>
            <div className="summary-text">{getCopyText}</div>
        </div>
    );
}

export default AISummary;