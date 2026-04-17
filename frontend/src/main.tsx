import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {Provider} from "react-redux";
import {CssBaseline} from "@mui/material";
import {ToastContainer} from "react-toastify";
import {BrowserRouter} from "react-router";
import {persistor, store} from "./app/store.ts";
import {PersistGate} from 'redux-persist/integration/react';
import {GoogleOAuthProvider} from "@react-oauth/google";
import {GOOGLE_CLIENT_ID} from "./constants.ts";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <Provider store={store}>
                <PersistGate persistor={persistor}>
                    <BrowserRouter>
                        <CssBaseline/>
                        <App/>
                        <ToastContainer/>
                    </BrowserRouter>
                </PersistGate>
            </Provider>
        </GoogleOAuthProvider>
    </StrictMode>,
);
