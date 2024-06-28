import "./AIQA.scss";
import Status from "../status/Status.jsx";
import {useEffect, useState} from "react";
import StatusController from "../StatusController.js";
import {auth, unauthorizedMessage} from "../backend.js";

function AIQA({editor}) {
    const [getQuestion, setQuestion] = useState("");
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

    async function answerQuestion() {
        if (auth.currentUser) {
            statusController.displayProgress();
            const qaModel = {
                question: getQuestion,
                context: editor.getHTML()
            };

            const response = await fetch(`${import.meta.env.VITE_AI_SERVER}/qa`, {
                method: "post",
                body: JSON.stringify(qaModel),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                await response.json()
                    .then((answer) => {
                        setCopyText(answer);
                        statusController.displayResult(true, "Answer generated");
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

    async function copyText() {
        await navigator.clipboard.writeText(getCopyText)
            .then(() => {
                statusController.displaySuccess("Copied successfully");
            })
            .catch((error) => {
                statusController.displayFailure(error.message);
            });
    }

    return (
        <div className="ai-qa-container">
            <div className="title">Notes Q&A</div>
            <textarea className="question" placeholder="Enter the question here..."
                      onChange={(e) => {
                          setQuestion(e.target.value);
                      }}></textarea>
            <button className="action-button qa-button"
                    onClick={() => {
                        answerQuestion();
                    }}>
                Answer question
            </button>
            <button className="action-button copy-button"
                    disabled={getCopyDisabled}
                    onClick={() => {
                        copyText();
                    }}>
                Copy
            </button>
            <Status display={getStatusDisplay}
                    iconClass={getStatusIconClass}
                    messageClass={getStatusMessageClass}
                    icon={getStatusIcon}
                    message={getStatusMessage}/>
            <div className="qa-text">Answer: {getCopyText}</div>
        </div>
    );
}

export default AIQA;