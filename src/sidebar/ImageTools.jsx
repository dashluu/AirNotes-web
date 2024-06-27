import "./ImageTools.scss";

function ImageTools({editor}) {
    function addImageByUrl(url) {
        editor.chain().focus().setImage({src: url}).run();
    }

    return (
        <div className="image-tools-container">
            <div className="title">Notes Image</div>
            <input type="text" className="image-url" placeholder="Enter URL..."/>
            <button className="action-button image-url-button"
                    onClick={() => {
                    }}>
                Add image
            </button>
        </div>
    );
}

export default ImageTools;