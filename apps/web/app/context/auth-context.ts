import { createContext } from "react-router";
import type { UserSession } from "@repo/validation";

export const userContext = createContext<UserSession | null>(null);
