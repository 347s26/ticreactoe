import { useEffect } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Link } from "react-router";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchPlayer } from "../features/player/playerSlice";
import { createGame, clearNewGame } from "../features/game/gameSlice";

export function HandleHome({ handle }: { handle: string }) {
    const dispatch = useAppDispatch();
    const { data: player, error: playerError } = useAppSelector((s) => s.player);
    const { creating, createError, newGame } = useAppSelector((s) => s.game);

    useEffect(() => {
        dispatch(fetchPlayer(handle));
        dispatch(clearNewGame());
    }, [dispatch, handle]);

    const error = playerError ?? createError;

    return (
        <Container>
            <h1>Hello, {handle}</h1>
            {error && <p className="text-danger">{error}</p>}
            <Button onClick={() => dispatch(createGame(handle))} disabled={creating}>
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
