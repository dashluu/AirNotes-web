import "./EditorMenuWrapper.scss";
import {FloatingMenu} from "@tiptap/react";
import EditorMenuButton from "./EditorMenuButton.jsx";
import ListSelect from "./ListSelect.jsx";
import HeadingSelect from "./HeadingSelect.jsx";
import AlignSelect from "./AlignSelect.jsx";

function FloatingMenuWrapper({editor}) {
    return (
        <FloatingMenu editor={editor} tippyOptions={{duration: 100}}>
            <div className="editor-menu">
                <HeadingSelect editor={editor}/>
                <EditorMenuButton title="Bold" icon="format_bold"
                                  className={editor.isActive("bold") ? "editor-menu-button-active" : "editor-menu-button"}
                                  click={() => editor.chain().focus().toggleBold().run()}/>
                <EditorMenuButton title="Italic" icon="format_italic"
                                  className={editor.isActive("italic") ? "editor-menu-button-active" : "editor-menu-button"}
                                  click={() => editor.chain().focus().toggleItalic().run()}/>
                <EditorMenuButton title="Underline" icon="format_underlined"
                                  className={`underline-button ${editor.isActive("underline") ? "editor-menu-button-active" : "editor-menu-button"}`}
                                  click={() => editor.chain().focus().toggleUnderline().run()}/>
                <AlignSelect editor={editor}/>
                <ListSelect editor={editor}/>
                <EditorMenuButton title="Code Block" icon="code"
                                  className={editor.isActive("codeBlock") ? "editor-menu-button-active" : "editor-menu-button"}
                                  click={() => editor.chain().focus().toggleCodeBlock().run()}/>
            </div>
        </FloatingMenu>
    );
}

export default FloatingMenuWrapper;