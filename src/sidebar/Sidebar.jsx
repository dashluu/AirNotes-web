import "./Sidebar.scss";
import AISummary from "./AISummary.jsx";
import AIQA from "./AIQA.jsx";
import ImageTools from "./ImageTools.jsx";
import AIImage from "./AIImage.jsx";

function Sidebar({sidebarDisplay, closeSidebar, editor, summaryDisplay, qaDisplay, imgToolsDisplay, aiImgDisplay}) {
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
                    <AISummary editor={editor}/>
                </div>
                <div className="sidebar-ui" style={{display: qaDisplay}}>
                    <AIQA editor={editor}/>
                </div>
                <div className="sidebar-ui" style={{display: imgToolsDisplay}}>
                    <ImageTools editor={editor}/>
                </div>
                <div className="sidebar-ui" style={{display: aiImgDisplay}}>
                    <AIImage/>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;