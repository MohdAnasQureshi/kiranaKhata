import React, { useEffect } from "react";
import PropTypes from "prop-types";

import styled from "styled-components";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import { useShopOwner } from "../features/shopOwners/useShopOwner";

const FullPage = styled.div`
  height: 100dvh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { isLoading, shopOwner } = useShopOwner();

  useEffect(() => {
    if (!shopOwner && !isLoading) navigate("/login");
  }, [isLoading, shopOwner, navigate]);

  if (isLoading)
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );
  if (shopOwner) return <div>{children}</div>;
  return null;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
