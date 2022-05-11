import type { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';

import styles from './index.module.scss';

interface IProps {
  time: number;
}

const CountDown: NextPage<IProps> = ({ time }) => {
  const [count, setCount] = useState(time || 60);
  const [isCounting, setIsCounting] = useState(false);
  const timer = useRef<any>(null);

  const startCountDown = () => {
    setIsCounting(true);
    timer.current = setInterval(() => {
      setCount((prevCount) => prevCount - 1);
    }, 1000);
  };

  useEffect(() => {
    if (count < 0) {
      timer.current && clearInterval(timer.current);
      setIsCounting(false);
    }
  }, [count]);

  useEffect(() => {
    return () => {
      timer.current && clearInterval(timer.current);
    };
  }, []);

  return isCounting ? (
    <div className={styles['count-down']}>{count}</div>
  ) : (
    <div className={styles['verify-code']} onClick={startCountDown}>
      获取验证码
    </div>
  );
};

export default CountDown;
