import 'react-circular-progressbar/dist/styles.css';
import {useEffect, useRef, useState} from "react";
import {CancelablePromise} from "../api";
import {useInterval} from 'usehooks-ts'

function hsl2rgba(h: number, s: number, l: number) {
    let a = s * Math.min(l, 1 - l);
    let f = (n: number, k: number = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return [255 * f(0), 255 * f(8), 255 * f(4), 255];
}


export const PixelGridCard = ({width, height, title, updatePeriod, tempRange, hslRange, promiseGenerator}: {
    title: string,
    width: number,
    height: number,
    updatePeriod: number,
    tempRange: [number, number],
    hslRange: [number, number],
    promiseGenerator: () => CancelablePromise<any>,
}) => {
    const [value, setValue] = useState<Array<number>>()
    const [loading, setLoading] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const getHue = (nowTemp: number) => {
        const sDeg = (hslRange[1] - hslRange[0]) / (tempRange[1] - tempRange[0]);
        return (360 - (((tempRange[1] - nowTemp) * sDeg) - (hslRange[1] - 360)));
    }

    useInterval(
        () => {
            // Your custom logic here
            setLoading(true)
            promiseGenerator()
                .then((response) => response)
                .then((val) => {
                    //console.log(val + " " + getHue(val[0]))
                    setLoading(false);
                    setValue(val.map((s: number) => hsl2rgba(getHue(s), 1, 0.5)).flat());
                });
        },
        // Delay in milliseconds or null to stop it
        loading ? null : updatePeriod,
    )

    useEffect(() => {
        if (canvasRef.current && value) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            if (context == null) throw new Error('Could not get context');
            context.imageSmoothingEnabled = false;
            const imgData = new ImageData(new Uint8ClampedArray(value), width, height);
            // Draw image data to the canvas
            context.putImageData(imgData, 0, 0);
        }
    }, [value])

    if (!value) return <div className={"bg-gray-200 w-full rounded-md"}></div>

    return (
        // <div className="bg-gray-100 px-6 py-4 rounded-md grid grid-cols-1 divide-y">
        //     <h5 className="text-md text-gray-900 dark:text-white mb-3 ">{title}</h5>
        <canvas ref={canvasRef} width={width} height={height} className={"w-full rounded-md"}
                style={{imageRendering: "pixelated"}}/>
        // </div>
    )
}