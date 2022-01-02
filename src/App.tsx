import React, { useEffect } from "react";
import styled from "styled-components";
import { GameScreen } from "./components/GameScreen";
import "./font/font.css";
import { LoginButton } from "./components/LoginButton";
import { checkLoggedIn } from "./slices/userSlice";
import { useAppDispatch } from "./hooks/redux";

const StyledApp = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(checkLoggedIn());
  }, [dispatch]);

  return (
    <>
      <StyledApp>
        <LoginButton />
        <GameScreen />
      </StyledApp>
    </>
  );
}

export default App;
