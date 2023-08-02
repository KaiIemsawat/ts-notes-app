import styles from "../styles/Note.module.css";
import { Card } from "react-bootstrap";
import { Note as NoteModel } from "../models/note";
import { formatDate } from "../utils/formatDate";
import styleUtils from "../styles/Utils.module.css";
import IconDeleteBack2Line from "../icons/IconDelete";

interface NoteProps {
    note: NoteModel;
    onNoteClicked: (note: NoteModel) => void;
    onDeleteNoteClick: (note: NoteModel) => void;
    className?: string;
}

const Note = ({
    note,
    onNoteClicked,
    onDeleteNoteClick,
    className,
}: NoteProps) => {
    const { title, text, createdAt, updatedAt } = note;

    let createdUpdatedText: string;
    if (updatedAt > createdAt) {
        createdUpdatedText = `Updated at: ${formatDate(updatedAt)}`; // formatDate() is imported from another file
    } else {
        createdUpdatedText = `Created at: ${formatDate(createdAt)}`;
    }

    return (
        <Card
            className={`${styles.noteCard} ${className}`}
            onClick={() => onNoteClicked(note)}>
            <Card.Body className={styles.cardBody}>
                <Card.Title className={styleUtils.flexCenter}>
                    {title}
                    <IconDeleteBack2Line
                        className="text-muted ms-auto"
                        onClick={(e) => {
                            onDeleteNoteClick(note);
                            e.stopPropagation();
                        }}
                    />
                </Card.Title>
                <Card.Text className={styles.cardText}>{text}</Card.Text>
            </Card.Body>
            <Card.Footer className="text-muted">
                {createdUpdatedText}
            </Card.Footer>
        </Card>
    );
};

export default Note;
