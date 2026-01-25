'use client';
import styles from "./InputField.module.scss";

type InputFieldProps = {
    value?: string;
    onChange: (value: string) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    placeholder?: string;
    caption?: string;
    password?: boolean;
    numeric?: boolean;
}

export default function InputField(props: InputFieldProps) {
    return (
        <div className={styles.container}>
            {props.caption && <div>{props.caption}</div>}
            <input
                type={props.password === true ? "password" : "text"}
                value={props.value}
                onChange={e => {
                    if(props.numeric !== true){
                        props.onChange(e.target.value);
                        return;
                    }
                    let res = "";
                    let allowedChars = "0123456789";
                    for(let i = 0; i < e.target.value.length; i++)
                        if(allowedChars.includes(e.target.value[i])) 
                            res += e.target.value[i];
                    props.onChange(res);
                }}
                onKeyDown={props.onKeyDown}
                placeholder={props.placeholder}
                className={styles.inputField}
            />
        </div>
    );
}