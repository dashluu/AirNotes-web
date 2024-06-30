import "./Editor.scss";
import {EditorContent, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {Placeholder} from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import {auth, docDAO, statusMessages, paths} from "../backend.js";
import Status from "../status/Status.jsx";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import StatusController from "../StatusController.js";
import BubbleMenuWrapper from "./BubbleMenuWrapper.jsx";
import FloatingMenuWrapper from "./FloatingMenuWrapper.jsx";
import {Image} from "@tiptap/extension-image";
import {FileHandler} from "@tiptap-pro/extension-file-handler";
import {onAuthStateChanged} from "firebase/auth";
import FileDAO from "../daos/FileDAO.js";
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

function Editor({
                    docId,
                    thumbnail,
                    title,
                    content,
                    isNewDoc,
                    openSidebar,
                    setEditor,
                    setOpenNoteDisplay,
                    setSummaryDisplay,
                    setQADisplay,
                    setImgToolsDisplay,
                    setAIImgDisplay
                }) {
    const navigate = useNavigate();
    const fileDAO = new FileDAO();
    const [getUser, setUser] = useState(null);
    const [getDocId, setDocId] = useState(docId);
    const [getThumbnail, setThumbnail] = useState(thumbnail);
    const [getTitle, setTitle] = useState(title);
    const [getLoadInitialContent, setLoadInitialContent] = useState(true);
    const [getContent, setContent] = useState(content);
    const [getUndoDisabled, setUndoDisabled] = useState(true);
    const [getRedoDisabled, setRedoDisabled] = useState(true);
    const [getSaveDisabled, setSaveDisabled] = useState(title === "");
    const [getDeleteDisplay, setDeleteDisplay] = useState(isNewDoc ? "none" : "inline-block");
    const [getStatusDisplay, setStatusDisplay] = useState("none");
    const [getStatusIcon, setStatusIcon] = useState("");
    const [getStatusMessage, setStatusMessage] = useState("");
    const [getStatusIconClass, setStatusIconClass] = useState("");
    const [getStatusMessageClass, setStatusMessageClass] = useState("");
    const statusController = new StatusController(
        setStatusDisplay, setStatusIconClass, setStatusMessageClass, setStatusIcon, setStatusMessage
    );

    // define your extension array
    const extensions = [
        StarterKit,
        Placeholder.configure({
            placeholder: "Write something...",
        }),
        Underline,
        Image.configure({
            HTMLAttributes: {
                class: "img"
            },
        }),
        FileHandler.configure({
            allowedMimeTypes: FileDAO.extensions,
            onPaste: pasteFile,
            onDrop: dropFile
        })
        // CodeBlockLowlight.configure({
        //     lowlight,
        // }),
    ];

    let editor = useEditor({
            extensions,
            onUpdate({editor}) {
                setContent(editor.getHTML());
                setUndoDisabled(!editor.can().undo());
                setRedoDisabled(!editor.can().redo());
            }
        })
    ;

    useEffect(() => {
        const unsubUser = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => {
            unsubUser();
        };
    }, []);

    useEffect(() => {
        setEditor(editor);
    }, [editor]);

    useEffect(() => {
        setDocId(docId);
    }, [docId]);

    useEffect(() => {
        setThumbnail(thumbnail);
    }, [thumbnail]);

    useEffect(() => {
        setTitle(title);
    }, [title]);

    useEffect(() => {
        if (editor && getLoadInitialContent) {
            editor.commands.setContent(content);
            setContent(content);
            setLoadInitialContent(false);
        }
    }, [content]);

    useEffect(() => {
        setDeleteDisplay(getDocId === "" ? "none" : "inline-block");
    }, [getDocId]);

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

    async function addFileToEditor(editor, file, pos) {
        const reader = new FileReader();
        const extension = file.name.split(".").pop();

        await fileDAO.uploadFile(file, extension)
            .then((url) => {
                reader.readAsDataURL(file);
                reader.onload = () => {
                    editor.chain().insertContentAt(pos, {
                        type: "image",
                        attrs: {
                            src: url,
                        },
                    }).focus().run();
                };
            })
            .catch((error) => {
                statusController.displayResult(false, error.message);
            });
    }

    async function dropPasteFile(editor, fileList, pos) {
        Array.from(fileList).forEach(file => {
            addFileToEditor(editor, file, pos);
        });
    }

    function pasteFile(editor, fileList, htmlContent) {
        if (htmlContent) {
            return false;
        }

        dropPasteFile(editor, fileList, editor.state.selection.anchor);
    }

    function dropFile(editor, fileList, pos) {
        dropPasteFile(editor, fileList, pos);
    }

    async function afterSaveDoc() {
        if (getUser) {
            statusController.displayProgress();
            await docDAO.update(getUser.uid, getDocId, getThumbnail, getTitle, getContent)
                .then((result) => {
                    statusController.displayResult(true, statusMessages.savedOk);
                    setDocId(result.id);
                })
                .catch((error) => {
                    statusController.displayResult(false, error);
                });
        } else {
            statusController.displayResult(false, statusMessages.unauthorizedMessage);
        }
    }

    async function afterDeleteDoc() {
        if (getUser) {
            statusController.displayProgress();
            await docDAO.delete(getDocId)
                .then(() => {
                    statusController.hideStatus();
                    navigate(paths.home);
                })
                .catch((error) => {
                    statusController.displayResult(false, error);
                });
        } else {
            statusController.displayResult(false, statusMessages.unauthorizedMessage);
        }
    }

    return (
        <div className="editor-container">
            <div className="doc-id-container">{getDocId}</div>
            <div className="editor-toolbar">
                <button className="editor-toolbar-button new-button"
                        onClick={() => {
                            navigate(paths.newDoc);
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
                        onClick={() => {
                            openSidebar();
                            setOpenNoteDisplay("block");
                            setSummaryDisplay("none");
                            setQADisplay("none");
                            setImgToolsDisplay("none");
                            setAIImgDisplay("none");
                        }}
                        title="Open">
                    <span className="material-symbols-outlined">folder_open</span>
                </button>
                <button className="editor-toolbar-button summarize-button"
                        onClick={() => {
                            openSidebar();
                            setSummaryDisplay("block");
                            setOpenNoteDisplay("none");
                            setQADisplay("none");
                            setImgToolsDisplay("none");
                            setAIImgDisplay("none");
                        }}
                        title="Summarize">
                    <span className="material-symbols-outlined">notes</span>
                </button>
                <button className="editor-toolbar-button qa-button"
                        onClick={() => {
                            openSidebar();
                            setQADisplay("block");
                            setOpenNoteDisplay("none");
                            setSummaryDisplay("none");
                            setImgToolsDisplay("none");
                            setAIImgDisplay("none");
                        }}
                        title="Q&A">
                    <span className="material-symbols-outlined">quiz</span>
                </button>
                <button className="editor-toolbar-button img-tools-button"
                        onClick={() => {
                            openSidebar();
                            setImgToolsDisplay("block");
                            setOpenNoteDisplay("none");
                            setSummaryDisplay("none");
                            setQADisplay("none");
                            setAIImgDisplay("none");
                        }}
                        title="Image Tools">
                    <span className="material-symbols-outlined">image</span>
                </button>
                <button className="editor-toolbar-button ai-img-button"
                        onClick={() => {
                            openSidebar();
                            setAIImgDisplay("block");
                            setOpenNoteDisplay("none");
                            setSummaryDisplay("none");
                            setQADisplay("none");
                            setImgToolsDisplay("none");
                        }}
                        title="AI Image">
                    <span className="material-symbols-outlined">brush</span>
                </button>
                <button className="editor-toolbar-button save-button" disabled={getSaveDisabled}
                        title="Save"
                        onClick={() => {
                            afterSaveDoc();
                        }}>
                    <span className="material-symbols-outlined">save</span>
                </button>
                <button className="editor-toolbar-button delete-button"
                        style={{display: `${getDeleteDisplay}`}}
                        title="Delete"
                        onClick={() => {
                            afterDeleteDoc();
                        }}>
                    <span className="material-symbols-outlined">delete</span>
                </button>
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