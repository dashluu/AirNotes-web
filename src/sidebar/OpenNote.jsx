import "./OpenNote.scss";
import "../ui_elements/TextInput.scss"
import {useEffect, useRef, useState} from "react";
import NoteListCard from "./NoteListCard.jsx";
import {onAuthStateChanged} from "firebase/auth";
import {auth, docDAO, statusMessages} from "../backend.js";
import DocumentDAO from "../daos/DocumentDAO.js";
import StatusController from "../ui_elements/StatusController.js";
import Status from "../status/Status.jsx";

function OpenNote({setFullDoc, openNoteDisplay}) {
    const searchInput = useRef(null);
    // const [getUnsubSummaryList, setUnsubSummaryList] = useState(null);
    const [getRecentNoteList, setRecentNoteList] = useState([]);
    const [getStatusDisplay, setStatusDisplay] = useState("none");
    const [getStatusIconClass, setStatusIconClass] = useState("");
    const [getStatusMessageClass, setStatusMessageClass] = useState("");
    const [getStatusIcon, setStatusIcon] = useState("");
    const [getStatusMessage, setStatusMessage] = useState("");
    const statusController = new StatusController(
        setStatusDisplay, setStatusIconClass, setStatusMessageClass, setStatusIcon, setStatusMessage
    );

    useEffect(() => {
        if (openNoteDisplay !== "none") {
            // If the image tools are displayed, focus on the URL input
            searchInput.current.focus();
        }
    }, [openNoteDisplay]);

    useEffect(() => {
        const unsubUser = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchRecentNoteList(user.uid);
            } else {
                statusController.displayFailure(statusMessages.unauthorizedAccess);
            }
        });

        return () => {
            unsubUser();

            // if (getUnsubSummaryList) {
            //     getUnsubSummaryList();
            // }
        }
    }, []);

    async function fetchRecentNoteList(userId) {
        statusController.displayProgress();

        try {
            // const [unsubSummaryList, summaryList] = await docDAO.getDocSummaryList(
            //     userId, getDocId, DocumentDAO.recentNumDocs
            // );
            const summaryList = await docDAO.getDocSummaryList(userId, DocumentDAO.recentNumDocs);
            const recentNoteList = summaryList.map(
                (summary, i) => <NoteListCard key={i} docSummary={summary} setFullDoc={setFullDoc}/>
            );
            // setUnsubSummaryList(unsubSummaryList);
            setRecentNoteList(recentNoteList);
            statusController.displaySuccess(statusMessages.loadedOk);
        } catch (error) {
            // setUnsubSummaryList(null);
            statusController.displayFailure(error.message);
        }
    }

    return (
        <div className="open-note-container sidebar-container" style={{display: openNoteDisplay}}>
            <div className="sidebar-title">Open Note</div>
            <input type="text" className="search-input text-input" placeholder="Search notes..." ref={searchInput}/>
            <Status display={getStatusDisplay}
                    iconClass={getStatusIconClass}
                    messageClass={getStatusMessageClass}
                    icon={getStatusIcon}
                    message={getStatusMessage}/>
            <div className="note-list">
                {getRecentNoteList}
            </div>
        </div>
    );
}

export default OpenNote;