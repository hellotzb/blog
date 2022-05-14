import type { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';

import styles from './index.module.scss';

interface IProps {
  time: number;
  endCountDown: () => void;
}

const CountDown: NextPage<IProps> = ({ time, endCountDown }) => {
  const [count, setCount] = useState(time || 60);
  const timer = useRef<any>(null);

  useEffect(() => {
    timer.current = setInterval(() => {
      setCount((prevCount) => prevCount - 1);
    }, 1000);

    return () => {
      timer.current && clearInterval(timer.current);
    };
  }, []);

  useEffect(() => {
    if (count < 0) {
      timer.current && clearInterval(timer.current);
      endCountDown?.();
    }
  }, [count]);

  return <div className={styles['count-down']}>{count}</div>;
};

export default CountDown;
