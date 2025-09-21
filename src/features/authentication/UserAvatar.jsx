import React from "react";
import styled from "styled-components";
// import HeaderMenu from "./HeaderMenu";
import { useShopOwner } from "../shopOwners/useShopOwner";

const StyledUserAvatar = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;
  font-weight: 500;
  font-size: 1.4rem;
  color: var(--color-grey-600);
`;

const Avatar = styled.img`
  display: block;
  width: 3.4rem;
  aspect-ratio: 1;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
  outline: 1px solid var(--color-grey-100);
`;

function UserAvatar() {
  const { shopOwner } = useShopOwner();
  const { fullName, shopOwnerPhoto } = shopOwner;

  return (
    <StyledUserAvatar>
      <Avatar
        src={shopOwnerPhoto || "default-user.jpg"}
        alt={`Avatar of ${fullName}`}
      />
      <span>{fullName}</span>
    </StyledUserAvatar>
  );
}

export default UserAvatar;
