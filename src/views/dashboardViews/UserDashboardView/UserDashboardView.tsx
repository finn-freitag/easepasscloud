import { useEffect, useState } from "react";
import { DashboardViewProps } from "../dashboardViewProps/DashboardViewProps";
import styles from "@/components/GeneralStyles.module.scss";
import { User } from "@/backend/models/User";
import Button from "@/components/Button/Button";
import Overlay from "@/components/Overlay/Overlay";
import InputField from "@/components/InputField/InputField";
import InputSwitch from "@/components/InputSwitch/InputSwitch";

export default function UserDashboardView(props: DashboardViewProps){
    const [users, setUsers] = useState<User[]>([]);
    const [reloadTrigger, reloadUsers] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [originalUsername, setOriginalUsername] = useState<string>("");
    const [deleteType, setDeleteType] = useState<string|null>(null);

    useEffect(()=>{
        fetch("/api/users", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({sessionToken: props.sessionToken})})
            .then(r=>r.json())
            .then(data => {
                console.log(data);
                if(data.success) {
                    setUsers(data.users);
                } else {
                    props.setInfoMessage("Failed to load users: " + data.message);
                }
            })
            .catch(() => {
                props.setInfoMessage("Failed to load users: Network error.");
            });
    }, [reloadTrigger]);

    useEffect(()=>{
        const interval = setInterval(()=>reloadUsers(prev => !prev), props.defaultValues.viewUpdateTime);
        return () => clearInterval(interval);
    }, []);

    function createUserClick(){
        fetch("/api/users/create", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({
                sessionToken: props.sessionToken,
                username: editUser?.username,
                password: editUser?.passwordHash,
                admin: editUser?.admin
            })})
            .then(r=>r.json())
            .then(data => {
                if(data.success) {
                    props.setInfoMessage("User created successfully.");
                    setEditUser(null);
                    reloadUsers(!reloadTrigger);
                } else {
                    props.setInfoMessage("Failed to create user: " + data.message);
                }
            })
            .catch(() => {
                props.setInfoMessage("Failed to create user: Network error.");
            });
    }

    function editUserClick(){
        fetch("/api/users/edit", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({
                sessionToken: props.sessionToken,
                username: originalUsername,
                newUsername: editUser?.username === originalUsername ? null : editUser?.username,
                password: editUser?.passwordHash && editUser?.passwordHash.length > 0 ? editUser.passwordHash : undefined,
                admin: editUser?.admin
            })})
            .then(r=>r.json())
            .then(data => {
                if(data.success) {
                    props.setInfoMessage("User edited successfully.");
                    setEditUser(null);
                    reloadUsers(!reloadTrigger);
                } else {
                    props.setInfoMessage("Failed to edit user: " + data.message);
                }
            })
            .catch(() => {
                props.setInfoMessage("Failed to edit user: Network error.");
            });
    }

    function deleteTyping(e: string){
        setDeleteType(e);
        if(e !== "delete")
            return;
        fetch("/api/users/delete", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({
                sessionToken: props.sessionToken,
                username: editUser?.username
            })})
            .then(r=>r.json())
            .then(data => {
                if(data.success) {
                    props.setInfoMessage("User deleted successfully.");
                    setEditUser(null);
                    setDeleteType(null);
                    if(editUser?.username === props.user.username){
                        window.location.reload();
                        return;
                    }
                    reloadUsers(!reloadTrigger);
                } else {
                    props.setInfoMessage("Failed to delete user: " + data.message);
                }
            })
            .catch(() => {
                props.setInfoMessage("Failed to delete user: Network error.");
            });
    }

    function getEmptyUser(): User {
        return {
            username: "",
            passwordHash: "",
            admin: false,
            databaseIDs: []
        }
    }

    return (
        <div className={styles.view}>
            <h2 style={{width:"100%",textAlign:"center"}}>Users</h2>
            <div className={styles.menuItem}>
                <strong>Username</strong>
                <strong>DB Count</strong>
                <strong>Admin</strong>
                <div style={{width:"3rem"}}></div>
            </div>
            {users.map((u,i)=>(
                <div key={i} className={styles.menuItem}>
                    <div>{u.username} {u.username === props.user.username ? <span className={styles.current}>{"(You)"}</span> : ""}</div>
                    <div>{u.databaseIDs.length}</div>
                    <div>{u.admin ? "✅" : "❌"}</div>
                    <Button
                        caption="⋮"
                        onClick={()=>{setEditUser(u); setIsEditing(true); setOriginalUsername(u.username);}} />
                </div>
            ))}
            <Button
                caption="Create User"
                onClick={()=>{setEditUser(getEmptyUser()); setIsEditing(false);}} />
            <Overlay visible={editUser !== null} onSideClick={()=>{setEditUser(null);}}>
                <div className={styles.form}>
                    <h2>{isEditing ? "Edit" : "Create"} User</h2>
                    {editUser && <>
                        <InputField
                            caption="Username"
                            value={editUser?.username}
                            onChange={(e)=>setEditUser(editUser ? {...editUser, username: e} : null)}/>
                        <InputField
                            caption="Password"
                            password
                            value={editUser?.passwordHash}
                            onChange={(e)=>setEditUser(editUser ? {...editUser, passwordHash: e} : null)}/>
                        <InputSwitch
                            caption="Is Admin"
                            value={editUser?.admin ?? false}
                            onChange={(e)=>setEditUser(editUser ? {...editUser, admin: e} : null)}/>
                        <Button
                            caption={isEditing ? "Save" : "Create"}
                            onClick={isEditing ? editUserClick : createUserClick}/>
                        <Button
                            caption="Delete"
                            onClick={()=>setDeleteType("")}/>
                        {deleteType !== null &&
                            <InputField
                                caption={"Type \"delete\" to remove this user"}
                                onChange={deleteTyping}/>
                        }
                    </>}
                </div>
            </Overlay>
        </div>
    );
}