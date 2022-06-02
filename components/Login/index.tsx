import { message } from 'antd';
import axios from 'axios';
import type { NextPage } from 'next';
import { ChangeEvent, useState } from 'react';
import CountDown from '../CountDown';

import styles from './index.module.scss';

interface IProps {
  isShow: boolean;
  onClose: () => void;
}

const Login: NextPage<IProps> = ({ isShow = false, onClose }) => {
  const [isCounting, setIsCounting] = useState(false);
  const [form, setForm] = useState({ phone: '', verify: '' });
  const handleLogin = () => {};

  const handleOAuthLogin = () => {};

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const startCountDown = () => {
    setIsCounting(true);
  };

  const endCountDown = () => {
    setIsCounting(false);
  };

  // 获取验证码
  const getVerifyCode = () => {
    const reg = /^(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
    if (!reg.test(form.phone)) {
      message.warning('请输入正确的手机号');
      return;
    }
    startCountDown();
    axios
      .post('/api/user/sendVerifyCode', {
        to: form?.phone,
        templateId: '1',
      })
      .then((res) => {
        if (res.data?.msg) {
          message.error(res.data.msg);
        }
      })
      .catch((err) => {
        message.error(err.msg || '未知错误');
      });
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
          <div className={styles['count-down-area']}>
            {isCounting ? (
              <CountDown time={60} endCountDown={endCountDown} />
            ) : (
              <span className={styles['verify-code']} onClick={getVerifyCode}>
                获取验证码
              </span>
            )}
          </div>
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
