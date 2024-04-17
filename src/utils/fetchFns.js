import useSWR from 'swr';
import qs from 'qs';

const {BASE_URL} = process.env;

// parse response and return apropriate to app response
const responseParser = async (response) => {
  try {
    const data = await response.json();
    
    switch (response.status) {
      case 200:
        return {
          data,
          isError: false,
        };
      case 404: 
      case 409:
      case 500:
        return {
          data: null,
          isError: new Error(data.message),
        };
      default:
        return {
          data: null,
          isError: data,
        };
    }
  } catch (error) {
    return {
      data: null,
      isError: error,
    };
  }
};

// functions
const fetchGet = async (url, queryData) => {
  try {
    let updatedUrl = url;
    if (queryData) {
      updatedUrl = updatedUrl.concat(`?${qs.stringify(queryData)}`);
    }
    
    const response = await fetch(updatedUrl);
    return responseParser(response);
  } catch (error) {
    return {
      data: null,
      isError: error,
    };
  }
};

const fetchPost = async (url, body) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };

  try {
    const response = await fetch(url, requestOptions);
    return await responseParser(response);
  } catch (error) {
    return {
      data: null,
      isError: error,
    };
  }
};

const fetchPatch = async (url, body) => {
  const requestOptions = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: body }),
  };

  try {
    const response = await fetch(url, requestOptions);
    return await responseParser(response);
  } catch (error) {
    return {
      data: null,
      isError: error,
    };
  }
};

const fetchPut = async (url, body) => {
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };

  try {
    const response = await fetch(url, requestOptions);
    return await responseParser(response);
  } catch (error) {
    return {
      data: null,
      isError: error,
    };
  }
};

const fetchDelete = async (url, queryData) => {
  const requestOptions = {
    method: 'DELETE',
  };
  let updatedUrl = url.concat(urlQueryStr(queryData, 'ids'));
  console.log(updatedUrl, 'DEL URL');
  return;



  // if (Array.isArray(ids)) {
  //   if (ids.length > 1) {
  //     // make query string
  //     const queryStr = ids.map((id) => `ids=${id}`).join('&');
  //     updatedUrl = updatedUrl.concat(`?${queryStr}`);
  //   } else {
  //     updatedUrl = updatedUrl.concat(`/${ids[0]}`);
  //   }
  // } else {
  //   updatedUrl = updatedUrl.concat(`/${ids}`);
  // }

  try {
    const response = await fetch(updatedUrl, requestOptions);
    return await responseParser(response);
  } catch (error) {
    return {
      data: null,
      isError: error,
    };
  }
};

const urlQueryStr = (data, arrayParam= 'ids') => {
  const arrayToQuery = (arr, arrParam) => {
    const params = arr.map((value) => `${arrParam}=${value}`).join('&');
    return params;
      
  };

  let queryStr = '?';
  if (Array.isArray(data) && data.length > 0) {
    // const params = data.map((value) => `${arrayParam}=${value}`).join('&');
    queryStr = queryStr.concat(arrayToQuery(data, arrayParam));
  } else if (typeof data === 'object') {
    const params = Object.values(data).map(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        // const params = data.map((value) => `${arrayParam}=${value}`).join('&');
        queryStr = queryStr.concat(arrayToQuery(value, key));
      } else if (!Array.isArray(value)) {
        return `${key}=${value}`;
      }
    }).join('&');

    queryStr = queryStr.concat(params);
  }

  return queryStr;
};

export {
  fetchGet,
  fetchPatch,
  fetchPost,
  fetchPut,
  fetchDelete,
};
