import "./AIQA.scss";
import Status from "../status/Status.jsx";
import {useEffect, useState} from "react";
import StatusController from "../StatusController.js";
import {auth, statusMessages} from "../backend.js";
import {onAuthStateChanged} from "firebase/auth";

function AIQA({editor}) {
    const [getUser, setUser] = useState(null);
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

    useEffect(() => {
        const unsubUser = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => {
            unsubUser();
        };
    }, []);

    async function answerQuestion() {
        if (!getUser) {
            statusController.displayFailure(statusMessages.unauthorizedMessage);
            return;
        }

        statusController.displayProgress();
        const qaModel = {
            query: getQuestion,
            context: editor.getHTML()
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_AI_SERVER}/qa`, {
                method: "post",
                body: JSON.stringify(qaModel),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                statusController.displaySuccess(statusMessages.generatedAnswerOk);
                let ans = "";

                for await (const chunk of response.body) {
                    for (const byte of chunk) {
                        ans += String.fromCharCode(byte);
                        setCopyText(ans);
                    }
                }
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
                Copy answer
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