import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Container from "react-bootstrap/Container";
import { BACKEND_URL, getCsrfToken } from "../lib";

export function VerifyEmail({ emailKey }: { emailKey: string }) {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`${BACKEND_URL}/_allauth/browser/v1/auth/email/verify`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCsrfToken(),
            },
            body: JSON.stringify({ key: emailKey }),
        })
            .then((res) => {
                if (!res.ok) return res.json().then((body: { detail?: string }) => {
                    throw new Error(body.detail ?? `${res.status} ${res.statusText}`);
                });
                navigate("/login");
            })
            .catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)));
    }, [emailKey, navigate]);

    return (
        <Container className="mt-5 text-center">
            {error ? (
                <p className="text-danger">{error}</p>
            ) : (
                <p>Verifying your email…</p>
            )}
        </Container>
    );
}
