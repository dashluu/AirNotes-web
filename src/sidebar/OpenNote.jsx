import "./OpenNote.scss";
import {useEffect, useState} from "react";
import RecentNote from "./RecentNote.jsx";
import {onAuthStateChanged} from "firebase/auth";
import {auth, docDAO} from "../backend.js";

function OpenNote({docId, loadRecent}) {
    const [getUser, setUser] = useState(null);
    const [getDocId, setDocId] = useState(docId);
    const [getUnsubSummaryList, setUnsubSummaryList] = useState(null);
    const [getRecentNoteList, setRecentNoteList] = useState([]);

    useEffect(() => {
        setDocId(docId);
    }, [docId]);

    async function fetchRecentNoteList(userId) {
        await docDAO.getDocSummaryList(userId, getDocId, 4, null)
            .then(([unsubSummaryList, summaryList]) => {
                const recentNoteList = summaryList.map(
                    (summary, i) => <RecentNote key={i} docSummary={summary}/>
                );

                setUnsubSummaryList(unsubSummaryList);
                setRecentNoteList(recentNoteList);
            });
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
        if (getUser && loadRecent && getDocId) {
            fetchRecentNoteList(getUser.uid);
        }
    }, [getUser, loadRecent, getDocId]);

    return (
        <div className="open-note-container">
            {getRecentNoteList}
        </div>
    );
}

export default OpenNote;