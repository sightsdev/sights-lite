import {FaCaretDown, FaCog, FaPowerOff} from 'react-icons/fa'
import {Button} from "./Button";
import {Link} from "react-router-dom";
import {Menu, Transition} from '@headlessui/react'
import {LiaBroomSolid} from "react-icons/lia";
import {AppClient} from "../api";
import {Fragment} from "react";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export const Nav = () => {
    const client = new AppClient();
    return (
        <nav className="border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <div className="container flex flex-wrap items-center justify-between mx-auto p-4 relative">

                <div className="flex basis-1/3 items-center md:order-1">

                </div>

                <div className="flex basis-1/3 justify-center md:order-2">
                    <Link to={"/"} className={"hover:border-b"}>
                        <span className={"text-sky-800"}>SIGHTS</span> Interface
                    </Link>
                </div>

                <div className="flex basis-1/3 justify-end md:order-3 space-x-2">
                    <Link to={"/settings"}>
                        <Button color="text-white bg-sky-800 hover:bg-sky-700" title={"Settings"}>
                            <FaCog/><span>Settings</span>
                        </Button>
                    </Link>
                    <Button onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                    }}
                            title={"Clear layout selections"}
                            color="text-gray-700 hover:text-white border border-gray-800 hover:bg-gray-800"><LiaBroomSolid/></Button>

                    <Menu as="div" className="relative inline-block text-left">
                        <div>
                            <Menu.Button
                                title={"Power"}
                                className="flex items-center focus:outline-none font-medium rounded-lg space-x-1 text-sm px-4 py-2.5 tracking-wide capitalize transition-colors duration-300 transform text-center mr-3 md:mr-0 text-red-700 hover:text-white border border-red-800 hover:bg-red-800">
                                <FaPowerOff/><FaCaretDown/>
                            </Menu.Button>
                        </div>

                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items
                                className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                    <Menu.Item>
                                        {({active}) => (
                                            <a
                                                href="#"
                                                className={classNames(
                                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                    'block px-4 py-2 text-sm'
                                                )}
                                                onClick={() => client.default.powerPoweroffPost()}
                                            >
                                                Power off
                                            </a>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({active}) => (
                                            <a
                                                href="#"
                                                className={classNames(
                                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                    'block px-4 py-2 text-sm'
                                                )}
                                                onClick={() => client.default.rebootRebootPost()}
                                            >
                                                Reboot
                                            </a>
                                        )}
                                    </Menu.Item>

                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>

            </div>
        </nav>
    )
}