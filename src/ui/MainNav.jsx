import styled from "styled-components";
import React from "react";
import { NavLink } from "react-router-dom";
import { HiHome } from "react-icons/hi2";
import { HiUsers } from "react-icons/hi2";
import { HiUserPlus } from "react-icons/hi2";
import { HiClipboardDocumentCheck } from "react-icons/hi2";
import { HiMiniCog8Tooth } from "react-icons/hi2";
const NavList = styled.ul`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;

const StyledNavLink = styled(NavLink)`
  &:link,
  &:visited {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-direction: column;
    color: var(--color-grey-600);
    font-size: 1rem;
    font-weight: 500;
    padding: 1rem;
    transition: all 0.3s;
    margin-top: 2px;
  }

  /* This works because react-router places the active class on the active NavLink */

  &:hover,
  &:active,
  &.active:link,
  &.active:visited {
    color: var(--color-grey-800);
    background: linear-gradient(
      to bottom,
      var(--color-brand-100),
      transparent 50%
    );
    border-radius: var(--border-radius-md);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }

  &:hover svg,
  &:active svg,
  &.active:link svg,
  &.active:visited svg {
    color: var(--color-brand-600);
  }
`;

const StyledAddCustomer = styled(StyledNavLink)`
  padding-top: 0px;
  & svg {
    color: var(--color-grey-600);
    height: 3.8rem;
    width: 3.8rem;
    transition: all 0.3s;
  }
`;

const MainNav = () => {
  return (
    <nav>
      <NavList>
        <li>
          <StyledNavLink to="/dashboard">
            <HiHome />
            <span>Home</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/customers">
            <HiUsers />
            <span>Customers</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledAddCustomer to="/addCustomer" style={{ paddingTop: "0px" }}>
            <HiUserPlus />
            <span>Add Customer</span>
          </StyledAddCustomer>
        </li>
        <li>
          <StyledNavLink to="/stockOrderList">
            <HiClipboardDocumentCheck />
            <span>Stock List</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/settings">
            <HiMiniCog8Tooth />
            <span>Settings</span>
          </StyledNavLink>
        </li>
      </NavList>
    </nav>
  );
};

export default MainNav;
