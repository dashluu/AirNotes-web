import "./EditorPage.scss";
import NavBar from "../navbar/NavBar.jsx";
import {useEffect, useState} from "react";
import Editor from "./Editor.jsx";
import Sidebar from "../sidebar/Sidebar.jsx";

function EditorPage({fullDoc, isNewDoc, loadRecent}) {
    const [getFullDoc, setFullDoc] = useState(fullDoc);
    const [getLoadRecent, setLoadRecent] = useState(loadRecent);
    const [getGridLayout, setGridLayout] = useState("0 1fr");
    const [getSidebarDisplay, setSidebarDisplay] = useState("none");
    const [getSidebarAnimation, setSidebarAnimation] = useState("none");
    const [getEditor, setEditor] = useState(null);
    const [getSidebarMode, setSidebarMode] = useState(null);

    useEffect(() => {
        setFullDoc(fullDoc);
    }, [fullDoc]);

    useEffect(() => {
        setLoadRecent(loadRecent);
    }, [loadRecent]);

    function openSidebar() {
        setSidebarDisplay("visible");
        setSidebarAnimation("sidebarIn 0.5s");
        setGridLayout("1fr 3fr");
    }

    function closeSidebar() {
        setSidebarDisplay("hidden");
        setSidebarAnimation("sidebarOut 0.5s")
        setGridLayout("0 1fr");
    }

    return (
        <div className="editor-page">
            <NavBar/>
            <div className="editor-grid" style={{gridTemplateColumns: getGridLayout}}>
                <Sidebar docId={getFullDoc.id}
                         setFullDoc={setFullDoc}
                         getLoadRecent={getLoadRecent}
                         setLoadRecent={setLoadRecent}
                         sidebarDisplay={getSidebarDisplay}
                         sidebarAnimation={getSidebarAnimation}
                         closeSidebar={closeSidebar}
                         editor={getEditor}
                         mode={getSidebarMode}/>
                <Editor docId={getFullDoc.id}
                        thumbnail={getFullDoc.thumbnail}
                        title={getFullDoc.title}
                        content={getFullDoc.content}
                        isNewDoc={isNewDoc}
                        openSidebar={openSidebar}
                        setEditor={setEditor}
                        setSidebarMode={setSidebarMode}/>
            </div>
        </div>
    );
}

export default EditorPage;