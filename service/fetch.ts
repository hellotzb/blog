import useSWR from 'swr';
import axios from 'axios';

const fetcher = (url: string) => axios.post(url).then((res) => res.data);

export const useRequest = (url: string | null) => {
  const { data, error, isValidating, mutate } = useSWR(url, fetcher);
  return { data, error, isValidating, mutate };
};
