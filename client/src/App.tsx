import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button } from "react-bootstrap";
import { Note } from "./models/note";

function App() {
    const [notes, setNotes] = useState<Note[]>([]);
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

    return <div className="App">{JSON.stringify(notes)}</div>;
}

export default App;
