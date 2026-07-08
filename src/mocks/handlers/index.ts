import { playerTagHandlers } from "./playerTag";
import { playerHandlers } from "./player";
import { playerProfileHandlers } from "./playerProfile";

export const handlers = [
    ...playerTagHandlers,
    ...playerHandlers,
    ...playerProfileHandlers,
];
