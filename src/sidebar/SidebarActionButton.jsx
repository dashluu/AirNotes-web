import "./SidebarActionButton.scss";

function SidebarActionButton({icon, text, click, disabled = false}) {
    return (
        <button className="sidebar-action-button" disabled={disabled}
                onClick={click}>
            <span className="material-symbols-outlined">{icon}</span>
            <span>{text}</span>
        </button>
    )
}

export default SidebarActionButton;