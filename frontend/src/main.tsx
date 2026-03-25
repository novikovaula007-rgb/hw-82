import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {Provider} from "react-redux";
import {store} from "../app/store.ts";
import {CssBaseline} from "@mui/material";
import {ToastContainer} from "react-toastify";
import {BrowserRouter} from "react-router";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <CssBaseline/>
                <App/>
                <ToastContainer/>
            </BrowserRouter>
        </Provider>
    </StrictMode>,
);
