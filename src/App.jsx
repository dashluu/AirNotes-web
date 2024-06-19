import "./App.scss";
import NavBar from "./navbar/NavBar.jsx";
import Card from "./card/Card.jsx";
import CardGrid from "./card/CardGrid.jsx";
import {useEffect, useState} from "react";
import {documentDAO, auth} from "./firebase.js";
import DocumentDAO from "./editor/DocumentDAO.jsx";
import {onAuthStateChanged} from "firebase/auth";

function App() {
    const [getPage, setPage] = useState([]);

    async function fetchPage() {
        await onAuthStateChanged(auth, async (user) => {
            const documentSummaryList = await documentDAO.getDocumentSummaryList(user.uid, 0);
            const page = []

            for (let i = 0; i < DocumentDAO.documentsPerPage; i++) {
                page.push(
                    <Card key={i}
                          title={`${documentSummaryList[i].title}`}
                          thumbnail="/thumbnail.jpg"
                          date={`${documentSummaryList[i].date}`}
                    />
                );
            }

            setPage(page);
        });
    }

    useEffect(() => {
        fetchPage();
    }, []);

    return (
        <div className="home-page">
            <NavBar/>
            <CardGrid topic="Technology" cards={getPage}/>
        </div>
    )
}

export default App;