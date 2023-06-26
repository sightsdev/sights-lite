import {buildStyles, CircularProgressbar} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import colors from 'tailwindcss/colors'
import {useEffect, useState} from "react";
import {CancelablePromise} from "../api";
import {useInterval} from 'usehooks-ts'

export const CircleGraph = ({suffix="%", title, updatePeriod, promiseGenerator, valueExtractor = (res) => res}: {
    suffix?: string,
    title: string,
    updatePeriod: number,
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
        loading ? null : updatePeriod,
    )

    return (
        <div className="bg-gray-100 px-6 py-4 rounded-md grid grid-cols-1 divide-y">
            <h5 className="text-md text-gray-900 dark:text-white mb-3 ">{title}</h5>
            <div className={"pt-4"}>
                <CircularProgressbar value={value} text={`${value}${suffix}`} styles={buildStyles({
                    // Rotation of path and trail, in number of turns (0-1)
                    rotation: 0,

                    // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                    strokeLinecap: 'round',

                    // Text size
                    textSize: '16px',

                    // How long animation takes to go from one percentage to another, in seconds
                    pathTransitionDuration: 0.5,

                    // Colors
                    pathColor: colors.sky['800'],
                    textColor: colors.sky['800'],
                    trailColor: colors.gray['300'],
                })}/>
            </div>

        </div>
    )
}