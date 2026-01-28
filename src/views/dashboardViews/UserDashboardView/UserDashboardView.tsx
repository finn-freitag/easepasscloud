import { useEffect, useState } from "react";
import { DashboardViewProps } from "../dashboardViewProps/DashboardViewProps";
import styles from "./UserDashboardView.module.scss";
import { User } from "@/backend/models/User";
import { DefaultViewUpdateTime } from "@/backend/DefaultValues";
import Button from "@/components/Button/Button";
import Overlay from "@/components/Overlay/Overlay";
import InputField from "@/components/InputField/InputField";
import InputSwitch from "@/components/InputSwitch/InputSwitch";

export default function UserDashboardView(props: DashboardViewProps){
    const [users, setUsers] = useState<User[]>([]);
    const [reloadTrigger, reloadUsers] = useState(false);

    const [createUser, setCreateUser] = useState(false);
    const [createUsername, setCreateUsername] = useState("");
    const [createPassword, setCreatePassword] = useState("");
    const [createAdmin, setCreateAdmin] = useState(false);

    const [editUser, setEditUser] = useState<User | null>(null);

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
        const interval = setInterval(()=>reloadUsers(!reloadTrigger), DefaultViewUpdateTime);
        return () => clearInterval(interval);
    }, []);

    function createUserClick(){
        fetch("/api/users/create", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({
                sessionToken: props.sessionToken,
                username: createUsername,
                password: createPassword,
                admin: createAdmin
            })})
            .then(r=>r.json())
            .then(data => {
                if(data.success) {
                    props.setInfoMessage("User created successfully.");
                    setCreateUser(false);
                    setCreateUsername("");
                    setCreatePassword("");
                    setCreateAdmin(false);
                    reloadUsers(!reloadTrigger);
                } else {
                    props.setInfoMessage("Failed to create user: " + data.message);
                }
            })
            .catch(() => {
                props.setInfoMessage("Failed to create user: Network error.");
            });
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
                    <div>{u.username}</div>
                    <div>{u.databaseIDs.length}</div>
                    <div>{u.admin ? "✅" : "❌"}</div>
                    <Button
                        caption="⋮"
                        onClick={()=>setEditUser(u)} />
                </div>
            ))}
            <Button
                caption="Create User"
                onClick={()=>setCreateUser(true)} />
            <Overlay visible={createUser} onSideClick={()=>setCreateUser(false)}>
                <div>
                    <h2>Create User</h2>
                    <InputField
                        caption="Username"
                        value={createUsername}
                        onChange={(e)=>setCreateUsername(e)}/>
                    <InputField
                        caption="Password"
                        value={createPassword}
                        onChange={(e)=>setCreatePassword(e)}/>
                    <InputSwitch
                        caption="Is Admin"
                        value={createAdmin}
                        onChange={(e)=>setCreateAdmin(e)}/>
                    <Button
                        caption="Create"
                        onClick={createUserClick}/>
                </div>
            </Overlay>
        </div>
    );
}