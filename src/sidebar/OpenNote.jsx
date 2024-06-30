import "./OpenNote.scss";
import {useEffect, useState} from "react";
import RecentNote from "./RecentNote.jsx";

function OpenNote() {
    const [getRecentNoteList, setRecentNoteList] = useState([]);

    useEffect(() => {
        const recentNoteList = [];

        for (let i = 0; i < 4; i++) {
            recentNoteList.push(<RecentNote key={i}
                                            docId=""
                                            thumbnail="https://firebasestorage.googleapis.com/v0/b/airnotes-8ae79.appspot.com/o/files%2Fthumbnail.jpg?alt=media&token=30c22fd4-197d-4dcc-8058-cda1effc4442"
                                            title="Hellojsndjsndjsndsjdnjsndjsndjsndjnsdjnsjdnjsdhhdbhfbdhfbdhfbhdbfhdbf"
                                            lastModiffied="06/30/2024"/>);
        }

        setRecentNoteList(recentNoteList);
    }, []);

    return (
        <div className="open-note-container">
            {getRecentNoteList}
        </div>
    );
}

export default OpenNote;