import Game from "../../components/games/click-the-target/Game";

const ClickTheTarget = () => {
    return (
        <div> 
            <p className="p-4 font-bold text-center">Click the target as many times as you can in the given time!</p>
            <Game />
        </div>
    );
}

export default ClickTheTarget;