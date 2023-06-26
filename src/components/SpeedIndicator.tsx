import React from "react";

export const SpeedIndicator = ({speed}: { speed: number }) => (
    <div>
        <div className="bg-gray-100 rounded-md px-6 py-3 h-auto">
            <span className="text-base font-medium text-gray-900 dark:text-white">Speed</span>
            <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700 relative mt-1">
                <div className={`absolute inset-0 z-10 grid grid-cols-8 text-center text-gray-200 py-1.5`}>
                    {Array.from({length: 8}, (_, index) => (
                        <span key={index + 1}>{index + 1}</span>
                    ))}
                </div>
                <div
                    className={`bg-sky-800 h-8 z-0 rounded-full grid grid-cols-${speed} text-white text-center pt-2 leading-none overflow-hidden transition-width transition-slowest ease`}
                    style={{width: `${100 * speed / 8}%`}}>

                </div>

            </div>
        </div>
    </div>
)