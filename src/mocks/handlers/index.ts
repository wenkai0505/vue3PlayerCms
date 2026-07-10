import { playerTagHandlers } from "./playerTag";
import { playerHandlers } from "./player";
import { playerProfileHandlers } from "./playerProfile";
import { timelineHandlers } from "./timeline";

export const handlers = [
    ...playerTagHandlers,
    ...playerHandlers,
    ...playerProfileHandlers,
    ...timelineHandlers,
];
