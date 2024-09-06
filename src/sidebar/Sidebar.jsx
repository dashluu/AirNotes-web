import "./Sidebar.scss";
import TextSummary from "./TextSummary.jsx";
import TextQA from "./TextQA.jsx";
import ImageTools from "./ImageTools.jsx";
import AIImage from "./AIImage.jsx";
import OpenNote from "./OpenNote.jsx";
import {useEffect, useState} from "react";
import ToolbarButton from "../ui_elements/ToolbarButton.jsx";

function Sidebar({
                     setFullDoc,
                     sidebarDisplay,
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
    const [getSummaryTriggered, setSummaryTriggered] = useState(false);

    function hideContent() {
        setOpenNoteDisplay("none");
        setSummaryDisplay("none");
        setQADisplay("none");
        setImgToolsDisplay("none");
        setAIImgDisplay("none");
    }

    useEffect(() => {
        if (!mode) {
            hideContent();
            return;
        }

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
                setSummaryTriggered(mode.triggered);
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
        <div className="sidebar" style={{visibility: sidebarDisplay, animation: sidebarAnimation}}>
            <div className="sidebar-toolbar toolbar">
                <ToolbarButton title="Close Sidebar" icon="menu_open" click={() => {
                    hideContent();
                    closeSidebar();
                }}/>
            </div>
            <div className="sidebar-ui-container">
                <div className="sidebar-ui">
                    <TextSummary editor={editor} triggered={getSummaryTriggered} summaryDisplay={getSummaryDisplay}/>
                </div>
                <div className="sidebar-ui">
                    <TextQA editor={editor} qaDisplay={getQADisplay}/>
                </div>
                <div className="sidebar-ui">
                    <ImageTools editor={editor} imgToolsDisplay={getImgToolsDisplay}/>
                </div>
                <div className="sidebar-ui">
                    <AIImage aiImgDisplay={getAIImgDisplay}/>
                </div>
                <div className="sidebar-ui">
                    <OpenNote setFullDoc={setFullDoc} openNoteDisplay={getOpenNoteDisplay}/>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;