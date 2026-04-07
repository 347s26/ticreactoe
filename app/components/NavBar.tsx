import { Link, useNavigate } from "react-router";
import BSNavbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import { useAppDispatch, useAppSelector } from "../hooks";
import { signOut } from "../features/auth/authSlice";

export function NavBar() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const username = useAppSelector((s) => s.auth.username);

    async function handleSignOut() {
        await dispatch(signOut());
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
