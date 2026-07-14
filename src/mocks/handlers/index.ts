import { playerTagHandlers } from "./playerTag";
import { playerHandlers } from "./player";
import { playerProfileHandlers } from "./playerProfile";
import { timelineHandlers } from "./timeline";
import { texasHandlers } from "./texas";

export const handlers = [
    ...playerTagHandlers,
    ...playerHandlers,
    ...playerProfileHandlers,
    ...timelineHandlers,
    ...texasHandlers,
];
