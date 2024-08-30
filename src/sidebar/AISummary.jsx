import "./AISummary.scss";
import Status from "../status/Status.jsx";
import {useEffect, useState} from "react";
import StatusController from "../StatusController.js";
import {auth, statusMessages} from "../backend.js";
import {onAuthStateChanged} from "firebase/auth";

function AISummary({editor, triggered}) {
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
        const unsubUser = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => {
            unsubUser();
        };
    }, []);

    useEffect(() => {
        if (triggered) {
            summarize();
        }
    }, [triggered]);

    async function summarize() {
        if (!getUser) {
            statusController.displayFailure(statusMessages.unauthorizedMessage);
            return;
        }

        statusController.displayProgress();
        // API for text selection
        const {view, state} = editor
        const {from, to} = view.state.selection
        const text = state.doc.textBetween(from, to, " ")
        // If there is a selection of text, use that selection, otherwise, use the whole text
        const context = text === "" ? editor.getHTML() : text;
        const summaryModel = {
            text: context
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_AI_SERVER}/summarize`, {
                method: "post",
                body: JSON.stringify(summaryModel),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const summaryText = await response.json();
                setCopyText(summaryText);
                statusController.displaySuccess(statusMessages.generatedSummaryOk);
            } else {
                statusController.displayFailure(await response.text());
            }
        } catch (error) {
            statusController.displayFailure(error.message);
        }
    }

    async function copyText() {
        statusController.displayProgress();

        try {
            await navigator.clipboard.writeText(getCopyText);
            statusController.displaySuccess(statusMessages.copiedOk);
        } catch (error) {
            statusController.displayFailure(error.message);
        }
    }

    return (
        <div className="ai-summary-container">
            <div className="title">Notes Summary</div>
            <div className="instruction">
                Instruction: select a piece of text to provide the context for the summary. If no text is selected,
                the whole document will be provided as the context.
            </div>
            <button className="action-button summarize-button"
                    onClick={() => {
                        summarize();
                    }}>
                Summarize
            </button>
            <button className="action-button copy-button"
                    disabled={getCopyDisabled}
                    onClick={() => {
                        copyText();
                    }}>
                Copy summary
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