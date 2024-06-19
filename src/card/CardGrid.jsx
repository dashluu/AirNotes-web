import "./CardGrid.scss";

function CardGrid({cards}) {
    return (
        <div className="card-grid-container">
            <div className="card-grid">
                {cards}
            </div>
        </div>
    )
}

export default CardGrid;
