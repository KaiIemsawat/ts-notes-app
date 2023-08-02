import { Button, Form, Modal } from "react-bootstrap";
import { Note } from "../models/note";
import { NoteInput } from "../network/notes_api";
import { useForm } from "react-hook-form";
import * as NotesAPI from "../network/notes_api";

interface AddNoteDialogProps {
    onDismiss: () => void;
    onNoteSaved: (note: Note) => void;
}

const AddNoteDialog = ({ onDismiss, onNoteSaved }: AddNoteDialogProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<NoteInput>();

    async function onSubmit(input: NoteInput) {
        try {
            const noteResponse = await NotesAPI.createNote(input);
            onNoteSaved(noteResponse);
        } catch (error) {
            console.log(error);
            alert(error);
        }
    }

    return (
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>Add Note</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form id="addNoteForm">
                    <Form.Group
                        className="mb-3"
                        onSubmit={handleSubmit(onSubmit)}>
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Title"
                            isInvalid={!!errors.title}
                            {...register("title", {
                                required: "title required",
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.title?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Text</Form.Label>
                        <Form.Control
                            as="textarea"
                            placeholder="Text"
                            isInvalid={!!errors.text}
                            {...register("text", { required: "text required" })}
                            rows={5}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.text?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button type="submit" form="addNoteForm">
                    Save Note
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddNoteDialog;
