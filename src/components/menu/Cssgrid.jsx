import { useState } from "react";

export const Cssgrid= ({ MyLineChart, MyScatterChart, MyBarChart, MyRadar }) => {
    const [isSwapped1, setIsSwapped1] = useState(true);
    const [isSwapped2, setIsSwapped2] = useState(true);
    const [isSwapped3, setIsSwapped3] = useState(true);

    const handleDoubleClick = () => {
        setIsSwapped1(!isSwapped1);
    };
    const handleDoubleClick2 = () => {
        setIsSwapped2(!isSwapped2);
    };
    const handleDoubleClick3 = () => {
        setIsSwapped3(!isSwapped3);
    };

    return(
        <div className="max-w-7xl mx-auto">

            <div className="grid md:grid-cols-4 auto-rows-[140px] gap-3 my-10">
                <div className ="bg-neutral-100 border-2 rounded-xl p-2 flex flex-col items-center justify-center md col-span-4 row-span-1">
                    <h2 className="text-xl text-gray-600"></h2>
                </div>
                <div className= {`bg-neutral-100 border-2 rounded-xl p-2 flex flex-col items-center justify-center ${!isSwapped2? "hidden": "col-span-1"} `}  >
                    <h2 className="text-xl text-gray-600">objet1</h2>
                </div>
                <div className= {`bg-neutral-100 border-2 rounded-xl p-2 flex flex-col items-center justify-center ${!isSwapped2? "hidden": "col-span-1"} `} >
                    <h2 className="text-xl text-gray-600">objet2</h2>
                </div>
                <div className={`bg-neutral-100 border-2 rounded-xl p-2 flex flex-col items-center justify-center ${isSwapped1 ? 'md col-span-2' : 'col-span-2 row-span-2'}`} onDoubleClick={() => handleDoubleClick()}>
                    <h2 className="text-xl text-gray-600">objet3</h2>
                </div>
                <div className={`bg-neutral-100 border-2 rounded-xl p-2 flex flex-col items-center justify-center md ${isSwapped2?'col-span-2': "col-span-2 row-span-2"}`} onDoubleClick={() => handleDoubleClick2()}>
                    <h2 className="text-xl text-gray-600">objet4</h2>
                </div>
                <div className={`bg-neutral-100 border-2 rounded-xl p-2 flex flex-col items-center justify-center ${!isSwapped1 ? 'md col-span-2 ' : 'col-span-2 row-span-2'} `} onDoubleClick={() => handleDoubleClick()}>
                    <h2 className="text-xl text-gray-600">objet5</h2>
                </div>
                <div className="bg-neutral-100 border-2 rounded-xl p-2 flex flex-col items-center justify-center md row-span-2">
                    <h2 className="text-xl text-gray-600">objet6</h2>
                </div>
                <div className="bg-neutral-100 border-2 rounded-xl p-2 flex flex-col items-center justify-center md row-span-2">
                    <h2 className="text-xl text-gray-600">objet7</h2>
                </div>
                <div className={`bg-neutral-100 border-2 rounded-xl p-2 flex flex-col items-center justify-center md ${isSwapped3?"col-span-2": "col-span-2 row-span-2"}`} onDoubleClick={() => handleDoubleClick3()}>
                    <h2 className="text-xl text-gray-600">objet8</h2>
                </div>
            </div>
        </div>
    );
};
