import "./Card.scss";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

const Card = ({docId, thumbnail, title, lastModified}) => {
    const navigate = useNavigate();
    const [getThumbnailClass, setThumbnailClass] = useState("thumbnail");
    const [getDateClass, setDateClass] = useState("summary-date");

    return (
        <div className="card-container"
             onClick={() => {
                 navigate(`/notes/${docId}`);
             }}
             onMouseEnter={() => {
                 setThumbnailClass("thumbnail-hover");
                 setDateClass("summary-date-hover");
             }}
             onMouseLeave={() => {
                 setThumbnailClass("thumbnail");
                 setDateClass("summary-date");
             }}
        >
            <div className="thumbnail-container">
                <img className={getThumbnailClass} src={thumbnail} alt="Thumbnail"/>
            </div>
            <div className="summary-container">
                <div className="doc-id">{docId}</div>
                <div className="summary-title">{title}</div>
                <div className={getDateClass}>{lastModified}</div>
            </div>
        </div>
    );
}

export default Card;
