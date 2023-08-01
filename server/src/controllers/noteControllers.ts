import { RequestHandler } from "express";
import NoteModel from "../models/noteModel";
import createHttpError from "http-errors";
import mongoose from "mongoose";

/* GET ALL NOTES */
export const getNotes: RequestHandler = async (req, res, next) => {
    // RequestHandler <-- type that determind req, res, next // import { RequestHandler } from "express";
    try {
        const notes = await NoteModel.find().exec();
        res.status(200).json(notes);
    } catch (error) {
        next(error); // <-- from Error Handler
    }
};

/* GET ONE NOTE */
export const getOneNote: RequestHandler = async (req, res, next) => {
    const noteId = req.params.noteId;
    try {
        // check if note id valid (in case that the format of id is INCORRECT)
        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "Invalid Note Id");
        }
        const note = await NoteModel.findById(noteId).exec();
        // check if note id valid (in case that the format of id is CORRECT)
        if (!note) {
            throw createHttpError(404, "Note not found");
        }
        res.status(200).json(note);
    } catch (error) {
        next(error);
    }
};

/* CREATE NOTE */
interface CreateNoteBody {
    title?: string;
    text?: string;
}
export const createNote: RequestHandler<
    unknown,
    unknown,
    CreateNoteBody,
    unknown
> = async (req, res, next) => {
    const title = req.body.title;
    const text = req.body.text;
    try {
        if (!title) {
            throw createHttpError(400, "Title is needed");
        }
        if (!text) {
            throw createHttpError(400, "text is needed");
        }
        const newNote = await NoteModel.create({
            title: title,
            text: text,
        });
        res.status(201).json(newNote);
    } catch (error) {
        next(error);
    }
};

/* UPDATE NOTE : PATCH (can also use PUT)*/
interface UpdateNoteParams {
    noteId: string; // noteId <-- need to be the same as in route
}
interface UpdateNoteBody {
    title?: string;
    text?: string;
}
export const updateNote: RequestHandler<
    UpdateNoteParams,
    unknown,
    UpdateNoteBody,
    unknown
> = async (req, res, next) => {
    const noteId = req.params.noteId;
    const newTitle = req.body.title;
    const newText = req.body.text;
    try {
        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "Invalid Note Id");
        }
        if (!newTitle) {
            throw createHttpError(400, "Title is required");
        }
        if (!newText) {
            throw createHttpError(400, "text is required");
        }
        const note = await NoteModel.findById(noteId).exec();
        if (!note) {
            throw createHttpError(404, "Note not found");
        }

        note.title = newTitle;
        note.text = newText;

        const updatedNote = await note.save();

        res.status(200).json(updatedNote);
    } catch (error) {
        next(error);
    }
};

/* DELETE NOTE */
export const deleteNote: RequestHandler = async (req, res, next) => {
    const noteId = req.params.noteId;
    try {
        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "Invalid Note Id");
        }
        const note = await NoteModel.findById(noteId).exec();
        if (!note) {
            throw createHttpError(404, "Note not found");
        }
        await note.deleteOne();

        res.sendStatus(204); // Important to use sendStatus() instad of status() due that we don't send any json
    } catch (error) {
        next(error);
    }
};
