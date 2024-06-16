import {EditorContent, useEditor} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {Placeholder} from "@tiptap/extension-placeholder";
import './EditorPage.scss'
import NavBar from "../navbar/NavBar.jsx";
import {useEffect, useRef, useState} from "react";
import {collection, doc, setDoc, addDoc} from "firebase/firestore";
import {auth, db} from "../firebase.js";

// define your extension array
const extensions = [
    StarterKit,
    Placeholder.configure({
        placeholder: 'Write something...',
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

async function saveDocument(documentIdContainer, titleInput, content, statusContainer, statusIcon, statusMessage) {
    try {
        let docRef;

        if (documentIdContainer.innerHTML === "") {
            // New document
            docRef = collection(db, "documents");

            await addDoc(docRef, {
                // This assumes the user is already logged in
                userId: auth.currentUser.uid,
                title: titleInput.value,
                content: content
            });
        } else {
            // Editing existing document
            docRef = doc(db, "documents", documentIdContainer.innerHTML);

            await setDoc(docRef, {
                // This assumes the user is already logged in
                userId: auth.currentUser.uid,
                title: titleInput.value,
                content: content
            }, {merge: true});
        }

        documentIdContainer.innerHTML = docRef.id;
        const result = [true, "Save successfully."];
        showMessage(result, statusContainer, statusIcon, statusMessage);
    } catch (error) {
        const result = [false, error];
        showMessage(result, statusContainer, statusIcon, statusMessage);
    }
}

const EditorPage = ({ documentId }) => {
    const documentIdContainer = useRef(null);
    const [isSaveDisabled, setSaveDisabled] = useState(true);
    const pageBackground = useRef(null);
    const statusContainer = useRef(null);
    const statusMessage = useRef(null);
    const statusIcon = useRef(null);
    const saveButton = useRef(null);
    const titleInput = useRef(null);
    const [content, setContent] = useState("");
    const editor = useEditor({
        extensions,
        onUpdate({editor}) {
            setContent(editor.getHTML());
        }
    })

    useEffect(() => {
        if (pageBackground.current) {
            if (window.scrollY < pageBackground.current.offsetTop) {
                pageBackground.current.classList.remove("page-background-sticky");
            } else {
                pageBackground.current.classList.add("page-background-sticky");
            }
        }
    });

    return (
        <div className="editor-page">
            <NavBar/>
            <div className="page-background" ref={pageBackground}></div>
            <div className='editor-container'>
                <div ref={documentIdContainer} className='document-id-container'></div>
                <div className='toolbar'>
                    <button ref={saveButton} className='toolbar-button undo-button'>
                        <span className="material-symbols-outlined">undo</span>
                    </button>
                    <button ref={saveButton} className='toolbar-button redo-button'>
                        <span className="material-symbols-outlined">redo</span>
                    </button>
                    <button ref={saveButton} className='toolbar-button save-button' disabled={isSaveDisabled}
                            onClick={() =>
                                saveDocument(documentIdContainer.current, titleInput.current, content,
                                    statusContainer.current, statusIcon.current, statusMessage.current)
                            }>
                        <span className="material-symbols-outlined">save</span>
                    </button>
                </div>
                <div className='status-container' ref={statusContainer}>
                    <span ref={statusIcon} className={`material-symbols-outlined ${errorIconClass}`}></span>
                    <span ref={statusMessage} className={`${errorMessageClass}`}></span>
                </div>
                <input ref={titleInput} type='text' className='title' required placeholder="Enter title..."
                       onChange={(e) => {
                           setSaveDisabled(e.target.validity.valueMissing);
                       }}/>
                <EditorContent editor={editor}></EditorContent>
            </div>
        </div>
    )
}

export default EditorPage;