import { useEffect, useState } from "react";
import Badge from "react-bootstrap/Badge";
import Container from "react-bootstrap/Container";
import { BACKEND_URL } from "../lib";

type Cell = "X" | "O" | null;

type GameState = {
    state_data: { board_state: Cell[] };
    created_at: string;
};

type Player = { id: number; handle: string };

type GameData = {
    join_code: string;
    in_progress: boolean;
    creator: Player;
    opponent: Player | null;
    created_at: string;
    states: GameState[];
};

function Board({ cells }: { cells: Cell[] }) {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                width: 240,
                gap: 4,
            }}
        >
            {cells.map((cell, i) => (
                <div
                    key={i}
                    style={{
                        height: 76,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 36,
                        fontWeight: "bold",
                        border: "2px solid #dee2e6",
                        borderRadius: 6,
                        background: "#f8f9fa",
                        color: cell === "X" ? "#0d6efd" : "#dc3545",
                    }}
                >
                    {cell ?? ""}
                </div>
            ))}
        </div>
    );
}

export function GameView({ handle, joinCode }: { handle: string; joinCode: string }) {
    const [game, setGame] = useState<GameData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`${BACKEND_URL}/api/player/${handle}/game/${joinCode}`, {
            credentials: "include",
        })
            .then((res) => {
                if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
                return res.json() as Promise<GameData>;
            })
            .then(setGame)
            .catch((err: unknown) =>
                setError(err instanceof Error ? err.message : String(err))
            );
    }, [handle, joinCode]);

    const board: Cell[] = game?.states.at(-1)?.state_data.board_state ?? Array(9).fill(null);

    return (
        <Container className="py-4">
            <h1 className="mb-1">Game {joinCode}</h1>
            {game && (
                <p className="text-muted mb-3">
                    {game.creator.handle} vs{" "}
                    {game.opponent != null ? game.opponent.handle : <em>waiting for opponent</em>}
                    {"  "}
                    <Badge bg={game.in_progress ? "success" : "secondary"}>
                        {game.in_progress ? "In progress" : "Finished"}
                    </Badge>
                </p>
            )}
            {error && <p className="text-danger">{error}</p>}
            <Board cells={board} />
        </Container>
    );
}
