import 'react-circular-progressbar/dist/styles.css';
import {useState} from "react";
import {CancelablePromise} from "../api";
import {useInterval} from 'usehooks-ts'
import {PixelGrid} from "./PixelGrid"

function hslToHex(h: number, s: number, l: number) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

function getHue(nowTemp: number) {
    var maxHsl = 90; // maxHsl maps to max temp (here: 20deg past 360)
    var minHsl = 0; //  minhsl maps to min temp counter clockwise
    var maxTemp = 30;
    var minTemp = 0;

    const hslsDeg = (maxHsl - minHsl) / (maxTemp - minTemp);  //210 / 125 = 1.68 Hsl-degs to Temp-degs
    return (360 - (((maxTemp - nowTemp) * hslsDeg) - (maxHsl - 360)));
}


export const PixelGridCard = ({width, height, title, promiseGenerator}: {
    width: number,
    height: number,
    title: string,
    promiseGenerator: () => CancelablePromise<any>,
}) => {
    const [value, setValue] = useState<Array<number>>()
    const [loading, setLoading] = useState(false);
    useInterval(
        () => {
            // Your custom logic here
            setLoading(true)
            promiseGenerator()
                .then((response) => response)
                .then((val) => {
                    //console.log(val + " " + getHue(val[0]))
                    setLoading(false);
                    setValue(val.map((s: number) => hslToHex(getHue(s), 100, 50)));
                });
        },
        // Delay in milliseconds or null to stop it
        loading ? null : 5000,
    )

    if (!value) return <div></div>

    return (
        <div className="bg-gray-100 px-6 py-4 rounded-md grid grid-cols-1 divide-y w-max">
            <h5 className="text-md text-gray-900 dark:text-white mb-3 ">{title}</h5>
            <div className={"pt-4"}>
                <PixelGrid
                    //data={Array(32*24).fill(0).map(Math.random)}
                    data={value}
                    options={{
                        rows: height,
                        columns: width,
                        size: 12,
                        padding: 0
                    }}
                />
            </div>

        </div>
    )
}