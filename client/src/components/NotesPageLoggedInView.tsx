import { useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import IconFilePlus from "../icons/IconFilePlus";
import { Note as NoteModel } from "../models/note";
import styles from "../styles/NotesPage.module.css";
import styleUtils from "../styles/Utils.module.css";
import AddEditNoteDialog from "./AddEditNoteDialog";

import * as NotesAPI from "../network/notes_api"; // <-- custom function to handle error
import Note from "./Note";

const NotesPageLoggedInView = () => {
    const [notes, setNotes] = useState<NoteModel[]>([]);
    const [notesLoading, setNotesLoading] = useState(true);
    const [showNotesLoadingError, setShowNotesLoadingError] = useState(false);

    const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
    const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null); // useState<NoteModel|null> <-- type could be either NoteModel or null

    useEffect(() => {
        async function loadNotes() {
            try {
                setShowNotesLoadingError(false);
                setNotesLoading(true);
                // async/await can't be directly in useEffect. But we can create empty async function to contain await
                const notes = await NotesAPI.fetchNotes();
                setNotes(notes);
            } catch (error) {
                console.log(error);
                setShowNotesLoadingError(true);
            } finally {
                setNotesLoading(false);
            }
        }
        loadNotes();
    }, []);

    async function deleteNote(note: NoteModel) {
        try {
            await NotesAPI.deleteNote(note._id);
            setNotes(
                notes.filter((existingNote) => existingNote._id !== note._id)
            );
        } catch (error) {
            console.log(error);
            alert(error);
        }
    }

    const notesGrid = (
        <Row xs={1} md={2} xl={3} className={`g-4 ${styles.notesGrid}`}>
            {notes.map((eachNote) => (
                <Col key={eachNote._id}>
                    <Note
                        note={eachNote}
                        className={styles.note}
                        onNoteClicked={setNoteToEdit}
                        onDeleteNoteClick={deleteNote}
                    />
                </Col>
            ))}
        </Row>
    );

    return (
        <>
            <Button
                className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
                onClick={() => setShowAddNoteDialog(true)}>
                <IconFilePlus />
                Add new note
            </Button>
            {notesLoading && <Spinner animation="border" variant="primary" />}
            {showNotesLoadingError && (
                <p>Something went wrong. Try refreshing the page</p>
            )}
            {!notesLoading && !showNotesLoadingError && (
                // Trick !! we can make use of <></> to be able to use another pair of {} inside {}
                <>
                    {notes.length > 0 ? (
                        notesGrid
                    ) : (
                        <p>The note list is empty</p>
                    )}
                </>
            )}
            {showAddNoteDialog && (
                <AddEditNoteDialog
                    onDismiss={() => setShowAddNoteDialog(false)}
                    onNoteSaved={(newNote) => {
                        setNotes([...notes, newNote]);
                        setShowAddNoteDialog(false);
                    }}
                />
            )}
            {noteToEdit && (
                <AddEditNoteDialog
                    noteToEdit={noteToEdit}
                    onDismiss={() => setNoteToEdit(null)}
                    onNoteSaved={(updateNote) => {
                        setNotes(
                            notes.map((existingNotes) =>
                                existingNotes._id === updateNote._id
                                    ? updateNote
                                    : existingNotes
                            )
                        );
                        setNoteToEdit(null);
                    }}
                />
            )}
        </>
    );
};

export default NotesPageLoggedInView;
