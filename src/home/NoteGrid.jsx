import "./NoteGrid.scss";

function NoteGrid({cards}) {
    return (
        <div className="note-grid-container">
            <div className="note-grid">
                {cards}
            </div>
        </div>
    );
}

export default NoteGrid;
