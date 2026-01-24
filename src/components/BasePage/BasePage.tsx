import { ReactNode } from "react";
import styles from "./BasePage.module.scss";

type BasePageProps = {
    children: ReactNode
}

export default function BasePage(props: BasePageProps){
    return (
        <div>
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
        </div>
    );
}