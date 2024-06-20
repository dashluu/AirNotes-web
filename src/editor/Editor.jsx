import {EditorContent, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {Placeholder} from "@tiptap/extension-placeholder";
import "./Editor.scss";
import NavBar from "../navbar/NavBar.jsx";
import {useEffect, useState} from "react";
import {documentDAO} from "../firebase.js";
import {useLocation, useNavigate} from "react-router-dom";

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
    let editor = useEditor({
        extensions,
        content,
        onUpdate({editor}) {
            setContent(editor.getHTML());
            setUndoDisabled(!editor.can().undo());
            setRedoDisabled(!editor.can().redo());
        }
    });

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
            setStatusMessage("");
            setStatusDisplay("none");
            setStatusIcon("");
            setStatusIconClass("");
            setStatusMessageClass("");
        }
    }, [getTitle]);

    async function afterSaveDocument() {
        await documentDAO.update(getDocumentId, getTitle, getContent)
            .then((result) => {
                showMessage(true, "Save successfully");
                setDocumentId(result.id);
                setDate(result.date);
            })
            .catch((error) => {
                showMessage(false, error);
            });
    }

    async function afterDeleteDocument() {
        await documentDAO.delete(getDocumentId)
            .then(() => {
                navigate("/");
            })
            .catch((error) => {
                showMessage(false, error);
            });
    }

    function showMessage(success, message) {
        setStatusMessage(message);
        setStatusDisplay("inline-flex");

        if (!success) {
            setStatusIcon("error");
            setStatusIconClass("error-icon");
            setStatusMessageClass("error-message");
        } else {
            setStatusIcon("check_circle");
            setStatusIconClass("valid-icon");
            setStatusMessageClass("valid-message");
        }
    }

    return (
        <div className="editor-page">
            <NavBar/>
            <div className="editor-container">
                <div className="document-id-container">{getDocumentId}</div>
                <div className="toolbar">
                    <button className="toolbar-button new-button"
                            onClick={() => navigate("/new")}
                            title="New">
                        <span className="material-symbols-outlined">edit_square</span>
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
                    <div className="date" style={{display: `${getDateDisplay}`}}>
                        Last modified: {getDate}
                    </div>
                </div>
                <div className="status-container" style={{display: `${getStatusDisplay}`}}>
                    <span className={`material-symbols-outlined ${getStatusIconClass}`}>
                        {getStatusIcon}
                    </span>
                    <span className={`${getStatusMessageClass}`}>
                        {getStatusMessage}
                    </span>
                </div>
                <input type="text" className="title" required placeholder="Enter title..."
                       value={getTitle}
                       onChange={(e) => {
                           setTitle(e.target.value);
                       }}/>
                <EditorContent editor={editor}/>
            </div>
        </div>
    );
}

export default Editor;