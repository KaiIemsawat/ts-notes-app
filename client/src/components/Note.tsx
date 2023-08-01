import { Note as NoteModel } from "../models/note";

interface NoteProps {
    note: NoteModel;
}

const Note = ({ note }: NoteProps) => {
    return <div>Note</div>;
};

export default Note;
