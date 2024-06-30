import "./EditorPage.scss";
import NavBar from "../navbar/NavBar.jsx";
import {useState} from "react";
import Editor from "./Editor.jsx";
import Sidebar from "../sidebar/Sidebar.jsx";

function EditorPage({documentId, thumbnail, title, content, isNewDocument}) {
    const [getEditorGridLayout, setEditorGridLayout] = useState("1fr");
    const [getSidebarDisplay, setSidebarDisplay] = useState("none");
    const [getEditor, setEditor] = useState(null);
    const [getSummaryDisplay, setSummaryDisplay] = useState("none");
    const [getQADisplay, setQADisplay] = useState("none");
    const [getImgToolsDisplay, setImgToolsDisplay] = useState("none");
    const [getAIImgDisplay, setAIImgDisplay] = useState("none");
    const [getOpenNoteDisplay, setOpenNoteDisplay] = useState("none");

    function openSidebar() {
        setEditorGridLayout("1fr 3fr");
        setSidebarDisplay("block");
    }

    function closeSidebar() {
        setEditorGridLayout("1fr");
        setSidebarDisplay("none");
    }

    return (
        <div className="editor-page">
            <NavBar/>
            <div className="editor-grid" style={{gridTemplateColumns: getEditorGridLayout}}>
                <Sidebar sidebarDisplay={getSidebarDisplay}
                         closeSidebar={closeSidebar}
                         editor={getEditor}
                         openNoteDisplay={getOpenNoteDisplay}
                         summaryDisplay={getSummaryDisplay}
                         qaDisplay={getQADisplay}
                         imgToolsDisplay={getImgToolsDisplay}
                         aiImgDisplay={getAIImgDisplay}/>
                <Editor documentId={documentId}
                        thumbnail={thumbnail}
                        title={title}
                        content={content}
                        isNewDocument={isNewDocument}
                        openSidebar={openSidebar}
                        setEditor={setEditor}
                        setOpenNoteDisplay={setOpenNoteDisplay}
                        setSummaryDisplay={setSummaryDisplay}
                        setQADisplay={setQADisplay}
                        setImgToolsDisplay={setImgToolsDisplay}
                        setAIImgDisplay={setAIImgDisplay}/>
            </div>
        </div>
    );
}

export default EditorPage;