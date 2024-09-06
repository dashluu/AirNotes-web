import "./EditorPage.scss";
import NavBar from "../navbar/NavBar.jsx";
import {useState} from "react";
import Editor from "./Editor.jsx";
import Sidebar from "../sidebar/Sidebar.jsx";

function EditorPage({getFullDoc, setFullDoc, isNewDoc, loaded}) {
    const [getGridLayout, setGridLayout] = useState("0fr 1fr");
    const [getSidebarDisplay, setSidebarDisplay] = useState("hidden");
    const [getSidebarAnimation, setSidebarAnimation] = useState("none");
    const [getEditor, setEditor] = useState(null);
    const [getSidebarMode, setSidebarMode] = useState(null);

    function openSidebar() {
        setSidebarDisplay("visible");
        setSidebarAnimation("sidebar-in 0.5s");
        setGridLayout("1fr 3fr");
    }

    function closeSidebar() {
        setSidebarDisplay("hidden");
        setSidebarAnimation("sidebar-out 0.5s")
        setGridLayout("0fr 1fr");
    }

    return (
        <div className="editor-page">
            <NavBar/>
            <div className="editor-grid" style={{gridTemplateColumns: getGridLayout}}>
                {loaded && <Sidebar setFullDoc={setFullDoc}
                                    sidebarDisplay={getSidebarDisplay}
                                    sidebarAnimation={getSidebarAnimation}
                                    closeSidebar={closeSidebar}
                                    editor={getEditor}
                                    mode={getSidebarMode}/>}
                {loaded && <Editor docId={getFullDoc.id}
                                   thumbnail={getFullDoc.thumbnail}
                                   title={getFullDoc.title}
                                   content={getFullDoc.content}
                                   isNewDoc={isNewDoc}
                                   openSidebar={openSidebar}
                                   setEditor={setEditor}
                                   setSidebarMode={setSidebarMode}/>}
            </div>
        </div>
    );
}

export default EditorPage;