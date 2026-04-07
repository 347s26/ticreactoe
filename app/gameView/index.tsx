import { useEffect, useRef } from "react";
import Badge from "react-bootstrap/Badge";
import Container from "react-bootstrap/Container";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchGame, clearGame, makeMove, gameUpdated } from "../features/game/gameSlice";
import type { GameData } from "../features/game/gameSlice";
import { BACKEND_URL } from "../lib";

type Cell = "X" | "O" | null;

function Board({
    cells,
    onCellClick,
    clickable,
}: {
    cells: Cell[];
    onCellClick?: (index: number) => void;
    clickable: boolean;
}) {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                width: 240,
                gap: 4,
            }}
        >
            {cells.map((cell, i) => {
                const isClickable = clickable;
                return (
                    <div
                        key={i}
                        onClick={() => isClickable && onCellClick?.(i)}
                        style={{
                            height: 76,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 36,
                            fontWeight: "bold",
                            border: "2px solid #dee2e6",
                            borderRadius: 6,
                            background: isClickable ? "#e9f5ff" : "#f8f9fa",
                            color: cell === "X" ? "#0d6efd" : "#dc3545",
                            cursor: isClickable ? "pointer" : "default",
                        }}
                    >
                        {cell ?? ""}
                    </div>
                );
            })}
        </div>
    );
}

function vsLine(game: GameData) {
    return (
        <>
            {game.creator.handle} vs{" "}
            {game.opponent != null ? game.opponent.handle : <em>waiting for opponent</em>}
            {"  "}
            <Badge bg={game.in_progress ? "success" : "secondary"}>
                {game.in_progress ? "In progress" : "Finished"}
            </Badge>
        </>
    );
}

export function GameView({ handle, joinCode }: { handle: string; joinCode: string }) {
    const dispatch = useAppDispatch();
    const { current: game, fetchError, movePending, moveError } = useAppSelector((s) => s.game);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        dispatch(fetchGame({ handle, joinCode }));
        return () => { dispatch(clearGame()); };
    }, [dispatch, handle, joinCode]);

    useEffect(() => {
        let ws: WebSocket | null = null;
        let retryTimeout: ReturnType<typeof setTimeout> | null = null;
        let retryDelay = 1000;
        let stopped = false;

        function connect() {
            const wsUrl = BACKEND_URL
                .replace(/^http/, "ws")
                .replace("localhost", "127.0.0.1")
                + `/ws/game/${joinCode}/`;
            ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = () => { retryDelay = 1000; };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data) as GameData;
                dispatch(gameUpdated(data));
            };

            ws.onclose = () => {
                wsRef.current = null;
                if (!stopped) {
                    retryTimeout = setTimeout(() => {
                        retryDelay = Math.min(retryDelay * 2, 10000);
                        connect();
                    }, retryDelay);
                }
            };
        }

        connect();

        return () => {
            stopped = true;
            if (retryTimeout) clearTimeout(retryTimeout);
            ws?.close();
            wsRef.current = null;
        };
    }, [dispatch, joinCode]);

    const board: Cell[] = game?.states.at(-1)?.state_data.board_state ?? Array(9).fill(null);

    const mySymbol: "X" | "O" | null =
        game?.creator.handle === handle ? "X" :
        game?.opponent?.handle === handle ? "O" :
        null;

    const canPlay = mySymbol !== null && (game?.in_progress ?? false) && game?.opponent != null;

    function handleCellClick(index: number) {
        if (!canPlay || movePending) return;
        dispatch(makeMove({ handle, joinCode, cellIndex: index }));
    }

    const turnLabel = !game?.opponent
        ? "Waiting for opponent…"
        : !game.in_progress
        ? "Game over"
        : `You are ${mySymbol}`;

    return (
        <Container className="py-4">
            <h1 className="mb-1">Game {joinCode}</h1>
            {game && <p className="text-muted mb-3">{vsLine(game)}</p>}
            {fetchError && <p className="text-danger">{fetchError}</p>}
            {moveError && <p className="text-danger">{moveError}</p>}
            <p className="mb-3">{turnLabel}</p>
            <Board
                cells={board}
                onCellClick={handleCellClick}
                clickable={canPlay && !movePending}
            />
        </Container>
    );
}
