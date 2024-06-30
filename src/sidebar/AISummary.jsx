import "./AISummary.scss";
import Status from "../status/Status.jsx";
import {useEffect, useState} from "react";
import StatusController from "../StatusController.js";
import {auth, statusMessages} from "../backend.js";
import {onAuthStateChanged} from "firebase/auth";

function AISummary({editor}) {
    const [getUser, setUser] = useState(null);
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

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    async function summarize() {
        if (!getUser) {
            statusController.displayResult(false, statusMessages.unauthorizedMessage);
            return;
        }

        statusController.displayProgress();
        const summaryModel = {
            text: editor.getHTML()
        };

        const response = await fetch(`${import.meta.env.VITE_AI_SERVER}/summarize`, {
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
                    statusController.displayResult(true, statusMessages.generatedSummaryOk);
                })
                .catch((error) => {
                    statusController.displayResult(false, error.message);
                });
        } else {
            statusController.displayResult(false, await response.text());
        }
    }

    async function copyText() {
        await navigator.clipboard.writeText(getCopyText)
            .then(() => {
                statusController.displaySuccess(statusMessages.copiedOk);
            })
            .catch((error) => {
                statusController.displayFailure(error.message);
            });
    }

    return (
        <div className="ai-summary-container">
            <div className="title">Notes Summary</div>
            <button className="action-button summarize-button"
                    onClick={() => {
                        summarize();
                    }}>
                Summarize text
            </button>
            <button className="action-button copy-button"
                    disabled={getCopyDisabled}
                    onClick={() => {
                        copyText();
                    }}>
                Copy text
            </button>
            <Status display={getStatusDisplay}
                    iconClass={getStatusIconClass}
                    messageClass={getStatusMessageClass}
                    icon={getStatusIcon}
                    message={getStatusMessage}/>
            <div className="summary-text">Summary: {getCopyText}</div>
        </div>
    );
}

export default AISummary;