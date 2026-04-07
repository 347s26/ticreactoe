import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router";
import type { FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { joinGame } from "../features/game/gameSlice";

export function JoinGame({ joinCode }: { joinCode: string }) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const username = useAppSelector((s) => s.auth.username);
    const { joining, joinError } = useAppSelector((s) => s.game);

    async function joinAs(handle: string) {
        const result = await dispatch(joinGame({ handle, joinCode }));
        if (joinGame.fulfilled.match(result)) {
            navigate(`/handle/${encodeURIComponent(handle)}/game/${joinCode}`);
        }
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const handle = new FormData(e.currentTarget).get("handle") as string;
        if (handle.trim()) joinAs(handle.trim());
    }

    return (
        <Container className="py-5" style={{ maxWidth: 480 }}>
            <h1 className="mb-1">Join Game</h1>
            <p className="text-muted mb-4">
                Join code: <strong>{joinCode}</strong>
            </p>
            {joinError && <p className="text-danger">{joinError}</p>}
            {username && (
                <>
                    <Button
                        variant="primary"
                        className="fs-4 w-100 mb-3"
                        disabled={joining}
                        onClick={() => joinAs(username)}
                    >
                        {joining ? "Joining…" : `Join as ${username}`}
                    </Button>
                    <div className="text-center text-muted mb-4">or join with a different handle</div>
                </>
            )}
            <Form onSubmit={handleSubmit}>
                <FloatingLabel controlId="handle" label="Choose a handle" className="mb-3">
                    <Form.Control
                        type="text"
                        name="handle"
                        placeholder="Choose a handle"
                        autoFocus={!username}
                    />
                </FloatingLabel>
                <Button
                    variant="outline-primary"
                    type="submit"
                    className="fs-4 w-100"
                    disabled={joining}
                >
                    {joining ? "Joining…" : "Join Game"}
                </Button>
            </Form>
            {!username && (
                <div className="text-center mt-3 text-muted">
                    or <a href="/login">sign in</a>
                </div>
            )}
        </Container>
    );
}
