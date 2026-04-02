import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { FormEvent } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Button, FloatingLabel } from "react-bootstrap";
import { BACKEND_URL, getCsrfToken } from "../lib";

export function Signup() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch(`${BACKEND_URL}/_allauth/browser/v1/auth/session`, {
            credentials: "include",
        }).then((res) => {
            if (res.ok) {
                // Already authenticated — send them home
                navigate("/");
            }
        }).catch(() => {});
    }, [navigate]);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const username = data.get("username") as string;
        const email = data.get("email") as string;
        const password = data.get("password") as string;

        setLoading(true);
        setErrors([]);

        try {
            const res = await fetch(`${BACKEND_URL}/_allauth/browser/v1/auth/signup`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCsrfToken(),
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => ({})) as { detail?: string; errors?: { message: string }[] };
                const msgs = body.errors?.map((e) => e.message) ?? (body.detail ? [body.detail] : [`${res.status} ${res.statusText}`]);
                setErrors(msgs);
                return;
            }

            navigate(`/handle/${encodeURIComponent(username)}`);
        } catch (err: unknown) {
            setErrors([err instanceof Error ? err.message : String(err)]);
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
                    <FloatingLabel controlId="email" label="Email" className="mb-3">
                        <Form.Control type="email" name="email" placeholder="Email" required />
                    </FloatingLabel>
                    <FloatingLabel controlId="password" label="Password">
                        <Form.Control type="password" name="password" placeholder="Password" required />
                    </FloatingLabel>
                    {errors.length > 0 && (
                        <ul className="text-danger mt-2 ps-3">
                            {errors.map((msg, i) => <li key={i}>{msg}</li>)}
                        </ul>
                    )}
                    <Button
                        variant="outline-primary"
                        type="submit"
                        className="mt-3 fs-1 w-100"
                        disabled={loading}
                    >
                        {loading ? "Signing up…" : "Sign up"}
                    </Button>
                </Form>
            </main>
        </Container>
    );
}
