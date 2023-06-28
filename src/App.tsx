import React from 'react';
import {Nav} from "./components/Nav";
import { Outlet } from "react-router-dom";
import {Toaster} from "react-hot-toast";

function App() {
    return (
        <div className="App h-auto dark:bg-gray-700">
            <Nav/>
            <Outlet/>
            <Toaster position={'top-right'} />
        </div>)
}

export default App;
