import "./Sidebar.scss";
import TextSummary from "./TextSummary.jsx";
import TextQA from "./TextQA.jsx";
import ImageTools from "./ImageTools.jsx";
import AIImage from "./AIImage.jsx";
import OpenNote from "./OpenNote.jsx";
import {useEffect, useState} from "react";
import ToolbarButton from "../ui_elements/ToolbarButton.jsx";

function Sidebar({
                     user,
                     docId,
                     sidebarLeft,
                     sidebarAnimation,
                     closeSidebar,
                     editor,
                     mode
                 }) {
    const [getOpenNoteDisplay, setOpenNoteDisplay] = useState("none");
    const [getSummaryDisplay, setSummaryDisplay] = useState("none");
    const [getQADisplay, setQADisplay] = useState("none");
    const [getImgToolsDisplay, setImgToolsDisplay] = useState("none");
    const [getAIImgDisplay, setAIImgDisplay] = useState("none");

    useEffect(() => {
        switch (mode.name) {
            case "openNote":
                setOpenNoteDisplay("block");
                setSummaryDisplay("none");
                setQADisplay("none");
                setImgToolsDisplay("none");
                setAIImgDisplay("none");
                break;
            case "summary":
                setSummaryDisplay("block");
                setOpenNoteDisplay("none");
                setQADisplay("none");
                setImgToolsDisplay("none");
                setAIImgDisplay("none");
                break;
            case "QA":
                setQADisplay("block");
                setOpenNoteDisplay("none");
                setSummaryDisplay("none");
                setImgToolsDisplay("none");
                setAIImgDisplay("none");
                break;
            case "imgTools":
                setImgToolsDisplay("block");
                setOpenNoteDisplay("none");
                setSummaryDisplay("none");
                setQADisplay("none");
                setAIImgDisplay("none");
                break;
            default:
                setAIImgDisplay("block");
                setOpenNoteDisplay("none");
                setSummaryDisplay("none");
                setQADisplay("none");
                setImgToolsDisplay("none");
                break;
        }
    }, [mode]);

    return (
        <div className="sidebar" style={{left: sidebarLeft, animation: sidebarAnimation}}>
            <div className="toolbar">
                <ToolbarButton title="Close Sidebar" icon="menu_open" click={() => closeSidebar()}/>
            </div>
            <div className="sidebar-ui-container">
                <div className="sidebar-ui">
                    <TextSummary user={user} docId={docId} editor={editor} context={mode.context}
                                 summaryDisplay={getSummaryDisplay}/>
                </div>
                <div className="sidebar-ui">
                    <TextQA user={user} docId={docId} editor={editor} context={mode.context}
                            qaDisplay={getQADisplay}/>
                </div>
                <div className="sidebar-ui">
                    <ImageTools user={user} editor={editor} imgToolsDisplay={getImgToolsDisplay}/>
                </div>
                <div className="sidebar-ui">
                    <AIImage user={user} aiImgDisplay={getAIImgDisplay}/>
                </div>
                <div className="sidebar-ui">
                    <OpenNote user={user} openNoteDisplay={getOpenNoteDisplay}/>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;