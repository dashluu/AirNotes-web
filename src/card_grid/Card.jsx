import "./Card.scss";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

const Card = ({docSummary}) => {
    const navigate = useNavigate();
    const [getDateClass, setDateClass] = useState("summary-date");

    return (
        <div className="card-container"
             onClick={() => {
                 navigate(`/notes/${docSummary.id}`);
             }}
             onMouseEnter={() => {
                 setDateClass("summary-date-hover");
             }}
             onMouseLeave={() => {
                 setDateClass("summary-date");
             }}
        >
            <div className="thumbnail-container">
                <img className="thumbnail" src={docSummary.thumbnail} alt="Thumbnail"/>
            </div>
            <div className="summary-container">
                <div className="doc-id">{docSummary.id}</div>
                <div className="summary-title">{docSummary.title}</div>
                <div className={getDateClass}>{docSummary.lastModified}</div>
            </div>
        </div>
    );
}

export default Card;
