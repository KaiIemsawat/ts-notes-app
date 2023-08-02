import React, { useEffect, useState } from "react";
import * as NotesAPI from "./network/notes_api"; // <-- custom function to handle error
import { Button, Col, Container, Row } from "react-bootstrap";
import { Note as NoteModel } from "./models/note";
import Note from "./components/Note";
import styles from "./styles/NotesPage.module.css";
import AddNoteDialog from "./components/AddNoteDialog";

function App() {
    const [notes, setNotes] = useState<NoteModel[]>([]);

    const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
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

    return (
        <Container>
            <Button onClick={() => setShowAddNoteDialog(true)}>
                Add new note
            </Button>
            <Row xs={1} md={2} xl={3} className="g-4">
                {notes.map((eachNote) => (
                    <Col key={eachNote._id}>
                        <Note note={eachNote} className={styles.note} />
                    </Col>
                ))}
            </Row>
            {showAddNoteDialog && (
                <AddNoteDialog onDismiss={() => setShowAddNoteDialog(false)} />
            )}
        </Container>
    );
}

export default App;
