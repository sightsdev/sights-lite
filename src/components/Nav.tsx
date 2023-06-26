import {FaCog, FaPowerOff} from 'react-icons/fa'
import {Button} from "./Button";
import {Link} from "react-router-dom";

export const Nav = () => (
    <nav className="border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
        <div className="container flex flex-wrap items-center justify-between mx-auto p-4 relative">

            <div className="flex basis-1/3 items-center md:order-1">

            </div>

            <div className="flex basis-1/3 justify-center md:order-2">
                <Link to={"/"}>
                    <span className={"text-sky-800"}>SIGHTS</span> Interface
                </Link>
            </div>

            <div className="flex basis-1/3 justify-end md:order-3 space-x-2">
                <Link to={"/settings"}>
                    <Button color="text-white bg-sky-800 hover:bg-sky-700"><FaCog className={"mr-2"}/> Settings</Button>
                </Link>
                <Button
                    color="text-red-700 hover:text-white border border-red-800 hover:bg-red-800"><FaPowerOff/></Button>
            </div>
        </div>
    </nav>
)