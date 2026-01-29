'use client';
import styles from "./BasePage.module.scss";
import { useEffect, useState } from "react";

type BasePageProps = {
    children: React.ReactNode;
}

export function BasePage(props: BasePageProps) {
    const [imprint, setImprint] = useState<string|null>(null);
    const [privacyPolicy, setPrivacyPolicy] = useState<string|null>(null);

    useEffect(()=>{
        console.log("BasePage: Fetching footer config");
        fetch("/api/serverconfig/get/footer")
            .then(r=>{
                console.log("BasePage: Response status:", r.status);
                return r.json();
            })
            .then(data => {
                console.log("BasePage: Footer data received:", data);
                setImprint(data.imprint);
                setPrivacyPolicy(data.privacyPolicy);
            })
            .catch(error => {
                console.error("BasePage: Error fetching footer:", error);
            });
    },[]);

    return (
        <>
            <div className={styles.acrylicContainer}>
                <div className={`${styles.ball} ${styles.ball1}`}></div>
                <div className={`${styles.ball} ${styles.ball2}`}></div>
                <div className={`${styles.ball} ${styles.ball3}`}></div>
            </div>

            <div className={styles.content}>
                <div className={styles.innerContent}>
                    {props.children}
                </div>
            </div>

            <div className={styles.footer}>
                {imprint && (
                    <a href={imprint} target="_blank" rel="noopener noreferrer">Imprint</a>
                )}
                {privacyPolicy && (
                    <a href={privacyPolicy} target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                )}
            </div>
        </>
    );
}