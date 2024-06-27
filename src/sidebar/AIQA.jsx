import "./AIQA.scss";
import Status from "../status/Status.jsx";
import {useEffect, useState} from "react";
import StatusController from "../StatusController.js";
import {auth} from "../backend.js";

function AIQA({editorContent}) {
    const [getQuestion, setQuestion] = useState("");
    const [getContext, setContext] = useState(editorContent);
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
        setContext(editorContent);
    }, [editorContent]);

    useEffect(() => {
        setCopyDisabled(getCopyText === "");
    }, [getCopyText]);

    async function answerQuestion() {
        if (auth.currentUser) {
            statusController.displayProgress();
            const qaModel = {
                question: getQuestion,
                context: getContext
            };

            const response = await fetch("http://localhost:8000/qa", {
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
            statusController.displayResult(false, "Unauthorized access");
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