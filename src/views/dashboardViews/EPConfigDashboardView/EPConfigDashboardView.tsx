import InputSwitch from "@/components/InputSwitch/InputSwitch";
import { DashboardViewProps } from "../dashboardViewProps/DashboardViewProps";
import { useEffect, useState } from "react";
import styles from "./EPConfigDashboardView.module.scss";
import { ServerConfig } from "@/backend/models/ServerConfig";
import { AccessToken } from "@/backend/models/AccessToken";

export default function EPConfigDashboardView(props: DashboardViewProps) {
    const [saveReadonlyOfflineCopies, setSaveReadonlyOfflineCopies] = useState(true);
    const [jsonConfig, setJsonConfig] = useState("");
    const [host, setHost] = useState<string|null>(null);
    const [accessTokens, setAccessTokens] = useState<string[]>([]);

    useEffect(()=>{
        fetch('/api/serverconfig/get/host', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ sessionToken: props.sessionToken })
            })
            .then(res => res.json())
            .then(data => {
                if(data.success){
                    setHost(data.host);
                } else {
                    props.setInfoMessage("Error fetching server config: " + data.message);
                }
            })
            .catch(err => {
                props.setInfoMessage("Error fetching server config: " + err.message);
            });
        fetch("/api/accesstokens", {method: "POST",headers: {"Content-Type": "application/json"}, body: JSON.stringify({sessionToken: props.sessionToken})})
            .then(r=>r.json())
            .then(data => {
                if(data.success) {
                    setAccessTokens((data.accessTokens as {accessToken: AccessToken, databaseName?: string}[]).filter(at=>at.accessToken.userID===props.user.username).map(at => at.accessToken.token));
                } else {
                    props.setInfoMessage("Failed to load access tokens: " + data.message);
                }
            })
            .catch(() => {
                props.setInfoMessage("Failed to load access tokens: Network error.");
            });
    },[]);

    useEffect(()=>{
        if(!host){
            setJsonConfig("");
            return;
        }
        let json = {
            "SaveReadonlyOfflineCopies": saveReadonlyOfflineCopies,
            "Host": host,
            "AccessTokens": accessTokens
        }
        setJsonConfig(JSON.stringify(json, null, 2));
    },[host, saveReadonlyOfflineCopies, accessTokens]);

    return (
        <div className={styles.view}>
            <h2 style={{width:"100%",textAlign:"center"}}>Ease Pass Config</h2>
            <p>Copy the json config below and paste it into your Ease Pass Cloud plugin configuration.</p>
            <InputSwitch
                caption="Save readonly offline copies"
                value={saveReadonlyOfflineCopies}
                onChange={setSaveReadonlyOfflineCopies}/>
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <textarea
                    className={styles.textarea}
                    readOnly
                    value={jsonConfig}
                    onClick={()=>navigator.clipboard.writeText(jsonConfig)} />
                <div className={styles.hint} onClick={()=>navigator.clipboard.writeText(jsonConfig)}>
                    Click the textarea to copy the config to clipboard.
                </div>
            </div>
        </div>
    );
}