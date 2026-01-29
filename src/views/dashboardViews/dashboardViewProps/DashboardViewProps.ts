import { DefaultValues } from "@/backend/DefaultValues";
import { User } from "@/backend/models/User";

export type DashboardViewProps = {
    user: User;
    sessionToken: string;
    setInfoMessage: (msg: string)=>void;
    defaultValues: DefaultValues;
}