import "./Sidebar.scss";
import AISummary from "./AISummary.jsx";
import {useState} from "react";
import AIQA from "./AIQA.jsx";

function Sidebar({sidebarDisplay, closeSidebar, editorContent, summaryDisplay, qaDisplay}) {
    return (
        <div className="sidebar" style={{display: sidebarDisplay}}>
            <div className="sidebar-toolbar">
                <button className="sidebar-toolbar-button"
                        title="Close Sidebar"
                        onClick={() => {
                            closeSidebar();
                        }}>
                    <span className="material-symbols-outlined">keyboard_double_arrow_left</span>
                </button>
            </div>
            <div className="sidebar-ui-container">
                <div className="sidebar-ui" style={{display: summaryDisplay}}>
                    <AISummary editorContent={editorContent}/>
                </div>
                <div className="sidebar-ui" style={{display: qaDisplay}}>
                    <AIQA editorContent={editorContent}/>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;