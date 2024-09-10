import "./OpenNote.scss";
import "../ui_elements/TextInput.scss"
import {useEffect, useRef, useState} from "react";
import NoteListCard from "./NoteListCard.jsx";
import {docDAO, statusMessages} from "../backend.js";
import DocumentDAO from "../daos/DocumentDAO.js";
import StatusController from "../ui_elements/StatusController.js";
import Status from "../status/Status.jsx";
import DocumentSummary from "../models/DocumentSummary.js";

function OpenNote({user, openNoteDisplay}) {
    const searchInput = useRef(null);
    // const [getUnsubSummaryList, setUnsubSummaryList] = useState(null);
    const [getSearchResponse, setSearchResponse] = useState("");
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
            // If the note list is displayed, focus on the search input
            searchInput.current.focus();
        }
    }, [openNoteDisplay]);

    useEffect(() => {
        fetchRecentNoteList();
    }, [user]);

    async function fetchRecentNoteList() {
        if (!user) {
            return;
        }

        statusController.displayProgress();

        try {
            // const [unsubSummaryList, summaryList] = await docDAO.getDocSummaryList(
            //     userId, getDocId, DocumentDAO.recentNumDocs
            // );
            setSearchResponse("");
            const summaryList = await docDAO.getDocSummaryList(user.uid, DocumentDAO.recentNumDocs);
            const noteList = summaryList.map(
                (summary, i) => <NoteListCard key={i} docSummary={summary}/>
            );
            // setUnsubSummaryList(unsubSummaryList);
            setNoteList(noteList);
            statusController.hideStatus();
        } catch (error) {
            // setUnsubSummaryList(null);
            statusController.displayFailure(error.message);
        }
    }

    async function searchNotes() {
        if (!user) {
            statusController.displayFailure(statusMessages.unauthorizedAccess);
            return;
        }

        if (searchInput.current.value === "") {
            fetchRecentNoteList();
            return;
        }

        statusController.displayProgress();
        const searchModel = {
            user_id: user.uid,
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
                const searchResult = await response.json();
                setSearchResponse(searchResult["answer"]);
                const src = searchResult["src"];
                // Only take the top hit
                const topSrc = src.slice(0, 1);
                const noteList = topSrc.map(
                    (summary, i) => <NoteListCard key={i} user={user}
                                                  docSummary={DocumentSummary.objToDocSummary(summary)}/>
                );
                setNoteList(noteList);
                statusController.hideStatus();
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
            <input type="search" className="search-input text-input" placeholder="Search notes" ref={searchInput}
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
            <div className="search-response">Search result: {getSearchResponse}</div>
            <div className="note-list">
                {getNoteList}
            </div>
        </div>
    );
}

export default OpenNote;