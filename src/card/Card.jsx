import "./Card.scss";

const Card = ({thumbnail, title, date}) => {
    return (
        <div className="card-container"

             onMouseEnter={(e) => {
                 const thumbnailElm = e.currentTarget.querySelector(".thumbnail");
                 const dateElm = e.currentTarget.querySelector(".summary-date");
                 thumbnailElm.classList.add("thumbnail-hover");
                 dateElm.classList.add("summary-date-hover");
             }}

             onMouseLeave={(e) => {
                 const thumbnailElm = e.currentTarget.querySelector(".thumbnail");
                 const dateElm = e.currentTarget.querySelector(".summary-date");
                 thumbnailElm.classList.remove("thumbnail-hover");
                 dateElm.classList.remove("summary-date-hover");
             }}
        >
            <div className="thumbnail-container">
                <img className="thumbnail" src={thumbnail} alt=""/>
            </div>
            <div className="summary-container">
                <div className="summary-wrapper">
                    <div className="summary-title">{title}</div>
                    <div className="summary-date">{date}</div>
                </div>
            </div>
        </div>
    )
}

export default Card;
