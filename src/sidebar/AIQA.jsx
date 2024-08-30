import "./AIQA.scss";
import Status from "../status/Status.jsx";
import {useEffect, useRef, useState} from "react";
import StatusController from "../StatusController.js";
import {auth, statusMessages} from "../backend.js";
import {onAuthStateChanged} from "firebase/auth";

function AIQA({editor, sidebarDisplay, qaDisplay}) {
    const [getUser, setUser] = useState(null);
    const [getQuestion, setQuestion] = useState("");
    const questionInput = useRef(null);
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
        // Disable the copy button if there is no text to be copied
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
        if (sidebarDisplay !== "hidden" && qaDisplay !== "none") {
            // If the sidebar and QA UI are displayed, focus on the question input
            questionInput.current.focus();
        }
    }, [sidebarDisplay, qaDisplay]);

    async function answerQuestion() {
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
        const qaModel = {
            query: getQuestion,
            context: context
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
            <div className="instruction">
                Instruction: select a piece of text to provide the context for the question. If no text is selected,
                the whole document will be provided as the context.
            </div>
            <textarea className="question" placeholder="Enter the question here..." ref={questionInput}
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