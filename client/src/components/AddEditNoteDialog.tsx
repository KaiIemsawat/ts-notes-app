import { Button, Form, Modal } from "react-bootstrap";
import { Note } from "../models/note";
import { NoteInput } from "../network/notes_api";
import { useForm } from "react-hook-form";
import * as NotesAPI from "../network/notes_api";
import TextInputField from "./form/TextInputField";

interface AddEditNoteDialogProps {
    noteToEdit?: Note;
    onDismiss: () => void;
    onNoteSaved: (note: Note) => void;
}

const AddEditNoteDialog = ({
    noteToEdit,
    onDismiss,
    onNoteSaved,
}: AddEditNoteDialogProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<NoteInput>({
        defaultValues: {
            title: noteToEdit?.title || "",
            text: noteToEdit?.text || "",
        },
    });

    async function onSubmit(input: NoteInput) {
        try {
            let noteResponse: Note;
            if (noteToEdit) {
                noteResponse = await NotesAPI.updateNote(noteToEdit._id, input);
            } else {
                noteResponse = await NotesAPI.createNote(input);
            }
            onNoteSaved(noteResponse);
        } catch (error) {
            console.log(error);
            alert(error);
        }
    }

    return (
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {noteToEdit ? "Edit note" : "Add note"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form
                    // id is required since the submit button is outside of <form></form>
                    id="addEditNoteForm"
                    onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField
                        name="title"
                        label="Title"
                        type="text"
                        placeholder="please input title here"
                        register={register}
                        registerOption={{ required: "Required" }}
                        error={errors.title}
                    />
                    <TextInputField
                        name="text"
                        label="Text"
                        as="textarea"
                        rows="5"
                        placeholder="please input text here"
                        register={register}
                        registerOption={{ required: "Required" }}
                        error={errors.text}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    // type="submit" is required since the button is not in <form></form>
                    type="submit"
                    // need to specific form="form_id"
                    form="addEditNoteForm"
                    disabled={isSubmitting}>
                    Save Note
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddEditNoteDialog;
