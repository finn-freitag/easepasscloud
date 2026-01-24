import { User } from "@/backend/models/User";
import { ViewProps } from "../viewProps/ViewProps";
import { useEffect, useState } from "react";
import styles from "./DashboardView.module.scss";
import { DashboardViewProps } from "../dashboardViews/dashboardViewProps/DashboardViewProps";
import Button from "@/components/Button/Button";
import { DatabaseDashboardView } from "../dashboardViews/DatabaseDashboardView/DatabaseDashboardView";

export default function DashboardView(props: ViewProps) {
    const [dashboardViewProps, setDashboardViewProps] = useState<DashboardViewProps|null>(null);
    const [currentDashboardView, setCurrentDashboardView] = useState("none");

    useEffect(()=>{
        if(props.viewParameters)
            setDashboardViewProps({...(props.viewParameters as DashboardViewProps), setInfoMessage: props.setInfoMessage});
    }, [props.viewParameters]);

    function logout() {
        fetch("/api/logout", {method: "POST",headers: {"Content-Type": "application/json"}, body: JSON.stringify({sessionToken: dashboardViewProps?.sessionToken})})
            .then(r=>r.json())
            .then(data => {
                if(data.success) {
                    window.location.reload();
                } else {
                    props.setInfoMessage("Logout failed. Please try again.");
                }
            })
            .catch(() => {
                props.setInfoMessage("Logout failed. Please try again.");
            });
    }

    return (
        <div className={styles.view}>
            <div className={styles.container}>
                <div className={styles.menu}>
                    <button className={`${styles.menuItem} ${currentDashboardView === "databases" ? styles.menuItemActive : ""}`} onClick={() => setCurrentDashboardView("databases")}>Databases</button>
                    <button className={`${styles.menuItem} ${currentDashboardView === "accessTokens" ? styles.menuItemActive : ""}`} onClick={() => setCurrentDashboardView("accessTokens")}>Access Tokens</button>
                    <button className={`${styles.menuItem} ${currentDashboardView === "easePassConfig" ? styles.menuItemActive : ""}`} onClick={() => setCurrentDashboardView("easePassConfig")}>Ease Pass Config</button>
                    {dashboardViewProps?.user.admin && <>
                        <div style={{margin:"0.25rem 0"}}>Admin Area:</div>
                        <button className={`${styles.menuItem} ${currentDashboardView === "users" ? styles.menuItemActive : ""}`} onClick={() => setCurrentDashboardView("users")}>Users</button>
                        <button className={`${styles.menuItem} ${currentDashboardView === "sessions" ? styles.menuItemActive : ""}`} onClick={() => setCurrentDashboardView("sessions")}>Sessions</button>
                        <button className={`${styles.menuItem} ${currentDashboardView === "server" ? styles.menuItemActive : ""}`} onClick={() => setCurrentDashboardView("server")}>Server</button>
                    </>}
                    <div style={{margin:"0.25rem 0"}}>Logged in as:<br /><span className={styles.username}>{dashboardViewProps?.user.username}</span></div>
                    <Button caption="Logout" onClick={logout} />
                </div>
                <div className={styles.contentPage}>
                    {{
                        "none": <div className={styles.startpage}>
                            <img className={styles.logo} src="/Icon.png" />
                            <h2>Welcome, {dashboardViewProps?.user.username}!</h2>
                            <p>Select an option from the menu to get started.</p>
                        </div>,
                        "databases": <DatabaseDashboardView sessionToken={dashboardViewProps?.sessionToken!} setInfoMessage={props.setInfoMessage} user={dashboardViewProps?.user!} />,
                    }[currentDashboardView]}
                </div>
            </div>
        </div>
    );
}