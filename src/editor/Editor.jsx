import "./Editor.scss";
import {EditorContent, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {Placeholder} from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import {auth, defaultThumbnail, docDAO, paths, statusMessages, storage} from "../backend.js";
import Status from "../status/Status.jsx";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import StatusController from "../ui_elements/StatusController.js";
import BubbleMenuWrapper from "./BubbleMenuWrapper.jsx";
import FloatingMenuWrapper from "./FloatingMenuWrapper.jsx";
import {Image} from "@tiptap/extension-image";
import {FileHandler} from "@tiptap-pro/extension-file-handler";
import {onAuthStateChanged} from "firebase/auth";
import FileDAO from "../daos/FileDAO.js";
import {getDownloadURL, ref} from "firebase/storage";
import ToolbarButton from "../ui_elements/ToolbarButton.jsx";
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
                    setSidebarMode
                }) {
    const navigate = useNavigate();
    const fileDAO = new FileDAO();
    const [getUser, setUser] = useState(null);
    const [getDocId, setDocId] = useState(docId);
    const [getThumbnail, setThumbnail] = useState(thumbnail);
    const [getTitle, setTitle] = useState(title);
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
        if (editor) {
            editor.commands.setContent(content);
            setContent(content);
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

        try {
            const url = await fileDAO.uploadFile(file, extension);
            reader.readAsDataURL(file);
            reader.onload = () => {
                editor.chain().insertContentAt(pos, {
                    type: "image",
                    attrs: {
                        src: url,
                    },
                }).focus().run();
            };

            statusController.displaySuccess(statusMessages.uploadedImgOk);
        } catch (error) {
            statusController.displayFailure(error.message);
        }
    }

    async function dropPasteFile(editor, fileList, pos) {
        statusController.displayProgress();
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

    async function updateThumbnail() {
        const tmpContent = document.createElement("div");
        tmpContent.innerHTML = getContent;
        const imgList = tmpContent.getElementsByTagName("img");

        if (imgList.length === 0) {
            return await getDownloadURL(ref(storage, defaultThumbnail));
        }

        const firstImg = imgList[0];
        setThumbnail(firstImg.src);
        return firstImg.src;
    }

    async function afterSaveDoc() {
        if (getUser) {
            statusController.displayProgress();

            try {
                const updatedThumbnail = await updateThumbnail();
                const result = await docDAO.update(getUser.uid, getDocId, updatedThumbnail, getTitle, getContent);
                setDocId(result.id);
                statusController.displaySuccess(statusMessages.savedOk);
            } catch (error) {
                statusController.displayFailure(error.message);
            }
        } else {
            statusController.displayFailure(statusMessages.unauthorizedAccess);
        }
    }

    async function afterDeleteDoc() {
        if (getUser) {
            statusController.displayProgress();

            try {
                await docDAO.delete(getDocId);
                statusController.hideStatus();
                navigate(paths.home);
            } catch (error) {
                statusController.displayFailure(error.message);
            }
        } else {
            statusController.displayFailure(statusMessages.unauthorizedAccess);
        }
    }

    function showOpenNote() {
        openSidebar();
        setSidebarMode({name: "openNote"});
    }

    function showSummary(triggered) {
        openSidebar();
        setSidebarMode({name: "summary", triggered: triggered});
    }

    function showQA() {
        openSidebar();
        setSidebarMode({name: "QA"});
    }

    function showImgTools() {
        openSidebar();
        setSidebarMode({name: "imgTools"});
    }

    function showAIImg() {
        openSidebar();
        setSidebarMode({name: "AIImg"});
    }

    return (
        <div className="editor-container">
            <div className="doc-id-container">{getDocId}</div>
            <div className="editor-toolbar toolbar">
                <ToolbarButton title="New" icon="edit_square" click={() => {
                    navigate(paths.newDoc);
                }}/>
                <ToolbarButton title="Undo" icon="undo" disabled={getUndoDisabled} click={() => {
                    editor.chain().focus().undo().run();
                }}/>
                <ToolbarButton title="Redo" icon="redo" disabled={getRedoDisabled} click={() => {
                    editor.chain().focus().redo().run();
                }}/>
                <ToolbarButton title="Open Recent" icon="folder_open" click={() => {
                    showOpenNote();
                }}/>
                <ToolbarButton title="Search" icon="search" click={() => {
                    showOpenNote();
                }}/>
                <ToolbarButton title="Summarize" icon="notes" click={() => {
                    showSummary(false);
                }}/>
                <ToolbarButton title="Q&A" icon="quiz" click={() => {
                    showQA();
                }}/>
                <ToolbarButton title="Image Tools" icon="image" click={() => {
                    showImgTools();
                }}/>
                <ToolbarButton title="AI Image" icon="filter_vintage" click={() => {
                    showAIImg();
                }}/>
                <ToolbarButton title="Save" icon="save" disabled={getSaveDisabled} click={() => {
                    afterSaveDoc();
                }}/>
                <ToolbarButton title="Delete" icon="delete" style={{display: `${getDeleteDisplay}`}} click={() => {
                    afterDeleteDoc();
                }}/>
            </div>
            <Status display={getStatusDisplay}
                    iconClass={getStatusIconClass}
                    messageClass={getStatusMessageClass}
                    icon={getStatusIcon}
                    message={getStatusMessage}/>
            <input type="text" className="editor-title" required placeholder="Enter title..."
                   value={getTitle}
                   onChange={(e) => {
                       setTitle(e.target.value);
                   }}/>
            {editor && <BubbleMenuWrapper editor={editor} showSummary={showSummary}/>}
            {editor && <FloatingMenuWrapper editor={editor}/>}
            <EditorContent editor={editor}/>
        </div>
    );
}

export default Editor;