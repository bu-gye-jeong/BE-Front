import React from "react";
import styled from "styled-components";
import { useAppSelector } from "../hooks/redux";

const StyledButton = styled.button<{ loginStatus: string }>`
  height: 5em;
  background-color: ${({ theme }) => theme.color.uiBg};
  color: ${({ theme }) => theme.color.uiText};
  border: 0;

  transition: background-color 0.2s ease;

  :hover {
    ${({ theme, loginStatus }) =>
      loginStatus === "failed" && `background-color: ${theme.color.uiHover}`};
  }

  :active {
    ${({ theme, loginStatus }) =>
      loginStatus === "failed" && `background-color: ${theme.color.uiClicked}`};
  }
`;

export const LoginButton = () => {
  const loginStatus = useAppSelector((state) => state.user.status);
  const message: { [index: string]: string } = {
    idle: "LOADING",
    loading: "LOADING",
    succeeded: "LOGGED IN",
    failed: "LOGIN",
  };

  return (
    <StyledButton
      onClick={() =>
        loginStatus === "failed" && (window.location.href = "/api/auth")
      }
      loginStatus={loginStatus}>
      {message[loginStatus]}
    </StyledButton>
  );
};
