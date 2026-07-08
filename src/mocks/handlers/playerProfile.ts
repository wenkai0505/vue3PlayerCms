import { http, HttpResponse } from "msw";
import { mockPlayerProfiles } from "@/mock/playerProfile";

export const playerProfileHandlers = [
    http.get("/api/profile/:playerId", ({ params }) => {
        const playerId = String(params.playerId);
        const profile = mockPlayerProfiles[playerId];

        if (!profile) {
            return HttpResponse.json(
                { message: "Player profile not found" },
                { status: 404 },
            );
        }

        return HttpResponse.json(profile);
    }),
];
