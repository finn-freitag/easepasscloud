import InputField from "@/components/InputField/InputField";
import { DashboardViewProps } from "../dashboardViewProps/DashboardViewProps";
import { useState } from "react";
import Button from "@/components/Button/Button";
import styles from "./ProfileDashboardView.module.scss";

export default function ProfileDashboardView(props: DashboardViewProps){
    const [username, setUsername] = useState(props.user.username);
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [oldPassword, setOldPassword] = useState("");

    function updateUsername(){
        fetch("/api/profile/username", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                username: props.user.username,
                newUsername: username,
                sessionToken: props.sessionToken
            })
        })
        .then(r=>r.json())
        .then(data => {
            if(data.success) {
                props.setInfoMessage("Username updated successfully. Please log in again.");
                window.location.reload();
                return;
            } else {
                props.setInfoMessage(`Failed to update username: ${data.message}`);
            }
        })
        .catch(() => {
            props.setInfoMessage("Failed to update username. Please try again.");
        });
    }

    function updatePassword(){
        if(password !== passwordConfirm) {
            props.setInfoMessage("Passwords do not match.");
            return;
        }
        fetch("/api/profile/password", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                username: props.user.username,
                oldPassword: oldPassword,
                newPassword: password,
                sessionToken: props.sessionToken
            })
        })
        .then(r=>r.json())
        .then(data => {
            if(data.success) {
                props.setInfoMessage("Password updated successfully. Please log in again.");
                window.location.reload();
                return;
            } else {
                props.setInfoMessage(`Failed to update password: ${data.message}`);
            }
        })
        .catch(() => {
            props.setInfoMessage("Failed to update password. Please try again.");
        });
    }

    return (
        <div className={styles.view}>
            <h2>Profile</h2>
            <InputField
                caption="Username"
                value={username}
                onChange={setUsername}/>
            <Button
                caption="Update username"
                onClick={updateUsername}/>
            <InputField
                caption="New Password"
                value={password}
                onChange={setPassword}
                password={true}/>
            <InputField
                caption="Confirm Password"
                value={passwordConfirm}
                onChange={setPasswordConfirm}
                password={true}/>
            <InputField
                caption="Old Password"
                value={oldPassword}
                onChange={setOldPassword}
                password={true}/>
            <Button
                caption="Update password"
                onClick={updatePassword}/>
            <div>
                Hint: Do not store your Ease Pass Cloud credentials in a remote database of the same instance. If your access token expires or is revoked, you may lose access to your data.
            </div>
        </div>
    );
}