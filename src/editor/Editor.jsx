import "./Editor.scss";
import {EditorContent, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {Placeholder} from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import {documentDAO, paths} from "../backend.js";
import Status from "../status/Status.jsx";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import StatusController from "../StatusController.js";
import BubbleMenuWrapper from "./BubbleMenuWrapper.jsx";
import FloatingMenuWrapper from "./FloatingMenuWrapper.jsx";
import Image from '@tiptap/extension-image'
// import css from "highlight.js/lib/languages/css";
// import js from "highlight.js/lib/languages/javascript";
// import ts from "highlight.js/lib/languages/typescript";
// import html from "highlight.js/lib/languages/xml";
// import python from "highlight.js/lib/languages/python";
// import cpp from "highlight.js/lib/languages/cpp";
// import java from "highlight.js/lib/languages/java";
// import {common, createLowlight} from "lowlight";
// import {CodeBlockLowlight} from "@tiptap/extension-code-block-lowlight";
//
// const lowlight = createLowlight(common);
// lowlight.register({html});
// lowlight.register({css});
// lowlight.register({js});
// lowlight.register({ts});
// lowlight.register({python});
// lowlight.register({cpp});
// lowlight.register({java});

// define your extension array
const extensions = [
    StarterKit,
    Placeholder.configure({
        placeholder: "Write something...",
    }),
    Underline,
    Image,
    // CodeBlockLowlight.configure({
    //     lowlight,
    // }),
];

function Editor({
                    documentId,
                    title,
                    getContent,
                    setContent,
                    date,
                    isNewDocument,
                    marginLeft,
                    marginRight,
                    openSidebar,
                    setSummaryDisplay,
                    setQADisplay,
                    setImageToolsDisplay
                }) {
    const navigate = useNavigate();
    const [getDocumentId, setDocumentId] = useState(documentId);
    const [getTitle, setTitle] = useState(title);
    const [getLoadInitialContent, setLoadInitialContent] = useState(true);
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
    const statusController = new StatusController(
        setStatusDisplay, setStatusIconClass, setStatusMessageClass, setStatusIcon, setStatusMessage
    );
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
        setDate(date);
    }, [documentId, title, date]);

    useEffect(() => {
        if (editor && getLoadInitialContent) {
            editor.commands.setContent(getContent);
            setLoadInitialContent(false);
        }
    }, [getContent]);

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
            statusController.hideStatus();
        }
    }, [getTitle]);

    async function afterSaveDocument() {
        statusController.displayProgress();
        await documentDAO.update(getDocumentId, getTitle, getContent)
            .then((result) => {
                statusController.displayResult(true, "Saved successfully");
                setDocumentId(result.id);
                setDate(result.date);
            })
            .catch((error) => {
                statusController.displayResult(false, error);
            });
    }

    async function afterDeleteDocument() {
        statusController.displayProgress();
        await documentDAO.delete(getDocumentId)
            .then(() => {
                statusController.hideStatus();
                navigate(paths.home);
            })
            .catch((error) => {
                statusController.displayResult(false, error);
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
                    <button className="editor-toolbar-button summarize-button"
                            onClick={() => {
                                openSidebar();
                                setSummaryDisplay("block");
                                setQADisplay("none");
                                setImageToolsDisplay("none");
                            }}
                            title="Summarize">
                        <span className="material-symbols-outlined">notes</span>
                    </button>
                    <button className="editor-toolbar-button qa-button"
                            onClick={() => {
                                openSidebar();
                                setQADisplay("block");
                                setSummaryDisplay("none");
                                setImageToolsDisplay("none");
                            }}
                            title="Q&A">
                        <span className="material-symbols-outlined">quiz</span>
                    </button>
                    <button className="editor-toolbar-button image-tools-button"
                            onClick={() => {
                                openSidebar();
                                setImageToolsDisplay("block");
                                setSummaryDisplay("none");
                                setQADisplay("none");
                            }}
                            title="Image">
                        <span className="material-symbols-outlined">image</span>
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
                {/*<div className="date" style={{display: `${getDateDisplay}`}}>*/}
                {/*    Last modified: {getDate}*/}
                {/*</div>*/}
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
            {editor && <BubbleMenuWrapper editor={editor}/>}
            {editor && <FloatingMenuWrapper editor={editor}/>}
            <EditorContent editor={editor}/>
        </div>
    );
}

export default Editor;