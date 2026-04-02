import type { Route } from "./+types/handle-game";
import { GameView } from "../gameView";

export default function HandleGameRoute({ params }: Route.ComponentProps) {
    return <GameView handle={params.handle} joinCode={params.joinCode} />;
}
