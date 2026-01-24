'use client';
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { DashboardViewProps } from "../dashboardViewProps/DashboardViewProps";
import { Database } from "@/backend/models/Database";
import Button from "@/components/Button/Button";
import buttonStyle from "@/components/Button/Button.module.scss";
import styles from "./DatabaseDashboardView.module.scss";
import Overlay from "@/components/Overlay/Overlay";
import InputField from "@/components/InputField/InputField";
import InputSwitch from "@/components/InputSwitch/InputSwitch";

export function DatabaseDashboardView(props: DashboardViewProps) {
    const [databases, setDatabases] = useState<Database[]>([]);
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [databaseName, setDatabaseName] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [isUpload, setIsUpload] = useState(false);
    const [isLockable, setIsLockable] = useState(false);
    const [reloadDBTrigger, reloadDatabases] = useState(false);
    const [editDatabase, setEditDatabase] = useState<Database|null>(null);
    const [dbEdited, setDbEdited] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);

    useEffect(()=>{
        console.log("Loading databases...");
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
    },[reloadDBTrigger]);

    useEffect(()=>{
        const interval = setInterval(()=>reloadDatabases(!reloadDBTrigger), 20000);
        return () => clearInterval(interval);
    }, []);

    function createDatabase() {
        setIsUpload(false);
        setOverlayVisible(true);
        setDatabaseName("");
        setIsLockable(true);
    }

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        setIsUpload(true);
        setOverlayVisible(true);
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setDatabaseName(e.target.files[0].name.split('.').slice(0, -1).join('.'));
        }
        else
            setDatabaseName("");
        setIsLockable(true);
    }

    function createDatabaseFinish() {
        setOverlayVisible(false);
        props.setInfoMessage('Database creation is not yet implemented. ❌');
        //reloadDatabases(!reloadDBTrigger);
    }

    async function uploadDatabaseFinish(e: FormEvent) {
        e.preventDefault();
        setOverlayVisible(false);
        if (!file) return;

        const formData = new FormData();
        formData.append('databaseFile', file);
        formData.append('sessionToken', props.sessionToken);
        formData.append('databaseName', databaseName);
        formData.append('isLockable', isLockable ? "true" : "false");

        try {
            const response = await fetch('/api/database/userupload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                props.setInfoMessage('Database upload successful! ✅');
            } else {
                props.setInfoMessage('Database upload failed ❌');
            }
        } catch (error) {
            props.setInfoMessage('Error connecting to server.');
        }
        reloadDatabases(!reloadDBTrigger);
    }

    function editDatabaseSave() {
        if(!dbEdited || !editDatabase) {
            setEditDatabase(null);
            return;
        }
        fetch("/api/database/metadata", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({database: editDatabase, sessionToken: props.sessionToken})
        })
        .then(r=>r.json())
        .then(data => {
            if(data.success) {
                props.setInfoMessage("Database updated successfully.");
                setEditDatabase(null);
                reloadDatabases(!reloadDBTrigger);
                setDbEdited(false);
                setDeleteConfirmation(false);
            } else {
                props.setInfoMessage("Failed to update database: " + data.message);
            }
        })
        .catch(() => {
            props.setInfoMessage("Failed to update database: Network error.");
        });
    }

    function typeDelete(val: string) {
        if(val === "delete" && editDatabase) {
            fetch("/api/database/delete", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({databaseId: editDatabase.id, sessionToken: props.sessionToken})
            })
            .then(r=>r.json())
            .then(data => {
                if(data.success) {
                    props.setInfoMessage("Database deleted successfully.");
                    setEditDatabase(null);
                    reloadDatabases(!reloadDBTrigger);
                    setDbEdited(false);
                    setDeleteConfirmation(false);
                } else {
                    props.setInfoMessage("Failed to delete database: " + data.message);
                }
            })
            .catch(() => {
                props.setInfoMessage("Failed to delete database: Network error.");
            });
        }
    }

    return (
        <div className={styles.databases}>
            <div className={styles.databaseItem}>
                <strong>Database Name</strong>
                <div className={styles.databaseItemRight}>
                    <strong>Last Modified</strong>
                    <strong>Lock status</strong>
                    <div style={{width:"3rem"}}></div>
                </div>
            </div>
            {databases.filter(x=>props.user.databaseIDs.includes(x.id)).map((db,i) => (
                <div key={i} className={styles.databaseItem}>
                    <div>{db.name}</div>
                    <div className={styles.databaseItemRight}>
                        <div>{new Date(db.lastModified).toLocaleDateString()}</div>
                        <div>{db.lockable ? (db.locked ? "locked" : "not locked") : "not lockable"}</div>
                        <Button caption="⋮" onClick={() => setEditDatabase(db)} />
                    </div>
                </div>
            ))}
            <form className={styles.buttons} onSubmit={uploadDatabaseFinish}>
                {/*<Button caption="Create new database" onClick={createDatabase} disabled />*/}
                <label className={buttonStyle.button} style={{display:"block"}}>
                    <input type="file" onChange={(e) => handleFileChange(e)} style={{display:"none"}} />
                    Upload database
                </label>
                <Overlay visible={overlayVisible} onSideClick={() => setOverlayVisible(false)}>
                    <div className={styles.overlayContent}>
                        <h2>{isUpload ? "Upload Database" : "Create Database"}</h2>
                        <InputField
                            caption="Database name:"
                            value={databaseName}
                            onChange={setDatabaseName}/>
                        <InputSwitch
                            caption="is lockable"
                            value={isLockable}
                            onChange={setIsLockable} />
                        <Button
                            type={isUpload ? "submit" : "button"}
                            caption={isUpload ? "Upload" : "Create"}
                            onClick={isUpload ? ()=>{} : createDatabaseFinish} />
                    </div>
                </Overlay>
            </form>
            {databases.filter(x=>!props.user.databaseIDs.includes(x.id)).length > 0 && <div className={styles.adminHint}>As admin you can also see databases of other users:</div>}
            {databases.filter(x=>!props.user.databaseIDs.includes(x.id)).map((db,i) => (
                <div key={i} className={styles.databaseItem}>
                    <div>{db.name}</div>
                    <div className={styles.databaseItemRight}>
                        <div>{new Date(db.lastModified).toLocaleDateString()}</div>
                        <div>{db.lockable ? (db.locked ? "locked" : "not locked") : "not lockable"}</div>
                        <Button caption="⋮" onClick={() => setEditDatabase(db)} />
                    </div>
                </div>
            ))}
            <Overlay visible={editDatabase !== null} onSideClick={() => {setEditDatabase(null); setDbEdited(false); setDeleteConfirmation(false);}}>
                <div className={styles.editDatabaseContainer}>
                    <h2>Edit Database: {editDatabase?.name}</h2>
                    <InputField
                        caption="Database name:"
                        value={editDatabase?.name || ""}
                        onChange={(val) => {
                            if(editDatabase){
                                setEditDatabase({...editDatabase, name: val});
                                setDbEdited(true);
                            }
                        }} />
                    <InputSwitch
                        caption="locked"
                        value={editDatabase?.locked || false}
                        onChange={(val) => {
                            if(editDatabase){
                                setEditDatabase({...editDatabase, locked: val});
                                setDbEdited(true);
                            }
                        }} />
                    <InputSwitch
                        caption="is lockable"
                        value={editDatabase?.lockable || false}
                        onChange={(val) => {
                            if(editDatabase){
                                setEditDatabase({...editDatabase, lockable: val});
                                setDbEdited(true);
                            }
                        }} />
                    <div className={styles.editDbButtons}>
                        <Button caption="Save" onClick={() => editDatabaseSave()} />
                        <Button caption="Delete" onClick={() => setDeleteConfirmation(true)} />
                    </div>
                    {deleteConfirmation && <InputField
                        caption="Type 'delete' to confirm deletion:"
                        onChange={(val) => typeDelete(val)} />
                    }
                </div>
            </Overlay>
        </div>
    );
}