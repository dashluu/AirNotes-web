import {EditorProvider} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {Placeholder} from "@tiptap/extension-placeholder";
import './EditorPage.scss'
import NavBar from "../navbar/NavBar.jsx";
import {useEffect, useRef} from "react";
import { collection, addDoc } from "firebase/firestore";
import {auth, db} from "../firebase.js";

// define your extension array
const extensions = [
    StarterKit,
    Placeholder.configure({
        placeholder: 'Write something...',
    })
]

async function saveDocument(userId, title, content) {
    try {
        const docRef = await addDoc(collection(db, "documents"), {
            // This assumes the user is already logged in
            userId: auth.currentUser.uid,
            title: title,
            content: content
        });
    } catch (error) {

    }
}

const EditorPage = () => {
    const pageBackground = useRef(null);

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
                <div className='toolbar'>
                    <button className='toolbar-button save-button'>Save</button>
                    <button className='toolbar-button done-button'>Done</button>
                </div>
                <div className='status'>
                    <span ref={emailValidityIcon} className={`material-symbols-outlined ${errorIconClass}`}></span>
                    <span ref={emailValidityMessage} className={`${errorMessageClass}`}></span>
                </div>
                <input type='text' className='title' placeholder="Enter title..."/>
                <EditorProvider extensions={extensions}></EditorProvider>
            </div>
        </div>
    )
}

export default EditorPage;