import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import BSNavbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import { BACKEND_URL, getCsrfToken } from "../lib";

export function NavBar() {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        fetch(`${BACKEND_URL}/_allauth/browser/v1/auth/session`, {
            credentials: "include",
        })
            .then((res) => (res.ok ? res.json() : null))
            .then((body: { data?: { user?: { username?: string } } } | null) => {
                const name = body?.data?.user?.username;
                if (name) setUsername(name);
            })
            .catch(() => {});
    }, []);

    async function handleSignOut() {
        await fetch(`${BACKEND_URL}/_allauth/browser/v1/auth/session`, {
            method: "DELETE",
            credentials: "include",
            headers: { "X-CSRFToken": getCsrfToken() },
        });
        setUsername(null);
        navigate("/");
    }

    return (
        <BSNavbar bg="dark" data-bs-theme="dark" expand="sm">
            <Container>
                <BSNavbar.Brand as={Link} to="/">TicReacToe</BSNavbar.Brand>
                <BSNavbar.Toggle aria-controls="main-nav" />
                <BSNavbar.Collapse id="main-nav">
                    <Nav className="ms-auto">
                        {username ? (
                            <>
                                <BSNavbar.Text className="me-3">
                                    Signed in as <strong>{username}</strong>
                                </BSNavbar.Text>
                                <Nav.Link onClick={handleSignOut}>Sign out</Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Sign in</Nav.Link>
                                <Nav.Link as={Link} to="/account/signup">Sign up</Nav.Link>
                            </>
                        )}
                    </Nav>
                </BSNavbar.Collapse>
            </Container>
        </BSNavbar>
    );
}
