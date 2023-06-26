import 'react-circular-progressbar/dist/styles.css';
import React, {useState} from "react";
import {CancelablePromise} from "../api";
import {useInterval} from 'usehooks-ts'
import colors from 'tailwindcss/colors'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';
import {Line} from 'react-chartjs-2';


interface Dictionary<T> {
    [Key: string]: T;
}

export const LineGraphCard = ({title, updatePeriod, promiseGenerator, length, series}: {
    title: string,
    updatePeriod: number,
    length: number,
    series: string[],
    promiseGenerator: () => CancelablePromise<any>,
}) => {
    const [data, setData] = useState<Dictionary<Array<number>>>()
    const [loading, setLoading] = useState(false);

    useInterval(
        () => {
            // Your custom logic here
            setLoading(true)
            promiseGenerator()
                .then((response) => response)
                .then((newValue: {[key: string] : number}) => {
                    //console.log(val + " " + getHue(val[0]))
                    setLoading(false);

                    const newState: Dictionary<Array<number>> = {}
                    series.forEach((s, i) => {
                        newState[s] = data ? [...data[s], newValue[s]] : [newValue[s]]
                        if (newState[s].length > length) {
                            newState[s].shift();
                        }
                    })
                    setData(newState)
                });
        },
        // Delay in milliseconds or null to stop it
        loading ? null : updatePeriod,
    )
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Tooltip,
        Legend
    );
    if (!data) return <div className={"bg-gray-200 w-full rounded-md"}></div>
    const options = {
        responsive: true,
        animation: false as const,
        tension: 0.4,
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
        },
    };
    // TODO: turn this into an iteration to allow for more series than just two
    const getData = () => {return {
        labels: Array.from(data[series[0]].keys()),
        datasets: [
            {
                label: series[0],
                data: data[series[0]],
                borderColor: colors.emerald['600'],
                backgroundColor: colors.emerald['100'],
            },
            {
                label: series[1],
                data: data[series[1]],
                borderColor: colors.sky['600'],
                backgroundColor: colors.sky['100'],
            },
        ],
    }};

    return (
        <div className="bg-gray-100 px-6 py-4 rounded-md flex divide-y flex-col h-full">
            <h5 className="text-md text-gray-900 dark:text-white pb-3">{title}</h5>
            <Line options={options} data={getData()} className={"pt-2 rounded-md"}/>
        </div>
    )
}