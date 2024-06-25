import "./EditorPage.scss";
import NavBar from "../navbar/NavBar.jsx";
import {useEffect, useState} from "react";
import Editor from "./Editor.jsx";
import Sidebar from "./Sidebar.jsx";

function EditorPage({documentId, title, content, date, isNewDocument}) {
    const [getEditorGridLayout, setEditorGridLayout] = useState("1fr");
    const [getSidebarDisplay, setSidebarDisplay] = useState("none");
    const [getEditorMarginLeft, setEditorMarginLeft] = useState("auto");
    const [getEditorMarginRight, setEditorMarginRight] = useState("auto");
    const [getEditorContent, setEditorContent] = useState(content);
    const [getSummaryDisplay, setSummaryDisplay] = useState("none");
    const [getQADisplay, setQADisplay] = useState("none");

    useEffect(() => {
        setEditorContent(content);
    }, [content]);

    function openSidebar() {
        setEditorGridLayout("1fr 3fr");
        setSidebarDisplay("block");
        setEditorMarginLeft("0px");
        setEditorMarginRight("0px");
    }

    function closeSidebar() {
        setEditorGridLayout("1fr");
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
                         editorContent={getEditorContent}
                         summaryDisplay={getSummaryDisplay}
                         qaDisplay={getQADisplay}/>
                <Editor documentId={documentId}
                        title={title}
                        getContent={getEditorContent}
                        setContent={setEditorContent}
                        date={date}
                        isNewDocument={isNewDocument}
                        marginLeft={getEditorMarginLeft}
                        marginRight={getEditorMarginRight}
                        openSidebar={openSidebar}
                        setSummaryDisplay={setSummaryDisplay}
                        setQADisplay={setQADisplay}/>
            </div>
        </div>
    );
}

export default EditorPage;