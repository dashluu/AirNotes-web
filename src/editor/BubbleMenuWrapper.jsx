import "./EditorMenuWrapper.scss";
import "./BubbleMenuWrapper.scss";
import {BubbleMenu} from "@tiptap/react";
import EditorMenuButton from "./EditorMenuButton.jsx";

function BubbleMenuWrapper({editor, showSummary}) {
    return (
        <BubbleMenu editor={editor} tippyOptions={{duration: 100}}>
            <div className="editor-menu">
                <EditorMenuButton title="Heading 1" icon="format_h1"
                                  className={editor.isActive("heading", {level: 1}) ? "editor-menu-button-active" : "editor-menu-button"}
                                  click={() => editor.chain().focus().toggleHeading({level: 1}).run()}/>
                <EditorMenuButton title="Heading 2" icon="format_h2"
                                  className={editor.isActive("heading", {level: 2}) ? "editor-menu-button-active" : "editor-menu-button"}
                                  click={() => editor.chain().focus().toggleHeading({level: 2}).run()}/>
                <EditorMenuButton title="Heading 3" icon="format_h3"
                                  className={editor.isActive("heading", {level: 3}) ? "editor-menu-button-active" : "editor-menu-button"}
                                  click={() => editor.chain().focus().toggleHeading({level: 3}).run()}/>
                <EditorMenuButton title="Bold" icon="format_bold"
                                  className={editor.isActive("bold") ? "editor-menu-button-active" : "editor-menu-button"}
                                  click={() => editor.chain().focus().toggleBold().run()}/>
                <EditorMenuButton title="Italic" icon="format_italic"
                                  className={editor.isActive("italic") ? "editor-menu-button-active" : "editor-menu-button"}
                                  click={() => editor.chain().focus().toggleItalic().run()}/>
                <EditorMenuButton title="Underline" icon="format_underlined"
                                  className={`underline-button ${editor.isActive("underline") ? "editor-menu-button-active" : "editor-menu-button"}`}
                                  click={() => editor.chain().focus().toggleUnderline().run()}/>
                <EditorMenuButton title="Left" icon="format_align_left"
                                  className={`${editor.isActive({textAlign: "left"}) ? "editor-menu-button-active" : "editor-menu-button"}`}
                                  click={() => editor.chain().focus().setTextAlign("left").run()}/>
                <EditorMenuButton title="Center" icon="format_align_center"
                                  className={`${editor.isActive({textAlign: "center"}) ? "editor-menu-button-active" : "editor-menu-button"}`}
                                  click={() => editor.chain().focus().setTextAlign("center").run()}/>
                <EditorMenuButton title="Right" icon="format_align_right"
                                  className={`${editor.isActive({textAlign: "right"}) ? "editor-menu-button-active" : "editor-menu-button"}`}
                                  click={() => editor.chain().focus().setTextAlign("right").run()}/>
                <EditorMenuButton title="List" icon="format_list_bulleted"
                                  className={editor.isActive("bulletList") ? "editor-menu-button-active" : "editor-menu-button"}
                                  click={() => editor.chain().focus().toggleBulletList().run()}/>
                <EditorMenuButton title="Tasks" icon="task_alt"
                                  className={editor.isActive("taskList") ? "editor-menu-button-active" : "editor-menu-button"}
                                  click={() => editor.chain().focus().toggleTaskList().run()}/>
                <EditorMenuButton title="Code Block" icon="code"
                                  className={editor.isActive("codeBlock") ? "editor-menu-button-active" : "editor-menu-button"}
                                  click={() => editor.chain().focus().toggleCodeBlock().run()}/>
                <EditorMenuButton title="Summarize" icon="notes" className="editor-menu-button"
                                  click={() => {
                                      editor.chain().focus();
                                      showSummary(true);
                                  }}/>
                <select name="cars" id="cars">
                    <option value="volvo">Volvo</option>
                    <option value="saab">Saab</option>
                    <option value="opel">Opel</option>
                    <option value="audi">Audi</option>
                </select>
            </div>
        </BubbleMenu>
    );
}

export default BubbleMenuWrapper;