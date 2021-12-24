import "styled-components";
import { theme } from "./theme";

declare module "styled-components" {
  export interface DefaultTheme {
    color: { [key in keyof typeof theme.color]: string };
  }
}
