import "./EditorPage.scss";
import NavBar from "../navbar/NavBar.jsx";
import {useState} from "react";
import Editor from "./Editor.jsx";
import Sidebar from "../sidebar/Sidebar.jsx";

function EditorPage({user, fullDoc}) {
    const [getGridLayout, setGridLayout] = useState("0fr 1fr");
    const [getSidebarLeft, setSidebarLeft] = useState("-400px");
    const [getSidebarAnimation, setSidebarAnimation] = useState("none");
    const [getEditor, setEditor] = useState(null);
    const [getSidebarMode, setSidebarMode] = useState("openNote");

    function openSidebar() {
        setSidebarLeft("0px")
        setSidebarAnimation("sidebar-in 0.5s");
        setGridLayout("380px 1fr");
    }

    function closeSidebar() {
        setSidebarLeft("-400px")
        setSidebarAnimation("sidebar-out 0.5s")
        setGridLayout("0fr 1fr");
    }

    return (
        <div className="editor-page">
            <NavBar/>
            {getEditor && fullDoc && <Sidebar user={user}
                                              docId={fullDoc.id}
                                              sidebarLeft={getSidebarLeft}
                                              sidebarAnimation={getSidebarAnimation}
                                              closeSidebar={closeSidebar}
                                              editor={getEditor}
                                              mode={getSidebarMode}/>}
            <div className="editor-grid" style={{gridTemplateColumns: getGridLayout}}>
                {fullDoc && <div className="dummy"></div>}
                {fullDoc && <Editor user={user}
                                    docId={fullDoc.id}
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