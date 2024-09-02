import "./NoteGridCard.scss";
import {useNavigate} from "react-router-dom";

const NoteGridCard = ({docSummary}) => {
    const navigate = useNavigate();

    return (
        <div className="note-grid-card-container"
             onClick={() => {
                 navigate(`/notes/${docSummary.id}`);
             }}
        >
            <div className="thumbnail-container">
                <img className="thumbnail" src={docSummary.thumbnail} alt="Thumbnail"/>
            </div>
            <div className="summary-container">
                <div className="doc-id">{docSummary.id}</div>
                <div className="summary-title">{docSummary.title}</div>
                <div className="summary-date">{docSummary.lastModified}</div>
            </div>
        </div>
    );
}

export default NoteGridCard;
