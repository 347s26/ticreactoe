import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Link } from "react-router";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchPlayer } from "../features/player/playerSlice";
import { createGame, clearNewGame } from "../features/game/gameSlice";

export function HandleHome({ handle }: { handle: string }) {
    const dispatch = useAppDispatch();
    const { data: player } = useAppSelector((s) => s.player);
    const { creating, createError, newGame } = useAppSelector((s) => s.game);
    const { username } = useAppSelector((s) => s.auth);

    // Dropdown options: current handle always first, then logged-in username if different
    const knownHandles = [
        handle,
        ...(username && username !== handle ? [username] : []),
    ];
    const [altHandle, setAltHandle] = useState(knownHandles[0]);
    const [customHandle, setCustomHandle] = useState("");

    // Keep dropdown default in sync if username loads after mount
    useEffect(() => {
        setAltHandle(knownHandles[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [username]);

    useEffect(() => {
        dispatch(fetchPlayer(handle));
        dispatch(clearNewGame());
    }, [dispatch, handle]);

    const effectiveAltHandle = customHandle.trim() || altHandle;
    const error = createError;

    return (
        <Container>
            <h1>Hello, {handle}</h1>
            {error && <p className="text-danger">{error}</p>}

            <Button onClick={() => dispatch(createGame(handle))} disabled={creating}>
                {creating ? "Creating…" : `Create new game as ${handle}`}
            </Button>

            <p className="my-3 text-muted fw-semibold">— OR —</p>

            <p className="mb-2">Create new game as:</p>
            <Form.Select
                value={altHandle}
                onChange={(e) => setAltHandle(e.target.value)}
                style={{ maxWidth: 300 }}
                className="mb-2"
            >
                {knownHandles.map((h) => (
                    <option key={h} value={h}>{h}</option>
                ))}
            </Form.Select>
            <Form.Control
                type="text"
                placeholder="Or enter a new handle…"
                value={customHandle}
                onChange={(e) => setCustomHandle(e.target.value)}
                style={{ maxWidth: 300 }}
                className="mb-2"
            />
            <Button
                onClick={() => dispatch(createGame(effectiveAltHandle))}
                disabled={creating || !effectiveAltHandle}
            >
                {creating ? "Creating…" : `Create new game as ${effectiveAltHandle || "…"}`}
            </Button>

            {newGame && (
                <p className="mt-3">
                    New game created:{" "}
                    <Link to={`/handle/${newGame.handle}/game/${newGame.join_code}`}>
                        {newGame.join_code}
                    </Link>
                </p>
            )}
            {player && <pre>{JSON.stringify(player, null, 2)}</pre>}
        </Container>
    );
}
