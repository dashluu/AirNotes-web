import "./ImageTools.scss";
import {useState} from "react";

function ImageTools({editor}) {
    const [getImgUrl, setImgUrl] = useState("");

    function addImgByUrl(url) {
        editor.chain().focus().setImage({src: url}).run();
    }

    return (
        <div className="img-tools-container">
            <div className="title">Notes Image</div>
            <input type="text" className="img-url" placeholder="Enter URL..."
                   onChange={(e) => {
                       setImgUrl(e.target.value);
                   }}/>
            <button className="action-button add-img-by-url-button"
                    onClick={() => {
                        addImgByUrl(getImgUrl);
                    }}>
                Add image
            </button>
        </div>
    );
}

export default ImageTools;