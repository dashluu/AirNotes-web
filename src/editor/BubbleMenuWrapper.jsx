import "./EditorMenuWrapper.scss";
import "./BubbleMenuWrapper.scss";
import {BubbleMenu} from "@tiptap/react";
import EditorMenuButton from "./EditorMenuButton.jsx";

function BubbleMenuWrapper({editor, showSummary}) {
    return (
        <BubbleMenu editor={editor} tippyOptions={{duration: 100}}>
            <div className="editor-menu">
                <EditorMenuButton title="Bold" icon="format_bold"
                                  className={editor.isActive("bold") ? "editor-menu-button-active" : "editor-menu-button"}
                                  click={() => editor.chain().focus().toggleBold().run()}/>
                <EditorMenuButton title="Italic" icon="format_italic"
                                  className={editor.isActive("italic") ? "editor-menu-button-active" : "editor-menu-button"}
                                  click={() => editor.chain().focus().toggleItalic().run()}/>
                <EditorMenuButton title="Underline" icon="format_underlined"
                                  className={`underline-button ${editor.isActive("underline") ? "editor-menu-button-active" : "editor-menu-button"}`}
                                  click={() => editor.chain().focus().toggleUnderline().run()}/>
                <EditorMenuButton title="List" icon="format_list_bulleted"
                                  className={editor.isActive("bulletList") ? "editor-menu-button-active" : "editor-menu-button"}
                                  click={() => editor.chain().focus().toggleBulletList().run()}/>
                <EditorMenuButton title="Code Block" icon="code"
                                  className={editor.isActive("codeBlock") ? "editor-menu-button-active" : "editor-menu-button"}
                                  click={() => editor.chain().focus().toggleCodeBlock().run()}/>
                <EditorMenuButton title="Summarize" icon="notes" className="editor-menu-button"
                                  click={() => showSummary(true)}/>
            </div>
        </BubbleMenu>
    );
}

export default BubbleMenuWrapper;