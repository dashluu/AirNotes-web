import "./Sidebar.scss";
import AISummary from "../popup/AISummary.jsx";

function Sidebar({sidebarDisplay, closeSidebar}) {
    return (
        <div className="sidebar" style={{display: sidebarDisplay}}>
            <div className="sidebar-toolbar">
                <button className="sidebar-toolbar-button" title="Summarize All">
                    <span className="material-symbols-outlined">notes</span>
                </button>
                <button className="sidebar-toolbar-button" title="Q&A">
                    <span className="material-symbols-outlined">quiz</span>
                </button>
                <button className="sidebar-toolbar-button" title="Translation">
                    <span className="material-symbols-outlined">language_chinese_quick</span>
                </button>
                <button className="sidebar-toolbar-button"
                        title="Close Sidebar"
                        onClick={() => {
                            closeSidebar();
                        }}>
                    <span className="material-symbols-outlined">keyboard_double_arrow_left</span>
                </button>
            </div>
            <div className="sidebar-component-container">
                <AISummary text=""/>
            </div>
        </div>
    );
}

export default Sidebar;