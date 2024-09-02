import "./OpenNote.scss";
import "../ui_elements/TextInputCommon.scss"
import {useEffect, useRef, useState} from "react";
import NoteListCard from "./NoteListCard.jsx";
import {onAuthStateChanged} from "firebase/auth";
import {auth, docDAO} from "../backend.js";
import DocumentDAO from "../daos/DocumentDAO.js";

function OpenNote({docId, setFullDoc, getLoadRecent, setLoadRecent, openNoteDisplay}) {
    const [getUser, setUser] = useState(null);
    const [getDocId, setDocId] = useState(docId);
    const searchInput = useRef(null);
    const [getUnsubSummaryList, setUnsubSummaryList] = useState(null);
    const [getRecentNoteList, setRecentNoteList] = useState([]);

    useEffect(() => {
        setDocId(docId);
    }, [docId]);

    useEffect(() => {
        if (openNoteDisplay !== "none") {
            // If the image tools are displayed, focus on the URL input
            searchInput.current.focus();
        }
    }, [openNoteDisplay]);

    async function fetchRecentNoteList(userId) {
        try {
            const [unsubSummaryList, summaryList] = await docDAO.getDocSummaryList(
                userId, getDocId, DocumentDAO.recentNumDocs
            );

            const recentNoteList = summaryList.map(
                (summary, i) => <NoteListCard key={i}
                                              docSummary={summary}
                                              setFullDoc={setFullDoc}
                                              setLoadRecent={setLoadRecent}/>
            );

            setUnsubSummaryList(unsubSummaryList);
            setRecentNoteList(recentNoteList);
        } catch (error) {
            setUnsubSummaryList(null);
        }
    }

    useEffect(() => {
        const unsubUser = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => {
            unsubUser();

            if (getUnsubSummaryList) {
                getUnsubSummaryList();
            }
        }
    }, []);

    useEffect(() => {
        if (getUser && getLoadRecent && getDocId) {
            fetchRecentNoteList(getUser.uid);
        }
    }, [getUser, getLoadRecent, getDocId]);

    return (
        <div className="open-note-container sidebar-container" style={{display: openNoteDisplay}}>
            <div className="sidebar-title">Open Note</div>
            <input type="text" className="search-input text-input" placeholder="Search notes..." ref={searchInput}/>
            <div className="note-list">
                {getRecentNoteList}
            </div>
        </div>
    );
}

export default OpenNote;