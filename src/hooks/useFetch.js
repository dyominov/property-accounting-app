import useSWR from 'swr';
import qs from 'qs';

const {BASE_URL} = process.env;

// helper fetchers
const fetcherGet = (url, queryData) => {
  let updatedUrl = url;
  if (queryData) {
    updatedUrl = updatedUrl.concat(`?${qs.stringify(queryData)}`);
  }

  return fetch(updatedUrl).then(res => res.json());
};

const fetcherPost = (url, body) => {
  const requestOptions = {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
    },
    body,
  };

  return fetch(url, requestOptions).then(res => res.json());
};

const fetcherPut = (url, body) => {
  const requestOptions = {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
    },
    body,
  };

  return fetch(url, requestOptions).then(res => res.json());
};

const fetcherDelete = (url) => {
  const requestOptions = {
    method: 'DELETE',
  };

  return fetch(url, requestOptions).then(res => res.json());
};

// hooks
const useFetchGet = (url, queryData) => {
  const { data, error, isLoading } = useSWR([url, queryData], ([url, queryData]) => fetcherGet(url, queryData));

  const response = {
    data,
    isLoading,
    isError: error,
  };

  return response;
};

const useFetchPost = (url, body) => {
  const { data, error, isLoading } = useSWR(
    [url, body], 
    ([url, body]) => fetcherPost(url, JSON.stringify(body))
  );

  const response = {
    data,
    isLoading,
    isError: error,
  };

  console.log(response, 'POST response');

  return response;
};

const useFetchPut = (url, body) => {
  const { data, error, isLoading } = useSWR(
    [url, body], 
    ([url, body]) => fetcherPut(url, JSON.stringify(body))
  );

  const response = {
    data,
    isLoading,
    isError: error,
  };

  console.log(response, 'PUT response');

  return response;
};

const useFetchDelete = (url) => {

  const { data, error, isLoading } = useSWR(url, fetcherDelete);

  const response = {
    data,
    isLoading,
    isError: error,
  };

  console.log(response, 'DELETE response');

  return response;
};

export default useFetchGet;

export {
  useFetchGet,
  useFetchPost,
  useFetchPut,
  useFetchDelete,
};
