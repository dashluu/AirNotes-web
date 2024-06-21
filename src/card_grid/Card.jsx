import "./Card.scss";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

const Card = ({thumbnail, documentId, title, date}) => {
    const navigate = useNavigate();
    const [getThumbnailClass, setThumbnailClass] = useState("thumbnail");
    const [getDateClass, setDateClass] = useState("summary-date");

    return (
        <div className="card-container"
             onClick={() => {
                 navigate(`/notes/${documentId}`);
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
                <img className={`${getThumbnailClass}`} src={thumbnail} alt=""/>
            </div>
            <div className="summary-container">
                <div className="summary-wrapper">
                    <div className="summary-id">{documentId}</div>
                    <div className="summary-title">{title}</div>
                    <div className={`${getDateClass}`}>{date}</div>
                </div>
            </div>
        </div>
    );
}

export default Card;
