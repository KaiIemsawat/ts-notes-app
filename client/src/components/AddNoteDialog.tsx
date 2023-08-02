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
                <Form
                    // id is required since the submit button is outside of <form></form>
                    id="addNoteForm"
                    onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Title"
                            // validation
                            isInvalid={!!errors.title}
                            {...register("title", {
                                required: "title required",
                            })}
                        />
                        {/* warning message if error occrrued */}
                        <Form.Control.Feedback type="invalid">
                            {errors.title?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Text</Form.Label>
                        <Form.Control
                            as="textarea"
                            placeholder="Text"
                            rows={5}
                            // validation
                            isInvalid={!!errors.text}
                            {...register("text", { required: "text required" })}
                        />
                        {/* warning message if error occrrued */}
                        <Form.Control.Feedback type="invalid">
                            {errors.text?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    // type="submit" is required since the button is not in <form></form>
                    type="submit"
                    // need to specific form="form_id"
                    form="addNoteForm"
                    disabled={isSubmitting}>
                    Save Note
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddNoteDialog;
