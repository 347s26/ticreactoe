import { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router";
import type { FormEvent } from "react";
import { useAppSelector } from "../hooks";

type Mode = "choose" | "create" | "join";

export function Landing() {
    const navigate = useNavigate();
    const username = useAppSelector((s) => s.auth.username);
    const [mode, setMode] = useState<Mode>("choose");

    function handleCreateSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const handle = new FormData(e.currentTarget).get("handle") as string;
        if (handle.trim()) {
            navigate(`/handle/${encodeURIComponent(handle.trim())}`);
        }
    }

    function handleJoinSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const code = new FormData(e.currentTarget).get("joinCode") as string;
        if (code.trim()) {
            navigate(`/join/${encodeURIComponent(code.trim())}`);
        }
    }

    return (
        <Container>
            <main className="d-flex justify-content-center align-items-center landing">
                <Row className="w-100 justify-content-center">
                    {mode === "choose" && (
                        <Col xs={12} sm={8} md={6} className="d-flex flex-column gap-3">
                            <h1 className="text-center mb-2">TicReacToe</h1>
                            <Button
                                variant="primary"
                                className="fs-3 py-3"
                                onClick={() => setMode("create")}
                            >
                                Create Game
                            </Button>
                            <Button
                                variant="outline-primary"
                                className="fs-3 py-3"
                                onClick={() => setMode("join")}
                            >
                                Join Game
                            </Button>
                        </Col>
                    )}

                    {mode === "create" && (
                        <Col xs={12} sm={8} md={6}>
                            <button
                                className="btn btn-link ps-0 mb-3 text-decoration-none"
                                onClick={() => setMode("choose")}
                            >
                                ← Back
                            </button>
                            <h2 className="mb-4">Create a Game</h2>
                            {username && (
                                <Button
                                    variant="primary"
                                    className="mb-3 fs-4 w-100"
                                    onClick={() =>
                                        navigate(`/handle/${encodeURIComponent(username)}`)
                                    }
                                >
                                    Play as {username}
                                </Button>
                            )}
                            <Form onSubmit={handleCreateSubmit}>
                                <FloatingLabel controlId="handle" label="Choose a handle" className="mb-3">
                                    <Form.Control
                                        type="text"
                                        name="handle"
                                        placeholder="Choose a handle"
                                        autoFocus
                                    />
                                </FloatingLabel>
                                <Button variant="outline-primary" type="submit" className="fs-4 w-100">
                                    Continue
                                </Button>
                            </Form>
                            <div className="text-center mt-3 text-muted">
                                or <a href="/login">sign in</a>
                            </div>
                        </Col>
                    )}

                    {mode === "join" && (
                        <Col xs={12} sm={8} md={6}>
                            <button
                                className="btn btn-link ps-0 mb-3 text-decoration-none"
                                onClick={() => setMode("choose")}
                            >
                                ← Back
                            </button>
                            <h2 className="mb-4">Join a Game</h2>
                            <Form onSubmit={handleJoinSubmit}>
                                <FloatingLabel controlId="joinCode" label="Enter join code" className="mb-3">
                                    <Form.Control
                                        type="text"
                                        name="joinCode"
                                        placeholder="Enter join code"
                                        autoFocus
                                    />
                                </FloatingLabel>
                                <Button variant="outline-primary" type="submit" className="fs-4 w-100">
                                    Continue
                                </Button>
                            </Form>
                        </Col>
                    )}
                </Row>
            </main>
        </Container>
    );
}
