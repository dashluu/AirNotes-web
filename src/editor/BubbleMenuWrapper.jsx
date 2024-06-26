import "./BubbleMenuWrapper.scss";
import {BubbleMenu} from "@tiptap/react";

function BubbleMenuWrapper({editor}) {
    return (
        <BubbleMenu editor={editor} tippyOptions={{duration: 100}}>
            <div className="bubble-menu">
                <button title="Bold"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={editor.isActive("bold") ? "bubble-menu-button-is-active" : ""}>
                    <strong>B</strong>
                </button>
                <button title="Italic"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`${editor.isActive("italic") ? "bubble-menu-button-is-active" : ""}`}>
                    I
                </button>
                <button title="Underline"
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={`${editor.isActive("underline") ? "bubble-menu-button-is-active" : ""}`}>
                    U
                </button>
                <button title="List"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`${editor.isActive("bulletList") ? "bubble-menu-button-is-active" : ""}`}>
                    <span className="material-symbols-outlined">format_list_bulleted</span>
                </button>
                <button title="Code Block"
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        className={`${editor.isActive("bulletList") ? "bubble-menu-button-is-active" : ""}`}>
                    <span className="material-symbols-outlined">code</span>
                </button>
            </div>
        </BubbleMenu>
    );
}

export default BubbleMenuWrapper;