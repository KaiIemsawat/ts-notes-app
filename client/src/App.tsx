import React, { useEffect, useState } from "react";
import logo from "./logo.svg";

import { Button, Col, Container, Row } from "react-bootstrap";
import { Note as NoteModel } from "./models/note";
import Note from "./components/Note";
import styles from "./styles/NotesPage.module.css";

function App() {
    const [notes, setNotes] = useState<NoteModel[]>([]);
    useEffect(() => {
        async function loadNotes() {
            try {
                // async/await can't be directly in useEffect. But we can create empty async function to contain await
                const response = await fetch("/api/notes", {
                    method: "GET",
                });
                const notes = await response.json();
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
            <Row xs={1} md={2} xl={3} className="g-4">
                {notes.map((eachNote) => (
                    <Col key={eachNote._id}>
                        <Note note={eachNote} className={styles.note} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default App;
