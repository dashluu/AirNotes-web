import "./App.scss";
import NavBar from "./navbar/NavBar.jsx";
import Card from "./card_grid/Card.jsx";
import CardGrid from "./card_grid/CardGrid.jsx";
import {useEffect, useState} from "react";
import {auth, documentDAO, paths} from "./backend.js";
import {onAuthStateChanged} from "firebase/auth";
import {useNavigate} from "react-router-dom";

function App() {
    const navigate = useNavigate();
    const [getCardList, setCardList] = useState([]);

    async function fetchCardList(userId) {
        const documentSummaryList = await documentDAO.getDocumentSummaryList(userId, 0, null);

        const page = documentSummaryList.map(
            (documentSummary, i) => <Card key={i}
                                          thumbnail="/thumbnail.jpg"
                                          documentId={`${documentSummary.id}`}
                                          title={`${documentSummary.title}`}
                                          date={`${documentSummary.date}`}/>
        );

        setCardList(page);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchCardList(user.uid);
            } else {
                navigate(paths.signIn);
            }
        });

        return () => {
            unsubscribe();
        }
    }, []);

    return (
        <div className="home-page">
            <NavBar/>
            <div className="home-container">
                <div className="toolbar">
                    <button className="toolbar-button new-button"
                            onClick={() => {
                                navigate(paths.newDocument);
                            }}
                            title="New">
                        <span className="material-symbols-outlined">edit_square</span>
                    </button>
                </div>
                <CardGrid cards={getCardList}/>
            </div>
        </div>
    )
}

export default App;