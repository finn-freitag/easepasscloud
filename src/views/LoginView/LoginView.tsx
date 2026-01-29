'use client';
import InputField from "@/components/InputField/InputField";
import { ViewProps } from "../viewProps/ViewProps";
import styles from "./LoginView.module.scss";
import { useState } from "react";
import Button from "@/components/Button/Button";
import { DashboardViewProps } from "../dashboardViews/dashboardViewProps/DashboardViewProps";

export default function LoginView(props: ViewProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function login() {
        let body = {
            username: username,
            password: password
        };
        fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        .then(r=>r.json())
        .then(data => {
            if(data.success) {
                props.onNavigateBack("dashboard", {user: data.user, sessionToken: data.sessionToken, setInfoMessage: props.setInfoMessage, defaultValues: data.defaultValues} as DashboardViewProps);
            } else {
                props.setInfoMessage("Login failed. Please check your credentials.");
            }
        });
    }

    function register() {
        let body = {
            username: username,
            password: password
        };
        fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        .then(r=>r.json())
        .then(data => {
            if(data.success) {
                props.onNavigateBack("dashboard", {user: data.user, sessionToken: data.sessionToken, setInfoMessage: props.setInfoMessage, defaultValues: data.defaultValues} as DashboardViewProps);
            } else {
                props.setInfoMessage("Username already exists. Please choose another one.");
            }
        });
    }

    return (
        <div className={styles.container}>
            <div className={styles.view}>
                <h2>Login</h2>
                <InputField
                    caption="Username:" 
                    value={username}
                    onChange={(u)=>setUsername(u)} />
                <InputField
                    caption="Password:" 
                    password
                    value={password}
                    onChange={(p)=>setPassword(p)}
                    onKeyDown={(e)=>{if(e.key === 'Enter')login()}}/>
                <div className={styles.buttonGroup}>
                    <Button
                        caption="Login"
                        onClick={()=>login()} />
                    {props !== null && props.viewParameters === true && <Button
                        caption="Register"
                        onClick={()=>register()} />
                    }
                </div>
                <div style={{height:"4rem"}}>{/* spacer */}</div>
            </div>
        </div>
    );
}