import "./NavButton.scss";

function NavButton({icon, text, click, style = {}}) {
    return (
        <button className="nav-button" style={style} onClick={click}>
            <span className="material-symbols-outlined">{icon}</span>
            <span>{text}</span>
        </button>
    )
}

export default NavButton;