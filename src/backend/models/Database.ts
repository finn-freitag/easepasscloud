export type Database = {
    name: string;
    id: string;
    locked: boolean;
    lastLocked: Date;
    lockable: boolean;
    lastModified: Date;
}