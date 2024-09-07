import "./NoteListCard.scss";
import {useEffect, useState} from "react";
import {auth, paths} from "../backend.js";
import {useNavigate} from "react-router-dom";
import {onAuthStateChanged} from "firebase/auth";

function NoteListCard({docSummary}) {
    const navigate = useNavigate();
    const [getUser, setUser] = useState(null);

    useEffect(() => {
        const unsubUser = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => {
            unsubUser();
        };
    }, []);

    function loadDoc() {
        if (getUser) {
            window.open(`/notes/${docSummary.id}`, "_blank");
        } else {
            navigate(paths.signIn);
        }
    }

    return (
        <div className="note-list-card-container" onClick={() => loadDoc()}>
            <div className="thumbnail-container">
                <img className="thumbnail" src={docSummary.thumbnail} alt="Thumbnail"/>
            </div>
            <div className="summary-container">
                <div className="summary-wrapper">
                    <div className="doc-id">{docSummary.id}</div>
                    <div className="summary-title">{docSummary.title}</div>
                    <div className="summary-date">{docSummary.lastModified}</div>
                </div>
            </div>
        </div>
    );
}

export default NoteListCard;