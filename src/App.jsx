import "./App.scss";
import NavBar from "./navbar/NavBar.jsx";
import Card from "./card_grid/Card.jsx";
import CardGrid from "./card_grid/CardGrid.jsx";
import {useEffect, useState} from "react";
import {auth, documentDAO} from "./firebase.js";
import {onAuthStateChanged} from "firebase/auth";
import {useNavigate} from "react-router-dom";

function App() {
    const navigate = useNavigate();
    const [getCardList, setCardList] = useState([]);

    async function fetchCardList(userId) {
        const documentSummaryList = await documentDAO.getDocumentSummaryList(userId, 0, null);
        const page = []

        for (let i = 0; i < documentSummaryList.length; i++) {
            page.push(
                <Card key={i}
                      thumbnail="/thumbnail.jpg"
                      documentId={`${documentSummaryList[i].id}`}
                      title={`${documentSummaryList[i].title}`}
                      date={`${documentSummaryList[i].date}`}
                />
            );
        }

        setCardList(page);
    }

    useEffect(() => {
        return () => {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    fetchCardList(user.uid);
                } else {
                    navigate("/sign-in");
                }
            });
        }
    }, []);

    return (
        <div className="home-page">
            <NavBar/>
            <div className="home-container">
                <div className="toolbar">
                    <button className="toolbar-button new-button"
                            onClick={() => navigate("/new")}
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