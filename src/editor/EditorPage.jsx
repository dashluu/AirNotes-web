import "./EditorPage.scss";
import NavBar from "../navbar/NavBar.jsx";
import {useEffect, useState} from "react";
import Editor from "./Editor.jsx";
import Sidebar from "./Sidebar.jsx";

function EditorPage({documentId, title, content, date, isNewDocument}) {
    const [getEditorGridLayout, setEditorGridLayout] = useState("1fr 3fr");
    const [getSidebarDisplay, setSidebarDisplay] = useState("block");
    const [getEditorMarginLeft, setEditorMarginLeft] = useState("0px");
    const [getEditorMarginRight, setEditorMarginRight] = useState("0px");
    const [getContent, setContent] = useState(content);

    useEffect(() => {
        setContent(content)
    }, [content]);

    function openSidebar() {
        setEditorGridLayout("1fr 3fr");
        setSidebarDisplay("block");
        setEditorMarginLeft("0px");
        setEditorMarginRight("0px");
    }

    function closeSidebar() {
        setEditorGridLayout("1fr 0fr");
        setSidebarDisplay("none");
        setEditorMarginLeft("auto");
        setEditorMarginRight("auto");
    }

    return (
        <div className="editor-page">
            <NavBar/>
            <div className="editor-grid" style={{gridTemplateColumns: getEditorGridLayout}}>
                <Sidebar sidebarDisplay={getSidebarDisplay}
                         closeSidebar={closeSidebar}
                         editorContent={getContent}/>
                <Editor documentId={documentId}
                        title={title}
                        getContent={getContent}
                        setContent={setContent}
                        date={date}
                        isNewDocument={isNewDocument}
                        marginLeft={getEditorMarginLeft}
                        marginRight={getEditorMarginRight}
                        openSidebar={openSidebar}/>
            </div>
        </div>
    );
}

export default EditorPage;