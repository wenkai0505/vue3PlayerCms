import { playerTagHandlers } from "./playerTag";
import { playerHandlers } from "./player";

export const handlers = [...playerTagHandlers, ...playerHandlers];
