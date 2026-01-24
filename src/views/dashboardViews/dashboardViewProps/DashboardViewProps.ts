import { User } from "@/backend/models/User";

export type DashboardViewProps = {
    user: User;
    sessionToken: string;
    setInfoMessage: (msg: string)=>void;
}