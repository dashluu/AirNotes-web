import "./NoteGridCard.scss";
import {useNavigate} from "react-router-dom";
import {paths, docDAO} from "../backend.js";

const NoteGridCard = ({docSummary}) => {
    const navigate = useNavigate();

    async function accessDoc(docId) {
        try {
            await docDAO.accessFullDoc(docId);
            navigate(`/notes/${docId}`);
        } catch (err) {
            navigate(paths.error);
        }
    }

    return (
        <div className="note-grid-card-container"
             onClick={() => {
                 accessDoc(docSummary.id);
             }}>
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
