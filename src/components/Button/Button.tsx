import styles from './Button.module.scss';

type ButtonProps = {
    onClick?: () => void;
    caption?: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
}

export default function Button(props: ButtonProps) {
    return <button disabled={props.disabled} type={props.type || "button"} onClick={props.onClick} className={styles.button}>{props.caption}</button>;
}