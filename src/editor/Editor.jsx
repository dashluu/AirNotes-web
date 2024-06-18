import {EditorContent, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {Placeholder} from "@tiptap/extension-placeholder";
import "./Editor.scss";
import NavBar from "../navbar/NavBar.jsx";
import {useEffect, useRef, useState} from "react";
import DocumentDAO from "./DocumentDAO.jsx";
import {useNavigate} from "react-router-dom";

// define your extension array
const extensions = [
    StarterKit,
    History,
    Placeholder.configure({
        placeholder: "Write something...",
    })
]

function Editor({documentId, title, content, date, isNewDocument}) {
    const navigate = useNavigate();
    const pageBackground = useRef(null);
    const [getDocumentId, setDocumentId] = useState(documentId);
    const [getTitle, setTitle] = useState(title);
    const [getContent, setContent] = useState(content);
    const [getDate, setDate] = useState(getDateStr(date));
    const [getSaveDisabled, setSaveDisabled] = useState(title === "");
    const [getDeleteDisplay, setDeleteDisplay] = useState(isNewDocument ? "none" : "inline-block");
    const [getDateDisplay, setDateDisplay] = useState(date === "" ? "none" : "flex");
    const [getStatusDisplay, setStatusDisplay] = useState("none");
    const [getStatusIcon, setStatusIcon] = useState("");
    const [getStatusMessage, setStatusMessage] = useState("");
    const [getStatusIconClass, setStatusIconClass] = useState("");
    const [getStatusMessageClass, setStatusMessageClass] = useState("");
    const documentDAO = new DocumentDAO();
    const editor = useEditor({
        extensions,
        getContent,
        onUpdate({editor}) {
            setContent(editor.getHTML());
        }
    });

    useEffect(() => {
        if (pageBackground.current) {
            if (window.scrollY < pageBackground.current.offsetTop) {
                pageBackground.current.classList.remove("page-background-sticky");
            } else {
                pageBackground.current.classList.add("page-background-sticky");
            }
        }

        setDeleteDisplay(getDocumentId === "" ? "none" : "inline-block");
        setDateDisplay(getDate === "" ? "none" : "flex");

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
    }, [getDocumentId, getTitle]);

    if (!editor) {
        return null;
    }

    function getDateStr(dateObj) {
        return dateObj ? dateObj.toLocaleDateString() : "";
    }

    async function afterSaveDocument() {
        await documentDAO.update(getDocumentId, getTitle, getContent)
            .then((result) => {
                showMessage(true, "Save successfully.");
                setDocumentId(result[0]);
                setDate(getDateStr(result[1].toDate()));
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
            <div className="page-background" ref={pageBackground}></div>
            <div className="editor-container">
                <div className="document-id-container">{getDocumentId}</div>
                <div className="toolbar">
                    <button className="toolbar-button undo-button"
                            onClick={() => editor.chain().focus().undo().run()}
                            disabled={!editor.can().undo()}
                            title="Undo">
                        <span className="material-symbols-outlined">undo</span>
                    </button>
                    <button className="toolbar-button redo-button"
                            onClick={() => editor.chain().focus().redo().run()}
                            disabled={!editor.can().redo()}
                            title="Redo">
                        <span className="material-symbols-outlined">redo</span>
                    </button>
                    <button className="toolbar-button open-button"
                            title="Open">
                        <span className="material-symbols-outlined">folder_open</span>
                    </button>
                    <button className="toolbar-button save-button" disabled={getSaveDisabled}
                            title="Save"
                            onClick={afterSaveDocument}>
                        <span className="material-symbols-outlined">save</span>
                    </button>
                    <button className="toolbar-button delete-button" style={{display: `${getDeleteDisplay}`}}
                            title="Delete"
                            onClick={afterDeleteDocument}>
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
                <EditorContent editor={editor}></EditorContent>
            </div>
        </div>
    );
}

export default Editor;