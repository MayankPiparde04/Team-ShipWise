import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";


const ActivateAccount = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  console.log(token);

  useEffect(() => {
    if (token) {
      axios
        .post(`http://localhost:5000/api/activation`, {
          "token": token
        })
        .then((response) => {
          console.log(response.data.message);
          navigate("/auth/login");
          // Handle success
        })
        .catch((error) => {
          console.error(error.response.data.errors); // Handle error
        });
    }
  }, [token, navigate]);

  return (
    <div className="text-center">
      <h1>Activating Your Account...</h1>
    </div>
  );
};

export default ActivateAccount;
