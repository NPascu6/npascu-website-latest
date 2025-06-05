import React from 'react';

interface SVGPathProps {
    id?: string;
    fill?: string;
}

const SVGPath: React.FC<SVGPathProps> = ({id = 'logotype-s-47', fill = '#ed0007'}) => {
    const pathData = "M294.2,41.38l-2.2-.5c-5.4-1.1-9.7-2.5-9.7-6.4,0-4.2,4.1-5.9,7.7-5.9a17.86,17.86,0,0,1,13,5.9l9.9-9.8c-4.5-5.1-11.8-10-23.2-10-13.4,0-23.6,7.5-23.6,20,0,11.4,8.2,17,18.2,19.1l2.2.5c8.3,1.7,11.4,3,11.4,7,0,3.8-3.4,6.3-8.6,6.3-6.2,0-11.8-2.7-16.1-8.2l-10.1,10c5.6,6.7,12.7,11.9,26.4,11.9,11.9,0,24.6-6.8,24.6-20.7C314.3,46.08,303.3,43.28,294.2,41.38Z";
    const style = {fill: fill, fillRule: 'evenodd'};

    return (
        <img
            style={{height: '2em', width: '70%'}}
            src="https://s19531.pcdn.co/wp-content/uploads/2017/12/bosch-wiper-blade-1221600.jpg"
            loading="lazy"
        />
    );
};

export default SVGPath;