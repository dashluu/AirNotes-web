import "./NoteListCard.scss";
import {paths} from "../backend.js";
import {useNavigate} from "react-router-dom";

function NoteListCard({user, docSummary}) {
    const navigate = useNavigate();

    function loadDoc() {
        if (user) {
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