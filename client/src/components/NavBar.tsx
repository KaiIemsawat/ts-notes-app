import { Container, Nav, Navbar } from "react-bootstrap";
import { User } from "../models/user";
import NavNarLoggedInView from "./NavNarLoggedInView";
import NavBarLoggedOutView from "./NavBarLoggedOutView";
import { Link } from "react-router-dom";

interface NavBarProps {
    loggedInUser: User | null;
    onSignUpClicked: () => void;
    onLoginClicked: () => void;
    onLogoutSuccessful: () => void;
}

const NavBar = ({
    loggedInUser,
    onSignUpClicked,
    onLoginClicked,
    onLogoutSuccessful,
}: NavBarProps) => {
    return (
        <Navbar bg="primary" variant="dark" expand="sm" sticky="top">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    Notes App
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navbar" />
                <Navbar.Collapse id="main-navbar">
                    <Nav>
                        {/* <Nav.Link as={Link} to="/privacy"> instead of <Link> to add effect*/}
                        <Nav.Link as={Link} to="/privacy">
                            Privacy
                        </Nav.Link>
                    </Nav>
                    <Nav className="ms-auto">
                        {loggedInUser ? (
                            <NavNarLoggedInView
                                user={loggedInUser}
                                onLogoutSuccessful={onLogoutSuccessful}
                            />
                        ) : (
                            <NavBarLoggedOutView
                                onLoginClicked={onLoginClicked}
                                onSignUpClicked={onSignUpClicked}
                            />
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;
