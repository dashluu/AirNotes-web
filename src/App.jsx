import "./App.scss";
import NavBar from "./navbar/NavBar.jsx";
import Card from "./card_grid/Card.jsx";
import CardGrid from "./card_grid/CardGrid.jsx";
import {useEffect, useState} from "react";
import {auth, docDAO, paths} from "./backend.js";
import {onAuthStateChanged} from "firebase/auth";
import {useNavigate} from "react-router-dom";

function App() {
    const navigate = useNavigate();
    const [getUnsubSummaryList, setUnsubSummaryList] = useState(null);
    const [getCardList, setCardList] = useState([]);

    async function fetchCardList(userId) {
        await docDAO.getDocSummaryPage(userId, 0, null)
            .then(([unsubSummaryList, summaryList]) => {
                const cardList = summaryList.map(
                    (summary, i) => <Card key={i}
                                          docId={summary.id}
                                          thumbnail={summary.thumbnail}
                                          title={summary.title}
                                          lastModified={summary.lastModified}/>
                );

                setUnsubSummaryList(unsubSummaryList);
                setCardList(cardList);
            });
    }

    useEffect(() => {
        const unsubUser = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchCardList(user.uid);
            } else {
                navigate(paths.signIn);
            }
        });

        return () => {
            unsubUser();

            if (getUnsubSummaryList) {
                getUnsubSummaryList();
            }
        };
    }, []);

    return (
        <div className="home-page">
            <NavBar/>
            <div className="home-container">
                <div className="toolbar">
                    <button className="toolbar-button new-button"
                            onClick={() => {
                                navigate(paths.newDoc);
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