import { createContext } from "react";
import data from "../../package.json";

export type ContextConfig = { title: string };

export const ConfigContext = createContext<ContextConfig>({
  title: data.title,
});
