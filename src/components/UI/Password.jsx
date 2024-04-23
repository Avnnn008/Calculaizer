import { useState } from 'react'
import s from './password.module.css'

export default function Password ({label, value, onChange, warning=false}) {
    const [visiblePassword, setVisiblePassword] = useState(false)
    return (
        <label className={s.password}>
              {label}
              <input
                type={visiblePassword ? "text" : "password"}
                value={value}
                onChange={onChange}
                className={warning ? `${s.input} ${s.warning}` : s.input}
              />
              <i
                onClick={() => setVisiblePassword((prev) => !prev)}
                className={
                  visiblePassword
                    ? "fa-regular fa-eye-slash"
                    : "fa-regular fa-eye"
                }
              ></i>
            </label>
    )
}