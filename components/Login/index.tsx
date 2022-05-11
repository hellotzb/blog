import type { NextPage } from 'next';
import { ChangeEvent, useState } from 'react';
import CountDown from '../CountDown';

import styles from './index.module.scss';

interface IProps {
  isShow: boolean;
  onClose: () => void;
}

const Login: NextPage<IProps> = ({ isShow = false, onClose }) => {
  const [form, setForm] = useState({ phone: '', verify: '' });

  const handleLogin = () => {};

  const handleOAuthLogin = () => {};

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return isShow ? (
    <div className={styles['login-area']}>
      <div className={styles['login-box']}>
        <div className={styles['login-title']}>
          <div>手机号登陆</div>
          <div className={styles['login-close']} onClick={onClose}>
            X
          </div>
        </div>
        <input
          name="phone"
          type="text"
          placeholder="请输入手机号"
          value={form.phone}
          onChange={handleFormChange}
        />
        <div className={styles['verify-code-area']}>
          <input
            name="verify"
            type="text"
            placeholder="请输入验证码"
            value={form.verify}
            onChange={handleFormChange}
          />
          <CountDown time={3} />
        </div>
        <div className={styles['login-btn']} onClick={handleLogin}>
          登录
        </div>
        <div className={styles['other-login']} onClick={handleOAuthLogin}>
          使用 Github 登录
        </div>
        <div className={styles['login-privacy']}>
          注册登录即表示同意
          {/* target="_blank" -> 从新标签页打开 */}
          <a
            href="https://moco.imooc.com/privacy.html"
            target="_blank"
            rel="noreferrer"
          >
            &nbsp;-&nbsp;隐私政策
          </a>
        </div>
      </div>
    </div>
  ) : null;
};

export default Login;
