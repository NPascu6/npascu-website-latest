import React from "react";

const Snake2 = () => {
    return <svg xmlns="http://www.w3.org/2000/svg"
                width="34" height="34"
                viewBox="0 0 64 64" id="snake">
        <path fill="#a0c432"
              d="M38.69,43H26a10,10,0,0,1-9.39-6.58L11.92,23.53A15.24,15.24,0,0,1,11,18.3h0A15.3,15.3,0,0,1,26.3,3H37.7A15.3,15.3,0,0,1,53,18.3v.32a15.19,15.19,0,0,1-.72,4.64L48.22,36A10,10,0,0,1,38.69,43Z">
        </path>
        <circle cx="43.5" cy="20.5" r="1.5" fill="#2d2d2d">
        </circle>
        <circle cx="20.5" cy="20.5" r="1.5" fill="#2d2d2d"></circle>
        <path fill="#e71b3f" d="M38,61l-6-4-6,4h0a15,15,0,0,0,3-9V43h6v9a15,15,0,0,0,3,9Z"></path>
        <path fill="#586c1c"
              d="M24 40a1 1 0 0 1-.71-.29l-1-1a1 1 0 0 1 1.42-1.42l1 1a1 1 0 0 1 0 1.42A1 1 0 0 1 24 40zM40 40a1 1 0 0 1-.71-.29 1 1 0 0 1 0-1.42l1-1a1 1 0 0 1 1.42 1.42l-1 1A1 1 0 0 1 40 40z"></path>
    </svg>
}

export default React.memo(Snake2);