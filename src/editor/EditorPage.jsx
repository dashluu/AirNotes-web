import "./EditorPage.scss";
import NavBar from "../navbar/NavBar.jsx";
import {useState} from "react";
import Editor from "./Editor.jsx";
import Sidebar from "../sidebar/Sidebar.jsx";

function EditorPage({fullDoc, loaded}) {
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
                {loaded && <Sidebar sidebarDisplay={getSidebarDisplay}
                                    sidebarAnimation={getSidebarAnimation}
                                    closeSidebar={closeSidebar}
                                    editor={getEditor}
                                    mode={getSidebarMode}/>}
                {loaded && <Editor docId={fullDoc.id}
                                   title={fullDoc.title}
                                   content={fullDoc.content}
                                   openSidebar={openSidebar}
                                   setEditor={setEditor}
                                   setSidebarMode={setSidebarMode}/>}
            </div>
        </div>
    );
}

export default EditorPage;