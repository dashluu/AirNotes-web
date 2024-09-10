import "./EditorMenuWrapper.scss";
import "./BubbleMenuWrapper.scss";
import {BubbleMenu} from "@tiptap/react";
import EditorMenuButton from "./EditorMenuButton.jsx";
import {useRef} from "react";

function BubbleMenuWrapper({editor, showSummary, showQA}) {
    const headingRef = useRef(null);
    const alignRef = useRef(null);
    const listRef = useRef(null);

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

    function selectAlign() {
        if (alignRef.current.value === "left") {
            editor.chain().focus().setTextAlign("left").run();
        } else if (alignRef.current.value === "center") {
            editor.chain().focus().setTextAlign("center").run();
        } else {
            editor.chain().focus().setTextAlign("right").run();
        }
    }

    function selectList() {
        if (listRef.current.value === "bulleted") {
            editor.chain().focus().toggleBulletList().run();
        } else if (listRef.current.value === "ordered") {
            editor.chain().focus().toggleOrderedList().run();
        } else if (listRef.current.value === "task") {
            editor.chain().focus().toggleTaskList().run();
        } else if (editor.isActive("bulletList")) {
            editor.chain().focus().toggleBulletList().run();
        } else if (editor.isActive("orderedList")) {
            editor.chain().focus().toggleOrderedList().run();
        } else if (editor.isActive("taskList")) {
            editor.chain().focus().toggleTaskList().run();
        }
    }

    return (
        <BubbleMenu editor={editor} tippyOptions={{duration: 100}}>
            <div className="editor-menu">
                <select name="headings" ref={headingRef} onChange={selectHeading}>
                    <option value="noHeading">No heading</option>
                    <option value="heading1" selected={editor.isActive("heading", {level: 1})}>Heading 1</option>
                    <option value="heading2" selected={editor.isActive("heading", {level: 2})}>Heading 2</option>
                    <option value="heading3" selected={editor.isActive("heading", {level: 3})}>Heading 3</option>
                </select>
                <EditorMenuButton title="Bold" icon="format_bold"
                                  className={editor.isActive("bold") ? "editor-menu-button-active" : "editor-menu-button"}
                                  click={() => editor.chain().focus().toggleBold().run()}/>
                <EditorMenuButton title="Italic" icon="format_italic"
                                  className={editor.isActive("italic") ? "editor-menu-button-active" : "editor-menu-button"}
                                  click={() => editor.chain().focus().toggleItalic().run()}/>
                <EditorMenuButton title="Underline" icon="format_underlined"
                                  className={`underline-button ${editor.isActive("underline") ? "editor-menu-button-active" : "editor-menu-button"}`}
                                  click={() => editor.chain().focus().toggleUnderline().run()}/>
                <select name="align" ref={alignRef} onChange={selectAlign}>
                    <option value="left" selected={editor.isActive({textAlign: "left"})}>Left</option>
                    <option value="center" selected={editor.isActive({textAlign: "center"})}>Center</option>
                    <option value="right" selected={editor.isActive({textAlign: "right"})}>Right</option>
                </select>
                <select name="lists" ref={listRef} onChange={selectList}>
                    <option value="noList">No list</option>
                    <option value="bulleted" selected={editor.isActive("bulletList")}>Bulleted</option>
                    <option value="ordered" selected={editor.isActive("orderedList")}>Numbered</option>
                    <option value="task" selected={editor.isActive("taskList")}>Task</option>
                </select>
                <EditorMenuButton title="Code Block" icon="code"
                                  className={editor.isActive("codeBlock") ? "editor-menu-button-active" : "editor-menu-button"}
                                  click={() => editor.chain().focus().toggleCodeBlock().run()}/>
                <EditorMenuButton title="Summarize" icon="notes" className="editor-menu-button"
                                  click={() => showSummary()}/>
                <EditorMenuButton title="Q&A" icon="quiz" className="editor-menu-button"
                                  click={() => showQA()}/>
            </div>
        </BubbleMenu>
    );
}

export default BubbleMenuWrapper;