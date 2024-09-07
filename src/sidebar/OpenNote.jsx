import "./OpenNote.scss";
import "../ui_elements/TextInput.scss"
import {useEffect, useRef, useState} from "react";
import NoteListCard from "./NoteListCard.jsx";
import {onAuthStateChanged} from "firebase/auth";
import {auth, docDAO, statusMessages} from "../backend.js";
import DocumentDAO from "../daos/DocumentDAO.js";
import StatusController from "../ui_elements/StatusController.js";
import Status from "../status/Status.jsx";
import DocumentSummary from "../models/DocumentSummary.js";

function OpenNote({openNoteDisplay}) {
    const [getUser, setUser] = useState(null);
    const searchInput = useRef(null);
    // const [getUnsubSummaryList, setUnsubSummaryList] = useState(null);
    const [getNoteList, setNoteList] = useState([]);
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
                setUser(user);
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
            const noteList = summaryList.map(
                (summary, i) => <NoteListCard key={i} docSummary={summary}/>
            );
            // setUnsubSummaryList(unsubSummaryList);
            setNoteList(noteList);
            statusController.displaySuccess(statusMessages.loadedOk);
        } catch (error) {
            // setUnsubSummaryList(null);
            statusController.displayFailure(error.message);
        }
    }

    async function searchNotes() {
        if (!getUser) {
            statusController.displayFailure(statusMessages.unauthorizedAccess);
            return;
        }

        if (searchInput.current.value === "") {
            fetchRecentNoteList(getUser.uid);
            return;
        }

        statusController.displayProgress();
        const searchModel = {
            user_id: getUser.uid,
            query: searchInput.current.value,
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_AI_SERVER}/search`, {
                method: "post",
                body: JSON.stringify(searchModel),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const summaryList = await response.json();
                const topSummaryList = summaryList.slice(0, DocumentDAO.recentNumDocs);
                const noteList = topSummaryList.map(
                    (summary, i) => <NoteListCard key={i} docSummary={DocumentSummary.objToDocSummary(summary)}/>
                );
                setNoteList(noteList);
                statusController.displaySuccess(statusMessages.searchedOk);
            } else {
                statusController.displayFailure(await response.text());
            }
        } catch (error) {
            statusController.displayFailure(error.message);
        }
    }

    return (
        <div className="open-note-container sidebar-container" style={{display: openNoteDisplay}}>
            <div className="sidebar-title">Open Note</div>
            <input type="search" className="search-input text-input" placeholder="Search notes..." ref={searchInput}
                   onKeyDown={(e) => {
                       if (e.key === "Enter") {
                           searchNotes();
                       }
                   }}/>
            <Status display={getStatusDisplay}
                    iconClass={getStatusIconClass}
                    messageClass={getStatusMessageClass}
                    icon={getStatusIcon}
                    message={getStatusMessage}/>
            <div className="note-list">
                {getNoteList}
            </div>
        </div>
    );
}

export default OpenNote;