import {buildStyles, CircularProgressbar} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import colors from 'tailwindcss/colors'
import {useEffect, useState} from "react";
import {CancelablePromise} from "../api";
import {useInterval} from 'usehooks-ts'

export const CircleGraph = ({suffix="%", title, promiseGenerator, valueExtractor = (res) => res}: {
    suffix?: string,
    title: string,
    promiseGenerator: () => CancelablePromise<any>,
    valueExtractor?: (json: any) => number
}) => {
    const [value, setValue] = useState(0)
    const [loading, setLoading] = useState(false);
    useInterval(
        () => {
            // Your custom logic here
            setLoading(true)
            promiseGenerator()
                .then((response) => response)
                .then((val) => {
                    console.log(val)
                    setLoading(false);
                    setValue(valueExtractor(val));
                });
        },
        // Delay in milliseconds or null to stop it
        loading ? null : 2000,
    )

    return (
        <div className="bg-gray-100 px-6 py-4 rounded-md grid grid-cols-1 divide-y">
            <h5 className="text-md text-gray-900 dark:text-white mb-3 ">{title}</h5>
            <div className={"pt-4"}>
                <CircularProgressbar value={value} text={`${value}${suffix}`} styles={buildStyles({
                    // Rotation of path and trail, in number of turns (0-1)
                    rotation: 0,

                    // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                    strokeLinecap: 'rounded',

                    // Text size
                    textSize: '16px',

                    // How long animation takes to go from one percentage to another, in seconds
                    pathTransitionDuration: 0.5,

                    // Colors
                    pathColor: colors.emerald['800'],
                    textColor: colors.emerald['800'],
                    trailColor: colors.emerald['600'],
                })}/>
            </div>

        </div>
    )
}