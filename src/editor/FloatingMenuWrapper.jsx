import "./EditorMenuWrapper.scss";
import {FloatingMenu} from "@tiptap/react";
import EditorMenuButton from "./EditorMenuButton.jsx";

function FloatingMenuWrapper({editor}) {
    return (
        <FloatingMenu editor={editor} tippyOptions={{duration: 100}}>
            <div className="editor-menu">
                <EditorMenuButton title="List" icon="format_list_bulleted"
                                  className={editor.isActive("bulletList") ? "editor-menu-button-active" : "editor-menu-button"}
                                  click={() => editor.chain().focus().toggleBulletList().run()}/>
                <EditorMenuButton title="Code Block" icon="code"
                                  className={editor.isActive("codeBlock") ? "editor-menu-button-active" : "editor-menu-button"}
                                  click={() => editor.chain().focus().toggleCodeBlock().run()}/>
                <EditorMenuButton title="Tasks" icon="task_alt"
                                  className={editor.isActive("taskList") ? "editor-menu-button-active" : "editor-menu-button"}
                                  click={() => editor.chain().focus().toggleTaskList().run()}/>
            </div>
        </FloatingMenu>
    );
}

export default FloatingMenuWrapper;