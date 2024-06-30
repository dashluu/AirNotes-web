import "./RecentNote.scss";
import {useState} from "react";

function RecentNote({docId, thumbnail, title, lastModiffied}) {
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
                <img className={getThumbnailClass} src={thumbnail} alt="Thumbnail"/>
            </div>
            <div className="summary-container">
                <div className="doc-id">{docId}</div>
                <div className="summary-title">{title}</div>
                <div className={getDateClass}>{lastModiffied}</div>
                <button className="action-button"
                        onClick={() => {
                            window.open(`/notes/${docId}`, "_blank");
                        }}>
                    Open in new tab
                </button>
            </div>
        </div>
    );
}

export default RecentNote;