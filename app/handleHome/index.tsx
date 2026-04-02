import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Link } from "react-router";
import { BACKEND_URL, getCsrfToken } from "../lib";

type PlayerData = Record<string, unknown>;
type GameData = { join_code: string };

export function HandleHome({ handle }: { handle: string }) {
    const [player, setPlayer] = useState<PlayerData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [newGame, setNewGame] = useState<GameData | null>(null);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetch(`${BACKEND_URL}/api/player/${handle}`, {
            credentials: "include",
        })
            .then((res) => {
                if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
                return res.json() as Promise<PlayerData>;
            })
            .then(setPlayer)
            .catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)));
    }, [handle]);

    function createGame() {
        setCreating(true);
        fetch(`${BACKEND_URL}/api/player/${handle}/game`, {
            method: "POST",
            credentials: "include",
            headers: { "X-CSRFToken": getCsrfToken() },
        })
            .then((res) => {
                if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
                return res.json() as Promise<GameData>;
            })
            .then(setNewGame)
            .catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)))
            .finally(() => setCreating(false));
    }

    return (
        <Container>
            <h1>Hello, {handle}</h1>
            {error && <p className="text-danger">{error}</p>}
            <Button onClick={createGame} disabled={creating}>
                {creating ? "Creating…" : "Create Game"}
            </Button>
            {newGame && (
                <p>
                    New game created:{" "}
                    <Link to={`/handle/${handle}/game/${newGame.join_code}`}>
                        {newGame.join_code}
                    </Link>
                </p>
            )}
            {player && <pre>{JSON.stringify(player, null, 2)}</pre>}
        </Container>
    );
}
