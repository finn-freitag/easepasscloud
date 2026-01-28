'use client';
import { AccessToken } from "@/backend/models/AccessToken";
import { DashboardViewProps } from "../dashboardViewProps/DashboardViewProps";
import { useEffect, useState } from "react";
import Button from "@/components/Button/Button";
import styles from "./AccessTokenDashboardView.module.scss";
import generalstyles from "@/components/GeneralStyles.module.scss";
import Overlay from "@/components/Overlay/Overlay";
import InputField from "@/components/InputField/InputField";
import { Database } from "@/backend/models/Database";
import InputSwitch from "@/components/InputSwitch/InputSwitch";
import { DefaultAccessTokenExpiryDays, DefaultViewUpdateTime } from "@/backend/DefaultValues";

export default function AccessTokenDashboardView(props: DashboardViewProps) {
    const [accessTokens, setAccessTokens] = useState<{accessToken: AccessToken, databaseName?: string}[]>([]);
    const [databases, setDatabases] = useState<Database[]>([]);
    const [reloadTrigger, reloadAccessTokens] = useState(false);

    const [isCreating, setIsCreating] = useState(false);
    const [selectedDatabaseID, setSelectedDatabaseID] = useState<string|null>(null);
    const [expiresAt, setExpiresAt] = useState<Date|null>(new Date(Date.now()+DefaultAccessTokenExpiryDays*24*60*60*1000));
    const [username, setUsername] = useState<string>(props.user.username);
    const [readonly, setReadonly] = useState<boolean>(false);

    const [editToken, setEditToken] = useState<AccessToken|null>(null);

    const [deleteType, setDeleteType] = useState<string|null>(null);

    useEffect(()=>{
        fetch("/api/accesstokens", {method: "POST",headers: {"Content-Type": "application/json"}, body: JSON.stringify({sessionToken: props.sessionToken})})
            .then(r=>r.json())
            .then(data => {
                if(data.success) {
                    setAccessTokens(data.accessTokens);
                } else {
                    props.setInfoMessage("Failed to load access tokens: " + data.message);
                }
            })
            .catch(() => {
                props.setInfoMessage("Failed to load access tokens: Network error.");
            });
        fetch("/api/database", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({sessionToken: props.sessionToken})})
            .then(r=>r.json())
            .then(data => {
                console.log(data);
                if(data.success) {
                    setDatabases(data.databases);
                } else {
                    props.setInfoMessage("Failed to load databases: " + data.message);
                }
            })
            .catch(() => {
                props.setInfoMessage("Failed to load databases: Network error.");
            });
    },[reloadTrigger, props.user.databaseIDs]);

    useEffect(()=>{
        const interval = setInterval(()=>reloadAccessTokens(prev => !prev), DefaultViewUpdateTime);
        return () => clearInterval(interval);
    },[]);

    function createAccessToken(){
        if(!selectedDatabaseID) {
            props.setInfoMessage("Please select a database.");
            return;
        }
        fetch("/api/accesstokens/create", {method: "POST",headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                sessionToken: props.sessionToken,
                databaseID: selectedDatabaseID,
                username: props.user.admin ? username : props.user.username,
                expiresAt: expiresAt,
                readonly: readonly
            })})
            .then(r=>r.json())
            .then(data => {
                if(data.success) {
                    props.setInfoMessage("Access token created successfully.");
                    setIsCreating(false);
                    reloadAccessTokens(!reloadTrigger);
                } else {
                    props.setInfoMessage("Failed to create access token: " + data.message);
                }
            })
            .catch(() => {
                props.setInfoMessage("Failed to create access token: Network error.");
            });
    }

    function saveAccessToken(){
        if(!editToken) return;
        fetch("/api/accesstokens/edit", {method: "POST",headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                sessionToken: props.sessionToken,
                accessToken: editToken
            })})
            .then(r=>r.json())
            .then(data => {
                if(data.success) {
                    props.setInfoMessage("Access token saved successfully.");
                    setEditToken(null);
                    reloadAccessTokens(!reloadTrigger);
                } else {
                    props.setInfoMessage("Failed to save access token: " + data.message);
                }
            })
            .catch(() => {
                props.setInfoMessage("Failed to save access token: Network error.");
            });
    }

    function deleteTypeing(e: string){
        setDeleteType(e);
        if(e !== "delete")
            return;
        setDeleteType(null);
        fetch("/api/accesstokens/delete", {method: "POST",headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                sessionToken: props.sessionToken,
                accessToken: editToken
            })})
            .then(r=>r.json())
            .then(data => {
                if(data.success) {
                    props.setInfoMessage("Access token deleted successfully.");
                    setEditToken(null);
                    reloadAccessTokens(!reloadTrigger);
                } else {
                    props.setInfoMessage("Failed to delete access token: " + data.message);
                }
            })
            .catch(() => {
                props.setInfoMessage("Failed to delete access token: Network error.");
            });
    }

    return (
        <div className={generalstyles.view}>
            <h2 style={{width:"100%",textAlign:"center"}}>Access Tokens</h2>
            <div className={generalstyles.menuItem}>
                <strong>Enabled</strong>
                <strong>Username</strong>
                <strong>Database Name</strong>
                <strong>Expires At</strong>
                <div style={{width:"3rem"}}></div>
            </div>
            {accessTokens.filter(t=>t.accessToken.userID===props.user.username).map((t,i)=>(
                <div key={i} className={generalstyles.menuItem}>
                    <div>{t.accessToken.enabled ? "✅" : "❌"} {t.accessToken.readonly ? "⛔" : ""}</div>
                    <div>{t.accessToken.userID}</div>
                    <div>{t.databaseName ? t.databaseName : "unknown"}</div>
                    <div>{t.accessToken.expiresAt ? new Date(t.accessToken.expiresAt).toLocaleDateString() : "Never"}</div>
                    <Button caption="⋮" onClick={() => setEditToken(t.accessToken)} />
                </div>
            ))}
            <Button caption="Create Access Token" onClick={()=>setIsCreating(true)} />
            {accessTokens.filter(t=>t.accessToken.userID!==props.user.username).length > 0 && <div className={styles.adminHint}>As admin you can also see access tokens of other users:</div>}
            {accessTokens.filter(t=>t.accessToken.userID!==props.user.username).map((t,i)=>(
                <div key={i} className={generalstyles.menuItem}>
                    <div>{t.accessToken.enabled ? "✅" : "❌"} {t.accessToken.readonly ? "⛔" : ""}</div>
                    <div>{t.accessToken.userID}</div>
                    <div>{t.databaseName ? t.databaseName : "unknown"}</div>
                    <div>{t.accessToken.expiresAt ? new Date(t.accessToken.expiresAt).toLocaleDateString() : "Never"}</div>
                    <Button caption="⋮" onClick={() => setEditToken(t.accessToken)} />
                </div>
            ))}
            <Overlay visible={isCreating} onSideClick={()=>setIsCreating(false)} >
                <div className={generalstyles.form}>
                    <h2>Create Access Token</h2>
                    {props.user.admin && <InputField
                        caption="Username"
                        value={username}
                        onChange={setUsername}/>}
                    <InputSwitch
                        caption="Can Expire"
                        value={expiresAt !== null}
                        onChange={(v)=>{
                            if(v) setExpiresAt(new Date(Date.now()+DefaultAccessTokenExpiryDays*24*60*60*1000));
                            else setExpiresAt(null);
                        }} />
                    {expiresAt && <InputField
                        caption="Expires in days:"
                        numeric
                        value={Math.ceil((expiresAt.getTime()-Date.now())/(24*60*60*1000)).toString()}
                        onChange={(v)=>setExpiresAt(new Date(Date.now()+parseInt(v)*24*60*60*1000))} />}
                    <InputSwitch
                        caption="Readonly Access"
                        value={readonly}
                        onChange={setReadonly} />
                    <p>Selected a database:</p>
                    <div className={styles.databaseList}>
                        {databases.map((db,i)=>(
                            <div key={i} className={styles.databaseBtn} style={selectedDatabaseID==db.id?{backgroundColor:"var(--Accent)",fontWeight:"bolder"}:{}} onClick={()=>setSelectedDatabaseID(db.id)}>
                                {db.name} {!props.user.databaseIDs.includes(db.id) ? <span style={{color:"var(--Accent)"}}>{" (extern)"}</span> : ""}
                            </div>
                        ))}
                    </div>
                    <Button caption="Create" onClick={createAccessToken} />
                </div>
            </Overlay>
            <Overlay visible={editToken!==null} onSideClick={()=>setEditToken(null)}>
                <div className={generalstyles.form}>
                    <h2>Edit Access Token</h2>
                    <InputSwitch
                        caption="Enabled"
                        value={editToken?.enabled??false}
                        onChange={(v)=>{
                            if(editToken) setEditToken({...editToken, enabled: v});
                        }} />
                    <InputSwitch
                        caption="Can Expire"
                        value={editToken?.expiresAt !== null}
                        onChange={(v)=>{
                            if(v) setEditToken(editToken ? {...editToken, expiresAt: new Date(Date.now()+DefaultAccessTokenExpiryDays*24*60*60*1000)} : null);
                            else setEditToken(editToken ? {...editToken, expiresAt: null} : null);
                        }} />
                    {editToken?.expiresAt && <InputField
                        caption="Expires in days:"
                        numeric
                        value={Math.ceil((new Date(editToken.expiresAt).getTime()-Date.now())/(24*60*60*1000)).toString()}
                        onChange={(v)=>setEditToken(editToken ? {...editToken, expiresAt: new Date(Date.now()+parseInt(v)*24*60*60*1000)} : null)} />}
                    <InputSwitch
                        caption="Readonly Access"
                        value={editToken?.readonly??false}
                        onChange={(v)=>{
                            if(editToken) setEditToken({...editToken, readonly: v});
                        }} />
                    <Button caption="Save" onClick={saveAccessToken} />
                    <Button caption="Delete" onClick={()=>setDeleteType("")} />
                    {deleteType !== null && <InputField
                        caption={"Type \"delete\" to delete the token:"}
                        value={deleteType ?? ""}
                        onChange={(e)=>deleteTypeing(e)} />}
                </div>
            </Overlay>
        </div>
    );
}