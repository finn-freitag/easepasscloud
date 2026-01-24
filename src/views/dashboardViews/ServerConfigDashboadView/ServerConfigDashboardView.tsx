'use client';
import { useEffect, useState } from "react";
import { DashboardViewProps } from "../dashboardViewProps/DashboardViewProps";
import { ServerConfig } from "@/backend/models/ServerConfig";
import InputField from "@/components/InputField/InputField";
import InputSwitch from "@/components/InputSwitch/InputSwitch";
import { DefaultSessionTimeoutHours } from "@/backend/DefaultValues";
import Button from "@/components/Button/Button";
import styles from "./ServerConfigDashboardView.module.scss";

export default function ServerConfigDashboardView(props: DashboardViewProps) {
    const [serverConfig, setServerConfig] = useState<ServerConfig|null>(null);

    useEffect(()=>{
        fetch('/api/serverconfig/get', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ sessionToken: props.sessionToken })
        })
        .then(res => res.json())
        .then(data => {
            if(data.success){
                setServerConfig(data.serverConfig);
            } else {
                props.setInfoMessage("Error fetching server config: " + data.message);
            }
        })
        .catch(err => {
            props.setInfoMessage("Error fetching server config: " + err.message);
        });
    },[]);

    function saveConfig(){
        if(!serverConfig)
            return;
        fetch('/api/serverconfig/set', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ sessionToken: props.sessionToken, serverConfig: serverConfig })
        })
        .then(res => res.json())
        .then(data => {
            if(data.success){
                props.setInfoMessage("Server configuration saved successfully.");
            } else {
                props.setInfoMessage("Error saving server config: " + data.message);
            }
        })
        .catch(err => {
            props.setInfoMessage("Error saving server config: " + err.message);
        });
    }

    return (
        <div className={styles.view}>
            <h2>Server Configuration</h2>
            <p>Manage server settings and configurations here.</p>
            <InputField
                caption="Server Address:"
                value={serverConfig ? (serverConfig.serverAddress ? serverConfig.serverAddress : '') : ''}
                onChange={(newValue) => {
                    if (serverConfig) {
                        setServerConfig({ ...serverConfig, serverAddress: newValue });
                    }
                }}/>
            <InputSwitch
                caption="Public Instance"
                value={serverConfig ? serverConfig.publicInstance === true : false}
                onChange={(newValue) => {
                    if (serverConfig) {
                        setServerConfig({ ...serverConfig, publicInstance: newValue });
                    }
                }}/>
            <InputField
                caption="Session Timeout (hours):"
                value={serverConfig && serverConfig.sessionTimeoutHours ? serverConfig.sessionTimeoutHours.toString() : DefaultSessionTimeoutHours.toString()}
                onChange={(newValue) => {
                    if (serverConfig) {
                        let hours = "";
                        let allowedChars = "0123456789";
                        for(let i = 0; i < newValue.length; i++)
                            if(allowedChars.includes(newValue[i])) 
                                hours += newValue[i];
                        setServerConfig({ ...serverConfig, sessionTimeoutHours: parseInt(hours) });
                    }
                }}/>
            <InputField
                caption="Link to imprint:"
                value={serverConfig ? (serverConfig.linkToImprint ? serverConfig.linkToImprint : '') : ''}
                onChange={(newValue) => {
                    if (serverConfig) {
                        setServerConfig({ ...serverConfig, linkToImprint: newValue });
                    }
                }}/>
            <InputField
                caption="Link to privacy policy:"
                value={serverConfig ? (serverConfig.linkToPrivacyPolicy ? serverConfig.linkToPrivacyPolicy : '') : ''}
                onChange={(newValue) => {
                    if (serverConfig) {
                        setServerConfig({ ...serverConfig, linkToPrivacyPolicy: newValue });
                    }
                }}/>
            <Button caption="Save Configuration" onClick={() => saveConfig() }/>
        </div>
    );
}