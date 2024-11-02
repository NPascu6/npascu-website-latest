import {useNavigate} from "react-router-dom";
import Game from "../../components/games/click-the-target/Game";
import React from "react";
import CloseIcon from "../../assets/icons/CloseIcon";

const ClickTheTarget = () => {
    const navigation = useNavigate();
    const [started, setStarted] = React.useState<boolean>(false);

    return (
        <div>
            {!started && <div className="flex flex-row w-full justify-between">
                <p className="p-4 font-bold text-center">Click the target as many times as you can in the given
                    time!</p>
                <span className="p-2" onClick={() => navigation('/')}>
                    <CloseIcon/>
                </span>
            </div>}
            <Game setStarted={setStarted}/>
        </div>
    );
}

export default ClickTheTarget;