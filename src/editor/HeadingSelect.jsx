import {useRef} from "react";

function HeadingSelect({editor}) {
    const headingRef = useRef(null);

    function selectHeading() {
        if (headingRef.current.value === "heading1") {
            editor.chain().focus().toggleHeading({level: 1}).run();
        } else if (headingRef.current.value === "heading2") {
            editor.chain().focus().toggleHeading({level: 2}).run();
        } else if (headingRef.current.value === "heading3") {
            editor.chain().focus().toggleHeading({level: 3}).run();
        } else if (editor.isActive("heading", {level: 1})) {
            editor.chain().focus().toggleHeading({level: 1}).run();
        } else if (editor.isActive("heading", {level: 2})) {
            editor.chain().focus().toggleHeading({level: 2}).run();
        } else if (editor.isActive("heading", {level: 3})) {
            editor.chain().focus().toggleHeading({level: 3}).run();
        }
    }

    return (
        <select name="headings" ref={headingRef} onChange={selectHeading}>
            <option value="noHeading">No heading</option>
            <option value="heading1" selected={editor.isActive("heading", {level: 1})}>Heading 1</option>
            <option value="heading2" selected={editor.isActive("heading", {level: 2})}>Heading 2</option>
            <option value="heading3" selected={editor.isActive("heading", {level: 3})}>Heading 3</option>
        </select>
    );
}

export default HeadingSelect;