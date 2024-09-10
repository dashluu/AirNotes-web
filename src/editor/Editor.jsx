import "./Editor.scss";
import {EditorContent, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {Placeholder} from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import {defaultThumbnail, docDAO, paths, statusMessages, storage} from "../backend.js";
import Status from "../status/Status.jsx";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import StatusController from "../ui_elements/StatusController.js";
import BubbleMenuWrapper from "./BubbleMenuWrapper.jsx";
import FloatingMenuWrapper from "./FloatingMenuWrapper.jsx";
import {Image} from "@tiptap/extension-image";
import {FileHandler} from "@tiptap-pro/extension-file-handler";
import FileDAO from "../daos/FileDAO.js";
import {getDownloadURL, ref} from "firebase/storage";
import ToolbarButton from "../ui_elements/ToolbarButton.jsx";
import {Heading} from "@tiptap/extension-heading";
import {TextAlign} from "@tiptap/extension-text-align";
import {TaskList} from "@tiptap/extension-task-list";
import {TaskItem} from "@tiptap/extension-task-item";
import {OrderedList} from "@tiptap/extension-ordered-list";
import {ListItem} from "@tiptap/extension-list-item";

function Editor({
                    user,
                    docId,
                    title,
                    content,
                    openSidebar,
                    setEditor,
                    setSidebarMode
                }) {
    const navigate = useNavigate();
    const fileDAO = new FileDAO();
    const [getDocId, setDocId] = useState(docId);
    const [getTitle, setTitle] = useState(title);
    const [getContent, setContent] = useState(content);
    const [getUndoDisabled, setUndoDisabled] = useState(true);
    const [getRedoDisabled, setRedoDisabled] = useState(true);
    const deleteDisplay = getDocId === "" ? "none" : "inline-block";
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
        Heading.configure({
            levels: [1, 2, 3],
        }),
        TextAlign.configure({
            types: ["heading", "paragraph"],
        }),
        OrderedList,
        ListItem,
        TaskList,
        TaskItem.configure({
            nested: true,
        }),
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
    ];

    let editor = useEditor({
        extensions,
        content,
        onCreate({editor}) {
            setEditor(editor);
        },
        onUpdate({editor}) {
            setUndoDisabled(!editor.can().undo());
            setRedoDisabled(!editor.can().redo());
            setContent(editor.getHTML());
        }
    });

    function updateTitle(newTitle) {
        setTitle(newTitle);

        if (newTitle === "") {
            setStatusMessage("Title cannot be empty");
            setStatusDisplay("inline-flex");
            setStatusIcon("error");
            setStatusIconClass("error-icon");
            setStatusMessageClass("error-message");
        } else {
            statusController.hideStatus();
        }
    }

    useEffect(() => {
        setDocId(docId);
    }, [docId]);

    useEffect(() => {
        updateTitle(title);
    }, [title]);

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
        return firstImg.src;
    }

    async function saveDoc() {
        if (!user) {
            statusController.displayFailure(statusMessages.unauthorizedAccess);
            return;
        }

        statusController.displayProgress();

        try {
            const updatedThumbnail = await updateThumbnail();
            const result = await docDAO.update(user.uid, getDocId, updatedThumbnail, getTitle, getContent);
            setDocId(result.id);
            statusController.displaySuccess(statusMessages.savedOk);
        } catch (error) {
            statusController.displayFailure(error.message);
        }
    }

    async function deleteDoc() {
        if (!user) {
            statusController.displayFailure(statusMessages.unauthorizedAccess);
            return;
        }

        statusController.displayProgress();

        try {
            await docDAO.delete(getDocId);
            statusController.hideStatus();
            navigate(paths.home);
        } catch (error) {
            statusController.displayFailure(error.message);
        }
    }

    function showOpenNote() {
        openSidebar();
        setSidebarMode({name: "openNote"});
    }

    function getContext() {
        // API for text selection
        const {view, state} = editor;
        const {from, to} = view.state.selection;
        const text = state.doc.textBetween(from, to, " ");
        // If there is a selection of text, use that selection, otherwise, use the whole text
        const context = text === "" ? "document" : text;
        return context;
    }

    function showSummary() {
        openSidebar();
        setSidebarMode({name: "summary", context: getContext()});
    }

    function showQA() {
        openSidebar();
        setSidebarMode({name: "QA", context: getContext()});
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
            <div className="editor-title-toolbar-container">
                <div className="doc-id-container">{getDocId}</div>
                <div className="toolbar">
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
                        showSummary();
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
                    <ToolbarButton title="Save" icon="save" disabled={getTitle === ""} click={() => {
                        saveDoc();
                    }}/>
                    <ToolbarButton title="Delete" icon="delete" style={{display: `${deleteDisplay}`}} click={() => {
                        deleteDoc();
                    }}/>
                </div>
                <div className="editor-title-container">
                    <input type="text" className="editor-title" required placeholder="Enter title..." value={getTitle}
                           onChange={(e) => updateTitle(e.target.value)}/>
                    <Status display={getStatusDisplay}
                            iconClass={getStatusIconClass}
                            messageClass={getStatusMessageClass}
                            icon={getStatusIcon}
                            message={getStatusMessage}/>
                </div>
            </div>
            {editor && <BubbleMenuWrapper editor={editor} showSummary={showSummary} showQA={showQA}/>}
            {editor && <FloatingMenuWrapper editor={editor}/>}
            <EditorContent editor={editor} style={{marginTop: `${getStatusDisplay !== "none" ? "140px" : "110px"}`}}/>
        </div>
    );
}

export default Editor;