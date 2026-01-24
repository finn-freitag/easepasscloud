'use client';
import styles from "./InputField.module.scss";

type InputFieldProps = {
    value?: string;
    onChange: (value: string) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    placeholder?: string;
    caption?: string;
    password?: boolean;
}

export default function InputField(props: InputFieldProps) {
    return (
        <div className={styles.container}>
            {props.caption && <div>{props.caption}</div>}
            <input
                type={props.password === true ? "password" : "text"}
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
                onKeyDown={props.onKeyDown}
                placeholder={props.placeholder}
                className={styles.inputField}
            />
        </div>
    );
}