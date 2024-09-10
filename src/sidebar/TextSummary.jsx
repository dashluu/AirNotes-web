import "./TextSummary.scss";
import Status from "../status/Status.jsx";
import {useEffect, useState} from "react";
import StatusController from "../ui_elements/StatusController.js";
import {statusMessages} from "../backend.js";
import SidebarActionButton from "./SidebarActionButton.jsx";

function TextSummary({user, docId, context, summaryDisplay}) {
    const [getStatusDisplay, setStatusDisplay] = useState("none");
    const [getStatusIconClass, setStatusIconClass] = useState("");
    const [getStatusMessageClass, setStatusMessageClass] = useState("");
    const [getStatusIcon, setStatusIcon] = useState("");
    const [getStatusMessage, setStatusMessage] = useState("");
    const docContext = "document";
    const [getContext, setContext] = useState(context);
    const [getSummary, setSummary] = useState("");
    const statusController = new StatusController(
        setStatusDisplay, setStatusIconClass, setStatusMessageClass, setStatusIcon, setStatusMessage
    );

    useEffect(() => {
        setContext(context);
    }, [context]);

    async function summarize() {
        if (!user) {
            statusController.displayFailure(statusMessages.unauthorizedAccess);
            return;
        }

        statusController.displayProgress();
        const summaryModel = {
            user_id: user.uid,
            doc_id: docId,
            text: getContext
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
                // const summaryText = await response.json();
                // setCopyText(summaryText);
                // statusController.displaySuccess(statusMessages.generatedSummaryOk);
                statusController.displaySuccess(statusMessages.generatingSummary);
                let ans = "";

                for await (const chunk of response.body) {
                    for (const byte of chunk) {
                        ans += String.fromCharCode(byte);
                        setSummary(ans);
                    }
                }

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
            await navigator.clipboard.writeText(getSummary);
            statusController.displaySuccess(statusMessages.copiedOk);
        } catch (error) {
            statusController.displayFailure(error.message);
        }
    }

    return (
        <div className="summary-container sidebar-container" style={{display: summaryDisplay}}>
            <div className="sidebar-title">Notes Summary</div>
            <div className="sidebar-instruction">
                Instruction: select a piece of text to provide the context for the summary. If no text is selected,
                the whole document will be provided as the context.
            </div>
            <div className="summary-context">Context: {getContext}</div>
            <div className="sidebar-button-container">
                <SidebarActionButton icon="notes" text="Summarize"
                                     click={() => {
                                         summarize();
                                     }}/>
                <SidebarActionButton icon="content_copy" text="Copy" disabled={getSummary === ""}
                                     click={() => {
                                         copyText();
                                     }}/>
                <SidebarActionButton icon="playlist_remove" text="Clear context"
                                     disabled={getContext === docContext}
                                     click={() => setContext(docContext)}/>
            </div>
            <Status display={getStatusDisplay}
                    iconClass={getStatusIconClass}
                    messageClass={getStatusMessageClass}
                    icon={getStatusIcon}
                    message={getStatusMessage}/>
            <div className="summary-text">Summary: {getSummary}</div>
        </div>
    );
}

export default TextSummary;