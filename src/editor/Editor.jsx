import {EditorContent, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {Placeholder} from "@tiptap/extension-placeholder";
import "./Editor.scss";
import NavBar from "../navbar/NavBar.jsx";
import {useEffect, useRef, useState} from "react";
import {collection, doc, setDoc, addDoc, deleteDoc} from "firebase/firestore";
import {auth, db} from "../firebase.js";
import DocumentUpdate from "../models/DocumentUpdate.js";

// define your extension array
const extensions = [
    StarterKit,
    History,
    Placeholder.configure({
        placeholder: "Write something...",
    })
]

const validIconClass = "valid-icon";
const validMessageClass = "valid-message";
const errorIconClass = "error-icon";
const errorMessageClass = "error-message";

function showMessage(result, statusContainer, statusIcon, statusMessage) {
    statusMessage.innerHTML = `${result[1]}`;
    statusContainer.style.display = "inline-flex";

    if (!result[0]) {
        statusIcon.innerHTML = "error";
        statusIcon.classList.add(errorIconClass);
        statusIcon.classList.remove(validIconClass);
        statusMessage.classList.add(errorMessageClass);
        statusMessage.classList.remove(validMessageClass);
    } else {
        statusIcon.innerHTML = "check_circle";
        statusIcon.classList.add(validIconClass);
        statusIcon.classList.remove(errorIconClass);
        statusMessage.classList.add(validMessageClass);
        statusMessage.classList.remove(errorMessageClass);
    }

    return result[0];
}

async function saveDocument(documentId, title, content) {
    const documentUpdate = new DocumentUpdate(
        auth.currentUser.uid,
        title,
        content
    );

    if (documentId === "") {
        // New document
        const documentRef = await addDoc(
            collection(db, "documents"),
            DocumentUpdate.FromDocumentUpdate(documentUpdate)
        );

        documentId = documentRef.id;
    } else {
        // Editing existing document
        await setDoc(
            doc(db, "documents", documentId),
            DocumentUpdate.FromDocumentUpdate(documentUpdate),
            {merge: true}
        );
    }

    return documentId;
}

function renderAfterSaveDocument(documentIdContainer, title, content,
                                 statusContainer, statusIcon, statusMessage) {
    saveDocument(documentIdContainer.innerHTML, title, content)
        .then((documentId) => {
            documentIdContainer.innerHTML = documentId;
            const result = [true, "Save successfully."];
            showMessage(result, statusContainer, statusIcon, statusMessage);
        })
        .catch((error) => {
            const result = [false, error];
            showMessage(result, statusContainer, statusIcon, statusMessage);
        });
}

function Editor({documentId, title, content, isNewDocument}) {
    const documentIdContainer = useRef(null);
    const [getSaveDisabled, setSaveDisabled] = useState(title === "");
    const pageBackground = useRef(null);
    const statusContainer = useRef(null);
    const statusMessage = useRef(null);
    const statusIcon = useRef(null);
    const saveButton = useRef(null);
    const titleInput = useRef(null);
    const [getContent, setContent] = useState("");
    const [getNewDocument, setNewDocument] = useState(isNewDocument);
    const editor = useEditor({
        extensions,
        content,
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
    });

    if (!editor) {
        return null;
    }

    return (
        <div className="editor-page">
            <NavBar/>
            <div className="page-background" ref={pageBackground}></div>
            <div className="editor-container">
                <div ref={documentIdContainer} className="document-id-container">{documentId}</div>
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
                    <button ref={saveButton} className="toolbar-button save-button" disabled={getSaveDisabled}
                            title="Save"
                            onClick={() => {
                                renderAfterSaveDocument(
                                    documentIdContainer.current, titleInput.current.value, getContent,
                                    statusContainer.current, statusIcon.current, statusMessage.current
                                );
                                // If the document id is stored, the document is savable
                                setNewDocument(documentIdContainer.current.innerHTML === "");
                            }}>
                        <span className="material-symbols-outlined">save</span>
                    </button>
                    {
                        !getNewDocument &&
                        <button className="toolbar-button delete-button"
                                title="Delete"
                                onClick={() => {

                                }}>
                            <span className="material-symbols-outlined">delete</span>
                        </button>
                    }
                </div>
                <div className="status-container" ref={statusContainer}>
                    <span ref={statusIcon} className={`material-symbols-outlined ${errorIconClass}`}></span>
                    <span ref={statusMessage} className={`${errorMessageClass}`}></span>
                </div>
                <input ref={titleInput} type="text" className="title" required placeholder="Enter title..."
                       value={title}
                       onChange={(e) => {
                           setSaveDisabled(e.target.validity.valueMissing);
                       }}/>
                <EditorContent editor={editor}></EditorContent>
            </div>
        </div>
    );
}

export default Editor;