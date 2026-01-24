'use client';
import { useRef } from "react";
import styles from "./Overlay.module.scss";

type OverlayProps = {
    children: React.ReactNode,
    visible: boolean,
    onSideClick?: ()=>void
}

export default function Overlay(props: OverlayProps){
    const currentOverlay = useRef<HTMLDivElement>(null);
    return (
        <div ref={currentOverlay} onClick={(e)=>{if(e.target!==currentOverlay.current)return;if(props.onSideClick!=undefined)props.onSideClick();}} style={{display: props.visible ? "flex" : "none"}} className={styles.popup}>
            <div className={styles.card}>
                {props.children}
            </div>
        </div>
    );
}