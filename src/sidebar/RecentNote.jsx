import "./RecentNote.scss";
import {useState} from "react";

function RecentNote({docSummary}) {
    const [getThumbnailClass, setThumbnailClass] = useState("thumbnail");
    const [getDateClass, setDateClass] = useState("summary-date");

    return (
        <div className="recent-note-container"
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
                <button className="action-button"
                        onClick={() => {
                            window.open(`/notes/${docSummary.id}`, "_blank");
                        }}>
                    Open in new tab
                </button>
            </div>
        </div>
    );
}

export default RecentNote;