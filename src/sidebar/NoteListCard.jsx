import "./NoteListCard.scss";
import {useEffect, useState} from "react";
import {auth, docDAO, paths} from "../backend.js";
import {useNavigate} from "react-router-dom";
import {onAuthStateChanged} from "firebase/auth";
import SidebarActionButton from "./SidebarActionButton.jsx";

function NoteListCard({docSummary, setFullDoc, setLoadRecent}) {
    const navigate = useNavigate();
    const [getUser, setUser] = useState(null);
    const [getDocSummary, setDocSummary] = useState(docSummary);

    useEffect(() => {
        const unsubUser = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => {
            unsubUser();
        };
    }, []);

    useEffect(() => {
        setDocSummary(docSummary);
    }, [docSummary]);

    async function fetchDoc(userId, docId) {
        try {
            const fullDoc = await docDAO.accessFullDoc(userId, docId);
            setFullDoc(fullDoc);
            setLoadRecent(true);
        } catch (error) {
            navigate(paths.error);
        }
    }

    function loadDoc() {
        if (getUser) {
            fetchDoc(getUser.uid, getDocSummary.id);
        } else {
            navigate(paths.signIn);
        }
    }

    return (
        <div className="note-list-card-container"
             onClick={() => {
                 loadDoc();
             }}>
            <div className="thumbnail-container">
                <img className="thumbnail" src={docSummary.thumbnail} alt="Thumbnail"/>
            </div>
            <div className="summary-container">
                <div className="summary-wrapper">
                    <div className="doc-id">{docSummary.id}</div>
                    <div className="summary-title">{docSummary.title}</div>
                    <div className="summary-date">{docSummary.lastModified}</div>
                    <SidebarActionButton icon="open_in_new" text="Open in new tab" click={(e) => {
                        e.stopPropagation();
                        window.open(`/notes/${docSummary.id}`, "_blank");
                    }}/>
                </div>
            </div>
        </div>
    );
}

export default NoteListCard;