import React from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import { GameScreen } from "./components/GameScreen";
import store from "./store";
import { GlobalStyle } from "./styles/GlobalStyle";
import { theme } from "./styles/theme";
import "./font/font.css";

function App() {
  return (
    <>
      <GlobalStyle />
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <GameScreen />
        </ThemeProvider>
      </Provider>
    </>
  );
}

export default App;
