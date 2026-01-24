export type ViewProps = {
    onNavigateBack: (nextView: string, viewParameters?: any)=>void;
    setInfoMessage: (msg: string)=>void;
    viewParameters?: any;
};