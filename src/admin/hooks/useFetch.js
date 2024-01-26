import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

export function useFetchTestCategory() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [testCategory, setTestCategory] = useState([]);

  useEffect(() => {
    const headers = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ClerkId: user?.id,
      },
    };
    try {
      const fetchTestCategory = async () => {
        setIsLoading(true);
        const response = await fetch(
          "https://api.alexsama.tech/api/autism-test-category",
          headers
        );
        const resData = await response.json();
        setTestCategory(resData.data);
        if (!response.ok) {
          throw new Error("Failed to fetch Test Category");
        }
        setIsLoading(false);
      };

      fetchTestCategory();
    } catch (error) {
      setError({
        message: error.message || "Failed to fetch Test Category",
      });
    }
  }, [user, refresh]);

  return { isLoading, error, testCategory, setRefresh };
}

export function usePostTestCategory() {
  const [postBody, setPostBody] = useState({});
  const { isSignedIn, user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState([]);

  useEffect(() => {
    const headers = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ClerkId: user?.id,
      },
      body: postBody,
    };
    const postTestCategory = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "https://api.alexsama.tech/api/autism-test-category",
          headers
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Test Category");
        }
        setResponse(response);
      } catch (error) {
        setError({
          message: error.message || "Failed to fetch Test Category",
        });
      }
      setIsLoading(false);
    };

    if (Object.keys(postBody).length !== 0) postTestCategory();
  }, [user, postBody]);

  return { isLoading, error, setPostBody, response, setResponse };
}
