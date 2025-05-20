export const useApiFetch = () => {
  const baseApi = "http://localhost:5001/api";

  const makeRequest = async (url, params = {}) => {
    const token = localStorage.getItem("jwt_token");
    console.log(params);

    if (!token) return null;

    const response = await fetch(baseApi + url, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(params)
      });

    return await response.json();
  };

  const getRequest = async (url) => {
    const token = localStorage.getItem("jwt_token");

    if (!token) return null;

    const response = await fetch(baseApi + url, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });

    return await response.json();
  };

  const anyRequest = async (url, params = {}) => {
    const response = await fetch(baseApi + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    return await response.json();
  };

  const makeFileRequest = async (url, params = {}) => {
    const token = localStorage.getItem("jwt_token");
    const response = await fetch(baseApi + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    });

    return await response.blob();
  };

  return { makeFileRequest, makeRequest, anyRequest, getRequest };
};
