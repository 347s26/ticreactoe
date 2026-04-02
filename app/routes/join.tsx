import type { Route } from "./+types/join";
import { JoinGame } from "../joinGame";

export default function JoinRoute({ params }: Route.ComponentProps) {
    return <JoinGame joinCode={params.joinCode} />;
}
