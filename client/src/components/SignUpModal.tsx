import { useForm } from "react-hook-form";
import { User } from "../models/user";
import { SignUpCredentials } from "../network/notes_api";
import * as NotesAPI from "../network/notes_api";
import { Button, Form, Modal } from "react-bootstrap";
import TextInputField from "./form/TextInputField";
import styleUtils from "../styles/Utils.module.css";

interface SignUpModalProps {
    onDismiss: () => void;
    onSignUpSuccessful: (user: User) => void;
}

const SignUpModal = ({ onDismiss, onSignUpSuccessful }: SignUpModalProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignUpCredentials>();

    async function onsubmit(credentials: SignUpCredentials) {
        try {
            const newUser = await NotesAPI.signUp(credentials);
            onSignUpSuccessful(newUser);
        } catch (error) {
            alert(error);
            console.error(error);
        }
    }

    return (
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>Sign Up</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(onsubmit)}>
                    <TextInputField
                        name="username"
                        label="Username"
                        type="text"
                        placeholder="Username"
                        register={register}
                        registerOption={{ required: "Required" }}
                        error={errors.username}
                    />
                    <TextInputField
                        name="email"
                        label="Email"
                        type="email"
                        placeholder="Email"
                        register={register}
                        registerOption={{ required: "Required" }}
                        error={errors.email}
                    />
                    <TextInputField
                        name="password"
                        label="Password"
                        type="password"
                        placeholder="Password"
                        register={register}
                        registerOption={{ required: "Required" }}
                        error={errors.password}
                    />
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className={styleUtils.width100}>
                        Sign Up
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default SignUpModal;
