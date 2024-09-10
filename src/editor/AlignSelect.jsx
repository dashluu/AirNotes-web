import {useRef} from "react";

function AlignSelect({editor}) {
    const alignRef = useRef(null);

    function selectAlign() {
        if (alignRef.current.value === "left") {
            editor.chain().focus().setTextAlign("left").run();
        } else if (alignRef.current.value === "center") {
            editor.chain().focus().setTextAlign("center").run();
        } else {
            editor.chain().focus().setTextAlign("right").run();
        }
    }

    return (
        <select name="align" ref={alignRef} onChange={selectAlign}>
            <option value="left" selected={editor.isActive({textAlign: "left"})}>Left</option>
            <option value="center" selected={editor.isActive({textAlign: "center"})}>Center</option>
            <option value="right" selected={editor.isActive({textAlign: "right"})}>Right</option>
        </select>
    );
}

export default AlignSelect;