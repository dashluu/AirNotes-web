import "./FloatingMenuWrapper.scss";
import {FloatingMenu} from "@tiptap/react";

function FloatingMenuWrapper({editor}) {
    return (
        <FloatingMenu editor={editor} tippyOptions={{duration: 100}}>
            <div className="floating-menu">
                <button title="List"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`${editor.isActive("bulletList") ? "floating-menu-button-is-active" : ""}`}>
                    <span className="material-symbols-outlined">format_list_bulleted</span>
                </button>
                <button title="Code Block"
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        className={`${editor.isActive("bulletList") ? "floating-menu-button-is-active" : ""}`}>
                    <span className="material-symbols-outlined">code</span>
                </button>
            </div>
        </FloatingMenu>
    );
}

export default FloatingMenuWrapper;