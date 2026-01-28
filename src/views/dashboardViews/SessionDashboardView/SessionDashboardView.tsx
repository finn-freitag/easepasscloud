import { useEffect, useState } from "react";
import { DashboardViewProps } from "../dashboardViewProps/DashboardViewProps";
import styles from "./SessionDashboardView.module.scss";
import { Session } from "@/backend/models/Session";
import Button from "@/components/Button/Button";
import { DefaultViewUpdateTime } from "@/backend/DefaultValues";

export default function SessionDashboardView(props: DashboardViewProps) {
    const [sessions, setSessions] = useState<{ token: string, session: Session }[]>([]);
    const [reloadTrigger, reloadSessions] = useState(false);

    useEffect(()=>{
        fetch("/api/sessions", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({sessionToken: props.sessionToken})})
            .then(r=>r.json())
            .then(data => {
                if(data.success) {
                    setSessions(data.sessions);
                } else {
                    props.setInfoMessage("Failed to load sessions: " + data.message);
                }
            })
            .catch(() => {
                props.setInfoMessage("Failed to load sessions due to a network error.");
            });
    },[reloadTrigger]);

    useEffect(()=>{
        const interval = setInterval(()=>reloadSessions(!reloadTrigger), DefaultViewUpdateTime);
        return () => clearInterval(interval);
    },[]);

    function invalidateSession(token: string) {
        fetch("/api/sessions/invalidate", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({sessionToken: props.sessionToken, sessionTokenToInvalidate: token})})
            .then(r=>r.json())
            .then(data => {
                if(data.success) {
                    props.setInfoMessage("Session invalidated successfully.");
                    if(token === props.sessionToken) {
                        window.location.reload();
                        return;
                    }
                    reloadSessions(!reloadTrigger);
                } else {
                    props.setInfoMessage("Failed to invalidate session: " + data.message);
                }
            })
            .catch(() => {
                props.setInfoMessage("Failed to invalidate session due to a network error.");
            });
    }

    return (
        <div className={styles.list}>
            <h2>Active Sessions</h2>
            <div className={styles.menuItem}>
                <strong>Username</strong>
                <strong>Created</strong>
                <div style={{width:"18rem"}}></div>
            </div>
            {sessions.map((s,i)=>(
                <div key={i} className={styles.menuItem}>
                    <div>{s.session.username}{s.token === props.sessionToken ? <span className={styles.current}>{" (Current)"}</span> : ""}</div>
                    <div>{new Date(s.session.created).toLocaleTimeString()}</div>
                    <Button caption={s.token === props.sessionToken ? "Logout" : "Invalidate"} onClick={()=>invalidateSession(s.token)} />
                </div>
            ))}
        </div>
    );
}