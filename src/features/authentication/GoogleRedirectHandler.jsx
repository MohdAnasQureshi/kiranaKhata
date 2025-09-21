import React from "react";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const GoogleRedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchTokens = async () => {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get("code");

      if (code) {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/v1/shopOwners/auth/google/callback`,
            {
              params: { code },
              withCredentials: true, // important for cookies
            }
          );
          console.log("Login successful:", response.data);
          // You can store access token in state or localStorage if needed
          navigate("/customers");
        } catch (err) {
          console.error("Google auth failed", err);
        }
      }
    };

    fetchTokens();
  }, [location]);

  return <div>Logging you in...</div>;
};

export default GoogleRedirectHandler;
