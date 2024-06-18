import './App.scss';
import NavBar from "./navbar/NavBar.jsx";
import Card from "./card/Card.jsx";
import {useLoaderData} from "react-router-dom";
import CardGrid from "./card/CardGrid.jsx";

function fetchCards() {
    const cards = [];

    for (let i = 0; i < 4; i++) {
        cards.push(
            <Card key={i}
                  title="Title 1234567845847 wjdjwdnjwndjnd jshdhjdhsjhdjshjdhsjhdjhsjdhjshdjhsjhdjshjdhsjhd"
                  thumbnail="/thumbnail.webp"
                  date="03/05/2024"
            />
        );
    }

    return cards;
}

export function loader() {
    const cards = fetchCards();
    return {cards};
}

function App() {
    const {cards} = useLoaderData();

    return (
        <div className="home-page">
            <NavBar/>
            <CardGrid topic="Technology" cards={cards} />
        </div>
    )
}

export default App;