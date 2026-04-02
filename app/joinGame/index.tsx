import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router";
import type { FormEvent } from "react";
import { BACKEND_URL, getCsrfToken } from "../lib";

type JoinResult = { join_code: string } | { error: string };

export function JoinGame({ joinCode }: { joinCode: string }) {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [joining, setJoining] = useState(false);

    useEffect(() => {
        fetch(`${BACKEND_URL}/_allauth/browser/v1/auth/session`, {
            credentials: "include",
        })
            .then((res) => (res.ok ? res.json() : null))
            .then((body) => {
                const name = body?.data?.user?.username;
                if (name) setUsername(name);
            })
            .catch(() => {});
    }, []);

    function joinAs(handle: string) {
        setJoining(true);
        setError(null);
        fetch(`${BACKEND_URL}/api/player/${handle}/game/${joinCode}/join`, {
            method: "POST",
            credentials: "include",
            headers: { "X-CSRFToken": getCsrfToken() },
        })
            .then((res) => {
                if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
                return res.json() as Promise<JoinResult>;
            })
            .then((data) => {
                if ("error" in data) throw new Error(data.error);
                navigate(`/handle/${encodeURIComponent(handle)}/game/${joinCode}`);
            })
            .catch((err: unknown) =>
                setError(err instanceof Error ? err.message : String(err))
            )
            .finally(() => setJoining(false));
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
            {error && <p className="text-danger">{error}</p>}
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
