import "./Editor.scss";
import {BubbleMenu, EditorContent, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {Placeholder} from "@tiptap/extension-placeholder";
import {documentDAO, paths} from "../backend.js";
import Status from "../status/Status.jsx";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

// define your extension array
const extensions = [
    StarterKit,
    Placeholder.configure({
        placeholder: "Write something...",
    })
];

function Editor({documentId, title, content, date, isNewDocument, marginLeft, marginRight, openSidebar}) {
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

    return (
        <div className="editor-container"
             style={{marginLeft: marginLeft, marginRight: marginRight}}>
            <div className="document-id-container">{getDocumentId}</div>
            <div className="editor-toolbar">
                <div className="editor-toolbar-button-container">
                    <button className="editor-toolbar-button new-button"
                            onClick={() => {
                                navigate(paths.newDocument);
                            }}
                            title="New">
                        <span className="material-symbols-outlined">edit_square</span>
                    </button>
                    <button className="editor-toolbar-button summarize-button"
                            onClick={() => {
                                openSidebar();
                            }}
                            title="AI Features">
                        <span className="material-symbols-outlined">star</span>
                    </button>
                    <button className="editor-toolbar-button undo-button"
                            onClick={() => editor.chain().focus().undo().run()}
                            disabled={getUndoDisabled}
                            title="Undo">
                        <span className="material-symbols-outlined">undo</span>
                    </button>
                    <button className="editor-toolbar-button redo-button"
                            onClick={() => editor.chain().focus().redo().run()}
                            disabled={getRedoDisabled}
                            title="Redo">
                        <span className="material-symbols-outlined">redo</span>
                    </button>
                    <button className="editor-toolbar-button open-button"
                            title="Open">
                        <span className="material-symbols-outlined">folder_open</span>
                    </button>
                    <button className="editor-toolbar-button save-button" disabled={getSaveDisabled}
                            title="Save"
                            onClick={() => {
                                afterSaveDocument();
                            }}>
                        <span className="material-symbols-outlined">save</span>
                    </button>
                    <button className="editor-toolbar-button delete-button"
                            style={{display: `${getDeleteDisplay}`}}
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
                    message={getStatusMessage}/>
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
    );
}

export default Editor;