import "./RecentNote.scss";
import {useEffect, useState} from "react";
import {auth, docDAO, paths} from "../backend.js";
import {useNavigate} from "react-router-dom";
import {onAuthStateChanged} from "firebase/auth";

function RecentNote({docSummary, setFullDoc, setLoadRecent}) {
    const navigate = useNavigate();
    const [getUser, setUser] = useState(null);
    const [getDocSummary, setDocSummary] = useState(docSummary);
    const [getThumbnailClass, setThumbnailClass] = useState("thumbnail");
    const [getDateClass, setDateClass] = useState("summary-date");

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
        <div className="recent-note-container"
             onClick={() => {
                 loadDoc();
             }}
             onMouseEnter={() => {
                 setThumbnailClass("thumbnail-hover");
                 setDateClass("summary-date-hover");
             }}
             onMouseLeave={() => {
                 setThumbnailClass("thumbnail");
                 setDateClass("summary-date");
             }}>
            <div className="thumbnail-container">
                <img className={getThumbnailClass} src={docSummary.thumbnail} alt="Thumbnail"/>
            </div>
            <div className="summary-container">
                <div className="doc-id">{docSummary.id}</div>
                <div className="summary-title">{docSummary.title}</div>
                <div className={getDateClass}>{docSummary.lastModified}</div>
                <button className="sidebar-action-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            window.open(`/notes/${docSummary.id}`, "_blank");
                        }}>
                    Open in new tab
                </button>
            </div>
        </div>
    );
}

export default RecentNote;