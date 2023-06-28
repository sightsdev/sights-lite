import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import {OpenAPI} from "./api";


if (process.env.NODE_ENV === 'development') {
    OpenAPI.BASE = 'http://localhost:8000/api';
}
if (process.env.NODE_ENV === 'production') {
    OpenAPI.BASE = '/api';
}
console.log(OpenAPI.BASE);
const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App/>}>
                    <Route index element={<Index/>}/>
                    <Route path="settings" element={<Settings/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
