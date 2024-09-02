import "./EditorMenuButton.scss";

function EditorMenuButton({title, icon, click, className = ""}) {
    return (
        <button title={title}
                className={className}
                onClick={click}>
            <span className="material-symbols-outlined">{icon}</span>
        </button>
    )
}

export default EditorMenuButton;