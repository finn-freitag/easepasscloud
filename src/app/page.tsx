'use client';
import styles from "./page.module.scss";
import { useEffect, useState } from "react";
import { InitializationView } from "@/views/InitializationView/InitializationView";
import LoginView from "@/views/LoginView/LoginView";
import Overlay from "@/components/Overlay/Overlay";
import Button from "@/components/Button/Button";
import DashboardView from "@/views/DashboardView/DashboardView";
import { BasePage } from "@/components/BasePage/BasePage";

export default function Home() {
    const [currentView, setCurrentView] = useState("none");
    const [infoMessage, setInfoMessage] = useState("");

    const [currentProps, setCurrentProps] = useState<any>(null);

    useEffect(()=>{
        fetch("/api/initialization")
            .then(r=>r.json())
            .then(data => {
                if(!data.initialized)
                    navigateToView("initialization");
                else
                    navigateToView("login", data.publicInstance);
            });
    },[]);

    function navigateToView(view: string, viewParameters?: any) {
        setCurrentView("none");
        setCurrentProps(viewParameters);
        setCurrentView(view);
    }

    return (
        <BasePage>
            <div className={styles.page}>
                <div className={styles.header}>
                    {["none","initialization","login"].includes(currentView) && <>
                        <img src="/Icon.png" alt="Ease Pass Cloud Logo" className={styles.logo} />
                        <h1 className={styles.headline}>Ease Pass Cloud</h1>
                    </>}
                    {{
                        "none": "Loading...",
                        "initialization": <InitializationView onNavigateBack={navigateToView} setInfoMessage={setInfoMessage} viewParameters={currentProps} />,
                        "login": <LoginView onNavigateBack={navigateToView} setInfoMessage={setInfoMessage} viewParameters={currentProps} />,
                        "dashboard": <DashboardView onNavigateBack={navigateToView} setInfoMessage={setInfoMessage} viewParameters={currentProps} />,
                    }[currentView]}
                </div>
                <Overlay visible={infoMessage !== ""} onSideClick={() => setInfoMessage("")} >
                    <p>{infoMessage}</p>
                    <br />
                    <Button caption="OK" onClick={() => setInfoMessage("")} />
                </Overlay>
            </div>
        </BasePage>
    );
}
