import express from "express";
import * as NoteController from "../controllers/noteControllers";

const router = express.Router();

router.get("/", NoteController.getNotes);

router.get("/:noteId", NoteController.getOneNote);

router.post("/", NoteController.createNote);

router.patch("/:noteId", NoteController.updateNote); // /:noteId <-- need to be the same as in controller

router.delete("/:noteId", NoteController.deleteNote);

export default router;
