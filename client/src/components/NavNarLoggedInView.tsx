import { Button, Navbar } from "react-bootstrap";
import { User } from "../models/user";
import * as NotesAPI from "../network/notes_api";

interface NavNarLoggedInViewProps {
    user: User;
    onLogoutSuccessful: () => void;
}

const NavNarLoggedInView = ({
    user,
    onLogoutSuccessful,
}: NavNarLoggedInViewProps) => {
    async function logout() {
        try {
            await NotesAPI.logout();
            onLogoutSuccessful();
        } catch (error) {
            alert(error);
            console.error(error);
        }
    }
    return (
        <>
            <Navbar.Text className="me-2">
                Signed in as : {user.username}
            </Navbar.Text>
            <Button onClick={logout}>Logout</Button>
        </>
    );
};

export default NavNarLoggedInView;
