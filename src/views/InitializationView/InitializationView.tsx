'use client';
import { useState } from "react";
import styles from "./InitializationView.module.scss";
import InputField from "@/components/InputField/InputField";
import InputSwitch from "@/components/InputSwitch/InputSwitch";
import Button from "@/components/Button/Button";
import Overlay from "@/components/Overlay/Overlay";
import { ViewProps } from "../viewProps/ViewProps";

export function InitializationView(props: ViewProps) {
    const [url, setUrl] = useState(window.location.protocol + '//' + window.location.host);
    const [publicInstance, setPublicInstance] = useState(false);
    const [adminUsername, setAdminUsername] = useState("");
    const [adminPassword, setAdminPassword] = useState("");

    function submit(){
        let body = {
            publicInstance: publicInstance,
            serverAddress: url,
            adminUsername: adminUsername,
            adminPassword: adminPassword
        };
        fetch('/api/initialization', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        .then(response => response.json())
        .then(data => {
            if(data.success){
                props.onNavigateBack("login", publicInstance);
            } else {
                props.setInfoMessage("An error during setup occurred.");
            }
        }).catch(error => {
            props.setInfoMessage("Error: " + error);
        });
    }

    return (
        <div className={styles.view}>
            <h2>Setup</h2>
            <p>Welcome to Ease Pass Cloud! Let's get you set up.</p>
            <InputField
                value={url}
                onChange={(v)=>setUrl(v)}
                placeholder="Enter the url of this instance..."
                caption="Instance URL:" />
            <InputSwitch
                value={publicInstance}
                onChange={setPublicInstance}
                caption="Public Instance" />
            <InputField
                value={adminUsername}
                onChange={(v)=>setAdminUsername(v)}
                placeholder="Enter the admin username..."
                caption="Admin Username:" />
            <InputField
                value={adminPassword}
                onChange={(v)=>setAdminPassword(v)}
                placeholder="Enter the admin password..."
                caption="Admin Password:"
                password />
            <Button caption="Setup Ease Pass Cloud Instance" onClick={submit} />
        </div>
    );
}