import {useRef} from "react";

function ListSelect({editor}) {
    const listRef = useRef(null);

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
        <select name="lists" ref={listRef} onChange={selectList}>
            <option value="noList">No list</option>
            <option value="bulleted" selected={editor.isActive("bulletList")}>Bulleted</option>
            <option value="ordered" selected={editor.isActive("orderedList")}>Numbered</option>
            <option value="task" selected={editor.isActive("taskList")}>Task</option>
        </select>
    );
}

export default ListSelect;