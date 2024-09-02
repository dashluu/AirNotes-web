import "./ToolbarButton.scss";

function ToolbarButton({title, icon, click, style = {}, disabled = false}) {
    return (
        <button className="toolbar-button"
                title={title}
                style={style}
                disabled={disabled}
                onClick={click}>
            <span className="material-symbols-outlined">{icon}</span>
        </button>
    )
}

export default ToolbarButton;