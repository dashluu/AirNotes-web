import {BubbleMenu, EditorContent, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {Placeholder} from "@tiptap/extension-placeholder";
import "./Editor.scss";
import NavBar from "../navbar/NavBar.jsx";
import {useEffect, useState} from "react";
import {auth, documentDAO, paths} from "../backend.js";
import {useNavigate} from "react-router-dom";
import AISummaryPopup from "../popup/AISummaryPopup.jsx";
import Status from "../status/Status.jsx";

// define your extension array
const extensions = [
    StarterKit,
    Placeholder.configure({
        placeholder: "Write something...",
    })
]

function Editor({documentId, title, content, date, isNewDocument}) {
    const navigate = useNavigate();
    const [getDocumentId, setDocumentId] = useState(documentId);
    const [getTitle, setTitle] = useState(title);
    const [getContent, setContent] = useState(content);
    const [getDate, setDate] = useState(date);
    const [getUndoDisabled, setUndoDisabled] = useState(true);
    const [getRedoDisabled, setRedoDisabled] = useState(true);
    const [getSaveDisabled, setSaveDisabled] = useState(title === "");
    const [getDeleteDisplay, setDeleteDisplay] = useState(isNewDocument ? "none" : "inline-block");
    const [getDateDisplay, setDateDisplay] = useState(date === "" ? "none" : "flex");
    const [getStatusDisplay, setStatusDisplay] = useState("none");
    const [getStatusIcon, setStatusIcon] = useState("");
    const [getStatusMessage, setStatusMessage] = useState("");
    const [getStatusIconClass, setStatusIconClass] = useState("");
    const [getStatusMessageClass, setStatusMessageClass] = useState("");
    const [getSummaryText, setSummaryText] = useState("");
    const [getSummaryDisplay, setSummaryDisplay] = useState("none");
    const [getDisablePanelDisplay, setDisablePanelDisplay] = useState("none");
    let editor = useEditor({
        extensions,
        onUpdate({editor}) {
            setContent(editor.getHTML());
            setUndoDisabled(!editor.can().undo());
            setRedoDisabled(!editor.can().redo());
        }
    });

    useEffect(() => {
        setDocumentId(documentId);
        setTitle(title);
        setContent(content);
        setDate(date);
    }, [documentId, title, content, date]);

    useEffect(() => {
        if (editor) {
            editor.commands.setContent(getContent);
        }
    }, [editor, getContent]);

    useEffect(() => {
        setDeleteDisplay(getDocumentId === "" ? "none" : "inline-block");
        setDateDisplay(getDate === "" ? "none" : "flex");
    }, [getDate, getDocumentId]);

    useEffect(() => {
        if (getTitle === "") {
            setSaveDisabled(true);
            setStatusMessage("Title cannot be empty");
            setStatusDisplay("inline-flex");
            setStatusIcon("error");
            setStatusIconClass("error-icon");
            setStatusMessageClass("error-message");
        } else {
            setSaveDisabled(false);
            hideStatus();
        }
    }, [getTitle]);

    function displayStatus(statusIconClass, statusMessageClass, statusIcon, statusMessage) {
        setStatusMessage(statusMessage);
        setStatusDisplay("inline-flex");
        setStatusIcon(statusIcon);
        setStatusIconClass(statusIconClass);
        setStatusMessageClass(statusMessageClass);
    }

    function hideStatus() {
        setStatusDisplay("none");
        displayStatus("", "", "", "");
    }

    function displayProgress() {
        displayStatus("pending-icon", "pending-message", "progress_activity", "Processing...");
    }

    function displayFailure(message) {
        displayStatus("error-icon", "error-message", "error", message);
    }

    function displaySuccess(message) {
        displayStatus("valid-icon", "valid-message", "check_circle", message);
    }

    function displayResult(success, message) {
        if (success) {
            displaySuccess(message);
        } else {
            displayFailure(message);
        }
    }

    async function afterSaveDocument() {
        displayProgress();
        await documentDAO.update(getDocumentId, getTitle, getContent)
            .then((result) => {
                displayResult(true, "Saved successfully");
                setDocumentId(result.id);
                setDate(result.date);
            })
            .catch((error) => {
                displayResult(false, error);
            });
    }

    async function afterDeleteDocument() {
        displayProgress();
        await documentDAO.delete(getDocumentId)
            .then(() => {
                hideStatus();
                navigate(paths.home);
            })
            .catch((error) => {
                displayResult(false, error);
            });
    }

    async function summarize() {
        if (auth.currentUser) {
            displayProgress();
            const summaryModel = {
                text: editor.getHTML()
            };

            const response = await fetch("http://localhost:8000/summarize", {
                method: "post",
                body: JSON.stringify(summaryModel),
                headers: {
                    "Content-Type": "application/json"
                },
            });

            if (response.ok) {
                await response.json()
                    .then((summaryText) => {
                        hideStatus();
                        setSummaryText(summaryText);
                        setSummaryDisplay("block");
                        setDisablePanelDisplay("block");
                        editor.commands.blur();
                    })
                    .catch((error) => {
                        displayResult(false, error.message);
                    });
            } else {
                displayResult(false, await response.text());
            }
        } else {
            displayResult(false, "Unauthorized access");
        }
    }

    return (
        <div className="editor-page">
            <NavBar/>
            <div className="disable-panel" style={{display: `${getDisablePanelDisplay}`}}></div>
            <div className="summary-container" style={{display: `${getSummaryDisplay}`}}>
                <AISummaryPopup title="Summary"
                                text={getSummaryText}
                                closePopup={() => {
                                  setSummaryDisplay("none");
                                  setDisablePanelDisplay("none");
                              }}></AISummaryPopup>
            </div>
            <div className="editor-container">
                <div className="document-id-container">{getDocumentId}</div>
                <div className="toolbar">
                    <div className="toolbar-button-container">
                        <button className="toolbar-button new-button"
                                onClick={() => {
                                    navigate(paths.newDocument);
                                }}
                                title="New">
                            <span className="material-symbols-outlined">edit_square</span>
                        </button>
                        <button className="toolbar-button summarize-button"
                                onClick={() => {
                                    summarize();
                                }}
                                title="Summarize All">
                            <span className="material-symbols-outlined">notes</span>
                        </button>
                        <button className="toolbar-button undo-button"
                                onClick={() => editor.chain().focus().undo().run()}
                                disabled={getUndoDisabled}
                                title="Undo">
                            <span className="material-symbols-outlined">undo</span>
                        </button>
                        <button className="toolbar-button redo-button"
                                onClick={() => editor.chain().focus().redo().run()}
                                disabled={getRedoDisabled}
                                title="Redo">
                            <span className="material-symbols-outlined">redo</span>
                        </button>
                        <button className="toolbar-button open-button"
                                title="Open">
                            <span className="material-symbols-outlined">folder_open</span>
                        </button>
                        <button className="toolbar-button save-button" disabled={getSaveDisabled}
                                title="Save"
                                onClick={() => {
                                    afterSaveDocument();
                                }}>
                            <span className="material-symbols-outlined">save</span>
                        </button>
                        <button className="toolbar-button delete-button" style={{display: `${getDeleteDisplay}`}}
                                title="Delete"
                                onClick={() => {
                                    afterDeleteDocument();
                                }}>
                            <span className="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                    <div className="date" style={{display: `${getDateDisplay}`}}>
                        Last modified: {getDate}
                    </div>
                </div>
                <Status display={getStatusDisplay}
                        iconClass={getStatusIconClass}
                        messageClass={getStatusMessageClass}
                        icon={getStatusIcon}
                        message={getStatusMessage}></Status>
                <input type="text" className="title" required placeholder="Enter title..."
                       value={getTitle}
                       onChange={(e) => {
                           setTitle(e.target.value);
                       }}/>

                {editor && <BubbleMenu editor={editor} tippyOptions={{duration: 100}}>
                    <div className="bubble-menu">
                        <button
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            className={editor.isActive("bold") ? "is-active" : ""}
                        >
                            <strong>B</strong>
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            className={`italic-button ${editor.isActive("italic") ? "is-active" : ""}`}
                        >
                            I
                        </button>
                        <button
                            className={`underline-button ${editor.isActive("italic") ? "is-active" : ""}`}
                        >
                            U
                        </button>
                    </div>
                </BubbleMenu>}
                <EditorContent editor={editor}/>
            </div>
        </div>
    );
}

export default Editor;