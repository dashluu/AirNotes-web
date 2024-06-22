import "./TextGenPopup.scss";
import {useEffect, useState} from "react";

function TextGenPopup({text, closePopup}) {
    const [getText, setText] = useState(text);

    useEffect(() => {
        setText(text);
    }, [text]);

    async function copySummaryText() {
        await navigator.clipboard.writeText(getText);
    }

    return (
        <div className="text-gen-popup">
            <div className="text-gen-container">
                <div className="text-container">{text}</div>
                <div className="action-container">
                    <button className="action-button copy-button"
                            onClick={() => {
                                copySummaryText();
                            }}>
                        Copy
                    </button>
                    <button className="action-button close-button"
                            onClick={() => {
                                closePopup();
                            }}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TextGenPopup;