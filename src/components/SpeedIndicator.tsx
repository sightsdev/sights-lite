import React from "react";

export const SpeedIndicator = ({speed}: { speed: number }) => (
    <div>
        <div className="bg-gray-50 rounded-md p-6 h-auto">
            <div className="flex justify-between mb-1">
                <span className="text-base font-medium text-emerald-800 dark:text-white">Speed</span>
                {/*<span className="text-sm font-medium text-blue-700 dark:text-white">{speed}</span>*/}
            </div>
            <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700 relative">
                <div className={`absolute inset-0 z-10 grid grid-cols-8 text-center text-gray-200 py-1.5`}>
                    {Array.from({length: 8}, (_, index) => (
                        <span key={index + 1}>{index + 1}</span>
                    ))}
                </div>
                <div
                    className={`bg-emerald-800 h-8 z-0 rounded-full grid grid-cols-${speed} text-white text-center pt-2 leading-none overflow-hidden transition-width transition-slowest ease`}
                    style={{width: `${100 * speed / 8}%`}}>

                </div>

            </div>
        </div>
    </div>
)