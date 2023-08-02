import React, { useEffect, useState } from "react";
import * as NotesAPI from "./network/notes_api"; // <-- custom function to handle error
import { Button, Col, Container, Row } from "react-bootstrap";
import { Note as NoteModel } from "./models/note";
import Note from "./components/Note";
import styles from "./styles/NotesPage.module.css";
import styleUtils from "./styles/Utils.module.css";
import AddEditNoteDialog from "./components/AddEditNoteDialog";
import IconFilePlus from "./icons/IconFilePlus";

function App() {
    const [notes, setNotes] = useState<NoteModel[]>([]);

    const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
    const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null); // useState<NoteModel|null> <-- type could be either NoteModel or null

    useEffect(() => {
        async function loadNotes() {
            try {
                // async/await can't be directly in useEffect. But we can create empty async function to contain await
                const notes = await NotesAPI.fetchNotes();
                setNotes(notes);
            } catch (error) {
                console.log(error);
                alert(error);
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

    return (
        <Container>
            <Button
                className={`my-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
                onClick={() => setShowAddNoteDialog(true)}>
                <IconFilePlus />
                Add new note
            </Button>
            <Row xs={1} md={2} xl={3} className="g-4">
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
        </Container>
    );
}

export default App;
