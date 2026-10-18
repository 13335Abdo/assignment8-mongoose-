import { Router } from "express";
import { aggregateNotes, createNote, deleteAllNotes, deleteNote, getNoteByContent, getNoteById, getNotesWithUser, paginateSortNotes, replaceNote, updateAllNotesTitle, updateNote } from "./notes.service.js";


const router = Router();

router.post("/notes", createNote);
router.patch("/notes/:noteId", updateNote);
router.patch("/notess/all/title", updateAllNotesTitle);          // ← قبل /:noteId
router.put("/notes/replace/:noteId", replaceNote);
router.get("/notes/paginate-sort", paginateSortNotes);    // ← قبل /:id
router.get("/notes/note-by-content", getNoteByContent);   // ← قبل /:id
router.get("/notes/note-with-user/:userId", getNotesWithUser);    // ← قبل /:id
router.get("/notes/aggregate", aggregateNotes);           // ← قبل /:id
router.get("/notes/:userId", getNoteById);
router.delete("/notes/:noteId", deleteNote);
router.delete("/deletenotes/:userId", deleteAllNotes);

export default router;


