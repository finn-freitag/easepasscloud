'use client';
import styles from "./InputSwitch.module.scss";

type InputSwitchProps = {
    value: boolean;
    onChange: (newValue: boolean) => void;
    caption?: string;
}

export default function InputSwitch(props: InputSwitchProps){
    return (
        <div className={styles.container}>
            <label className={styles.switch}>
                <input type="checkbox" checked={props.value} onChange={e => props.onChange(e.target.checked)} />
                <span className={`${styles.slider} ${styles.round}`}></span>
            </label>
            {props.caption && <div className={styles.caption}>{props.caption}</div>}
        </div>
    );
}