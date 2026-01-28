'use client';
import { ViewProps } from "../viewProps/ViewProps";
import { useEffect, useState } from "react";
import styles from "./DashboardView.module.scss";
import { DashboardViewProps } from "../dashboardViews/dashboardViewProps/DashboardViewProps";
import Button from "@/components/Button/Button";
import { DatabaseDashboardView } from "../dashboardViews/DatabaseDashboardView/DatabaseDashboardView";
import ServerConfigDashboardView from "../dashboardViews/ServerConfigDashboadView/ServerConfigDashboardView";
import SessionDashboardView from "../dashboardViews/SessionDashboardView/SessionDashboardView";
import ProfileDashboardView from "../dashboardViews/ProfileDashboardView/ProfileDashboardView";
import AccessTokenDashboardView from "../dashboardViews/AccessTokenDashboardView/AccessTokenDashboardView";
import EPConfigDashboardView from "../dashboardViews/EPConfigDashboardView/EPConfigDashboardView";
import UserDashboardView from "../dashboardViews/UserDashboardView/UserDashboardView";

export default function DashboardView(props: ViewProps) {
    const [dashboardViewProps, setDashboardViewProps] = useState<DashboardViewProps|null>(null);
    const [currentDashboardView, setCurrentDashboardView] = useState("none");

    const [menuExpanded, setMenuExpanded] = useState(false);

    useEffect(()=>{
        if(props.viewParameters)
            setDashboardViewProps({...(props.viewParameters as DashboardViewProps), setInfoMessage: props.setInfoMessage});
    }, [props.viewParameters]);

    useEffect(()=>{
        const interval = setInterval(()=>{
            if(!dashboardViewProps) return;
            fetch("/api/sessions/ping", {method: "POST",headers: {"Content-Type": "application/json"}, body: JSON.stringify({sessionToken: dashboardViewProps?.sessionToken})})
                .then(r=>r.json())
                .then(data => {
                    if(!data.success) {
                        window.location.reload();
                    }
                })
                .catch(() => {
                    window.location.reload();
                });
        }, 20000);
        return () => clearInterval(interval);
    },[dashboardViewProps]);

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
            <div onClick={() => setMenuExpanded(!menuExpanded)} className={styles.menuToggle}>☰</div>
            <div className={`${styles.baseMenu} ${menuExpanded ? "" : styles.menuHidden}`}>
                <button className={`${styles.menuItem} ${currentDashboardView === "databases" ? styles.menuItemActive : ""}`} onClick={() => setCurrentDashboardView("databases")}>Databases</button>
                <button className={`${styles.menuItem} ${currentDashboardView === "accessTokens" ? styles.menuItemActive : ""}`} onClick={() => setCurrentDashboardView("accessTokens")}>Access Tokens</button>
                <button className={`${styles.menuItem} ${currentDashboardView === "easePassConfig" ? styles.menuItemActive : ""}`} onClick={() => setCurrentDashboardView("easePassConfig")}>Ease Pass Config</button>
                <button className={`${styles.menuItem} ${currentDashboardView === "profile" ? styles.menuItemActive : ""}`} onClick={() => setCurrentDashboardView("profile")}>Profile</button>
                {dashboardViewProps?.user.admin && <>
                    <div style={{margin:"0.25rem 0"}}>Admin Area:</div>
                    <button className={`${styles.menuItem} ${currentDashboardView === "users" ? styles.menuItemActive : ""}`} onClick={() => setCurrentDashboardView("users")}>Users</button>
                    <button className={`${styles.menuItem} ${currentDashboardView === "sessions" ? styles.menuItemActive : ""}`} onClick={() => setCurrentDashboardView("sessions")}>Sessions</button>
                    <button className={`${styles.menuItem} ${currentDashboardView === "server" ? styles.menuItemActive : ""}`} onClick={() => setCurrentDashboardView("server")}>Server</button>
                </>}
                <div style={{margin:"0.25rem 0"}}>Logged in as:<br /><span className={styles.username}>{dashboardViewProps?.user.username}</span></div>
                <Button caption="Logout" onClick={logout} />
            </div>
            {!menuExpanded && <div className={styles.contentPage}>
                {{
                    "none": <div className={styles.startpage}>
                        <img className={styles.logo} src="/Icon.png" />
                        <h2>Welcome, {dashboardViewProps?.user.username}!</h2>
                        <p>Select an option from the menu to get started.</p>
                    </div>,
                    "databases": <DatabaseDashboardView sessionToken={dashboardViewProps?.sessionToken!} setInfoMessage={props.setInfoMessage} user={dashboardViewProps?.user!} />,
                    "accessTokens": <AccessTokenDashboardView sessionToken={dashboardViewProps?.sessionToken!} setInfoMessage={props.setInfoMessage} user={dashboardViewProps?.user!} />,
                    "easePassConfig": <EPConfigDashboardView sessionToken={dashboardViewProps?.sessionToken!} setInfoMessage={props.setInfoMessage} user={dashboardViewProps?.user!} />,
                    "profile": <ProfileDashboardView sessionToken={dashboardViewProps?.sessionToken!} setInfoMessage={props.setInfoMessage} user={dashboardViewProps?.user!} />,
                    "users": <UserDashboardView sessionToken={dashboardViewProps?.sessionToken!} setInfoMessage={props.setInfoMessage} user={dashboardViewProps?.user!} />,
                    "sessions": <SessionDashboardView sessionToken={dashboardViewProps?.sessionToken!} setInfoMessage={props.setInfoMessage} user={dashboardViewProps?.user!} />,
                    "server": <ServerConfigDashboardView sessionToken={dashboardViewProps?.sessionToken!} setInfoMessage={props.setInfoMessage} user={dashboardViewProps?.user!} />,
                }[currentDashboardView]}
            </div>}
        </div>
    );
}