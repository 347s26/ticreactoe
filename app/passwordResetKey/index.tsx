import { useState } from "react";
import { useNavigate } from "react-router";
import type { FormEvent } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Button, FloatingLabel } from "react-bootstrap";
import { BACKEND_URL, getCsrfToken } from "../lib";

export function PasswordResetKey({ emailKey }: { emailKey: string }) {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const password = data.get("password") as string;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${BACKEND_URL}/_allauth/browser/v1/auth/password/reset`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCsrfToken(),
                },
                body: JSON.stringify({ key: emailKey, password }),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error((body as { detail?: string }).detail ?? `${res.status} ${res.statusText}`);
            }

            navigate("/login");
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
                    <FloatingLabel controlId="password" label="New password">
                        <Form.Control type="password" name="password" placeholder="New password" required />
                    </FloatingLabel>
                    {error && <p className="text-danger mt-2">{error}</p>}
                    <Button
                        variant="outline-primary"
                        type="submit"
                        className="mt-3 fs-1 w-100"
                        disabled={loading}
                    >
                        {loading ? "Resetting…" : "Reset password"}
                    </Button>
                </Form>
            </main>
        </Container>
    );
}
