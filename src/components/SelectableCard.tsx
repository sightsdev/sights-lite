import React, {Fragment, useEffect, useMemo, useState} from "react";
import {Listbox, Transition} from "@headlessui/react";
import {CircleGraph} from "./CircleGraph";
import {SpeedIndicator} from "./SpeedIndicator";
import {PixelGridCard} from "./PixelGridCard";
import {LineGraphCard} from "./LineGraphCard";
import {FaCamera, FaChevronDown, FaChevronRight, FaInfo, FaTimes} from "react-icons/fa";
import {SlGraph} from "react-icons/sl";
import {FaTemperatureEmpty} from "react-icons/fa6";
import {AppClient, SensorConfig} from "../api";

interface Option {
    name: string,
    Icon: any
    Component: any
}

interface State {
    speed: number,
    cameras: string[],
    sensors: Record<string, SensorConfig>
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export const SelectableCard = ({id, state, client}: { id: number, state: State, client: AppClient }) => {
    const getOptions = useMemo(() => {
        const options: Option[] = [
            {
                name: 'None',
                Icon: <FaTimes/>,
                Component: <div/>
            },
        ];
        for (const sensorName in state.sensors) {
            let value: SensorConfig = state.sensors[sensorName];
            if (!value.enabled) continue;
            switch(value.type) {
                case "system_info":
                    options.push({
                        name: 'System Info + Speed',
                        Icon: <FaInfo/>,
                        Component: <div>
                            <div className="grid grid-cols-2 gap-4 mb-3">
                                <CircleGraph title={"CPU Temperature"}
                                             updatePeriod={500}
                                             suffix={"℃"}
                                             promiseGenerator={() => client.default.sensorSensorSensorIdGet(sensorName)}
                                             valueExtractor={(json) => json["temperature"]}/>
                                <CircleGraph title={"CPU Usage"}
                                             updatePeriod={500}
                                             promiseGenerator={() => client.default.sensorSensorSensorIdGet(sensorName)}
                                             valueExtractor={(json) => Math.round(json["cpu_percent"])}/>
                            </div>
                            <SpeedIndicator speed={state.speed}></SpeedIndicator>
                        </div>
                    });
                    break;
                case "mlx90641":
                case "mlx90640":
                    options.push({
                        name: `Thermal Camera (${sensorName})`,
                        Icon: <FaTemperatureEmpty/>,
                        Component: <PixelGridCard title={`Thermal Camera`}
                                                  width={64} height={48}
                                                  tempRange={[0, 30]}
                                                  hslRange={[0, 90]}
                                                  updatePeriod={500}
                                                  promiseGenerator={() => client.default.sensorSensorSensorIdGet(sensorName)}/>
                    });
                    break;
                case "sgp30":
                    options.push({
                        name: `Gas (eCO2 / TVOC) (${sensorName})`,
                        Icon: <SlGraph/>,
                        Component: <LineGraphCard title={`Gas`}
                                                  updatePeriod={500}
                                                  length={20}
                                                  series={["eCO2", "TVOC"]}
                                                  promiseGenerator={() => client.default.sensorSensorSensorIdGet(sensorName)}/>
                    });
                    break;
            }
        }
        state.cameras.forEach((c: string, i: number) => {
            options.push(
                {
                    name: `Camera (${c})`,
                    Icon: <FaCamera/>,
                    Component: <img className="rounded-md"
                                    src={`${client.request.config.BASE}/camera/${c}/`}
                                    alt="Video stream"/>
                },
            )
        })
        return options
    }, [state])

    const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
    useEffect(() => {
        const selected = localStorage.getItem(`selectedComponent${id}`);
        if (selected) {
            setSelectedComponent(JSON.parse(selected));
        }
    }, []);
    if (selectedComponent != null) {
        // Check if option in localstorage exists in the current options
        const opt = getOptions.find(o => o.name == selectedComponent);
        if (opt) {
            return <>{opt.Component}</>
        } else {
            // If not, remove the localstorage key (the sensor was likely removed from the config)
            localStorage.removeItem(`selectedComponent${id}`);
            // And reshow the selection box
            setSelectedComponent(null);
        }

    }
    return (
        <div className={"bg-gray-100 rounded-md px-4 py-2 pb-4"}>
            <Listbox value={null} onChange={(selected: number) => {
                localStorage.setItem(`selectedComponent${id}`, JSON.stringify(getOptions[selected].name));
                setSelectedComponent(getOptions[selected].name)
            }}>
                {({open}) => (
                    <>
                        <div className="relative mt-2">
                            <Listbox.Button
                                className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6">Select
                                component...
                                <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                    {open ? <FaChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" /> :
                                        <FaChevronRight className="h-5 w-5 text-gray-400" aria-hidden="true" /> }
                                </span>
                            </Listbox.Button>
                            <Transition
                                show={open}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options
                                    className={"absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"}>
                                    {getOptions.concat().map((option, index) => (
                                        <Listbox.Option
                                            className={({active}) =>
                                                classNames(
                                                    active ? 'bg-sky-600 text-white' : 'text-gray-900',
                                                    'relative cursor-default select-none py-2 pl-3 pr-9'
                                                )
                                            }
                                            key={index}
                                            value={index}
                                        >
                                            <div className="flex items-center">
                                                <div className="h-5 w-5 flex-shrink-0 rounded-full pt-0.5">
                                                    {getOptions[index].Icon}
                                                </div>
                                                <span
                                                    className={'font-normal ml-3 block truncate'}
                                                >
                                                {option.name}
                                              </span>
                                            </div>
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </>
                )}
            </Listbox>
        </div>
    )
}