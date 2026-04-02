import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { FormEvent } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Button, FloatingLabel } from "react-bootstrap";

import { BACKEND_URL, getCsrfToken } from "../lib";

export function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch(`${BACKEND_URL}/_allauth/browser/v1/auth/session`, {
            credentials: "include",
        }).catch(() => {});
    }, []);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const username = data.get("username") as string;
        const password = data.get("password") as string;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${BACKEND_URL}/_allauth/browser/v1/auth/login`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCsrfToken(),
                },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error((body as { detail?: string }).detail ?? `${res.status} ${res.statusText}`);
            }

            navigate(`/handle/${encodeURIComponent(username)}`);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container>
            <main className="d-flex justify-content-center align-items-center landing">
                <Form className="w-100" onSubmit={handleSubmit}>
                    <FloatingLabel controlId="username" label="Username" className="mb-3">
                        <Form.Control type="text" name="username" placeholder="Username" required />
                    </FloatingLabel>
                    <FloatingLabel controlId="password" label="Password">
                        <Form.Control type="password" name="password" placeholder="Password" required />
                    </FloatingLabel>
                    {error && <p className="text-danger mt-2">{error}</p>}
                    <Button
                        variant="outline-primary"
                        type="submit"
                        className="mt-3 fs-1 w-100"
                        disabled={loading}
                    >
                        {loading ? "Logging in…" : "Log in"}
                    </Button>
                </Form>
            </main>
        </Container>
    );
}
