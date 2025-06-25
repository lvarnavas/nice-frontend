import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequests = useRef([]);

  // Added responseType argument with default "json"
  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}, responseType = "json") => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });

        let responseData;
        if (responseType === "blob") {
          responseData = await response.blob();
        } else if (responseType === "text") {
          responseData = await response.text();
        } else {
          responseData = await response.json();
        }

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          // For blob/text, responseData may not have .message, so fallback to statusText
          const errorMessage =
            responseData && responseData.message
              ? responseData.message
              : response.statusText || "Request failed!";
          throw new Error(errorMessage);
        }
        setIsLoading(false);
        return responseData;
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};