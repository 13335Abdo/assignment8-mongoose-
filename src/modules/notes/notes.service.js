import notesModel from "../../DB/models/notes.model.js";

// ==================== 1. Create a Single Note ====================
export const createNote = async (req, res) => {
    try {
        const { title, content, userId } = req.body;

        if (!title || !content || !userId) {
            return res.status(400).json({ message: "Please provide title, content, and userId" });
        }

        const newNote = await notesModel.create({ title, content, userId });


        return res.status(200).json({ message: "Note created successfully", newNote });


    } catch (error) {
        return res.status(500).json({ message: "error in api", error })
    }
}

// ==================== 2. Update a single Note by its id ====================
export const updateNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        const { title, content, userId } = req.body;

        const updatedNote = await notesModel.findByIdAndUpdate(
            { _id: noteId, owner: userId },
            { $set: { title, content } },
            { new: true }
        );
        if (updatedNote.userId.toString() !== userId) {
            return res.status(403).json({ message: "You are not authorized to update this note" });
        }
        if (!updatedNote) {
            return res.status(404).json({ message: "Note not found" });
        }

        return res.status(200).json({ message: "Note updated successfully", updatedNote });

    } catch (error) {
        return res.status(500).json({ message: "error in api", error })
    }
}

// ==================== 3. Replace the entire note document ====================
export const replaceNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        const { title, content, userId } = req.body;

        const updatedNote = await notesModel.findByIdAndUpdate(
            { _id: noteId },
            { title, content },
            { new: true }
        );
        if (updatedNote.userId.toString() !== userId) {
            return res.status(403).json({ message: "You are not authorized to update this note" });
        }
        if (!updatedNote) {
            return res.status(404).json({ message: "Note not found" });
        }

        return res.status(200).json({ message: "Note updated successfully", updatedNote });

    } catch (error) {
        return res.status(500).json({ message: "error in api", error })
    }
}

// ==================== 4. Update the title of all notes for logged-in user ====================
export const updateAllNotesTitle = async (req, res) => {
    try {
        const { userId, newTitle } = req.body;

        const updatedNotes = await notesModel.updateMany(
            { owner: userId },
            { $set: { title: newTitle } }
        );


        return res.status(200).json({ message: "All notes updated successfully", updatedNotes });

    } catch (error) {
        return res.status(500).json({ message: "error in api", error })
    }
}

// ==================== 5. Delete a single Note by its id ====================
export const deleteNote = async (req, res) => {
    try {
        const { noteId } = req.params;

        const deletedNote = await notesModel.findByIdAndDelete(noteId);

        if (!deletedNote) {
            return res.status(404).json({ message: "Note not found" });
        }

        return res.status(200).json({ message: "Note deleted successfully", deletedNote });

    } catch (error) {
        return res.status(500).json({ message: "error in api", error })
    }
}

// ==================== 6. Paginated list of notes (sorted by createdAt desc) ====================
export const paginateSortNotes = async (req, res) => {
    try {
        const { userId } = req.query;

        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.max(parseInt(req.query.limit) || 10, 1);

        const skip = (page - 1) * limit;

        if (!userId) {
            return res.status(400).json({ message: "Please provide userId" });
        }
        const notes = await notesModel
            .find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return res.status(200).json({ message: "Notes retrieved successfully", notes });
    } catch (error) {
        return res.status(500).json({ message: "error in api", error })
    }
}

// ==================== 7. Get a note by its id ====================
export const getNoteById = async (req, res) => {
    try {

        const { userId } = req.params;

        const { id } = req.body;

        const note = await notesModel.findById(id);

        console.log(note.userId.toString(), userId);


        if (note.userId.toString() != userId) {
            return res.status(403).json({ message: "You are not authorized to view this note" });
        }

        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        return res.status(200).json({ message: "Note retrieved successfully", note });

    } catch (error) {
        return res.status(500).json({ message: "error in api", error })
    }
}

// ==================== 8. Get a note by its content ====================
export const getNoteByContent = async (req, res) => {
    try {
        const { content } = req.query;

        const note = await notesModel.findOne({ content });

        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        return res.status(200).json({ message: "Note retrieved successfully", note });

    } catch (error) {
        return res.status(500).json({ message: "error in api", error })
    }
}

// ==================== 9. Get all notes with user info (title, userId, createdAt + email) ====================
export const getNotesWithUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const notes = await notesModel
            .find({ userId })
            .select("title userId createdAt")
            .populate({ path: "userId", select: "email -_id" });

        return res.status(200).json({ message: "Notes retrieved successfully", notes });

    } catch (error) {
        return res.status(500).json({ message: "error in api", error })
    }
}

// ==================== 10. Aggregation: notes with user info + search by title ====================
export const aggregateNotes = async (req, res) => {
    try {
        const { title } = req.query;
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: "Please provide a valid userId" });
        }

        // الفلتر الأساسي: نوتس اليوزر ده
        const match = { userId };

        // لو بعت title في الـ query يضاف شرط البحث
        if (title) {
            const safeTitle = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            match.title = { $regex: safeTitle, $options: "i" };
        }

        const notes = await notesModel.aggregate([
            { $match: match },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $project: {
                    title: 1,
                    content: 1,
                    createdAt: 1,
                    "user.name": 1,
                    "user.email": 1
                }
            }
        ]);

        return res.status(200).json({ message: "Notes retrieved successfully", notes });

    } catch (error) {
        return res.status(500).json({ message: "error in api", error })
    }
}

// ==================== 11. Delete all notes for logged-in user ====================
export const deleteAllNotes = async (req, res) => {
    try {
        const {userId} = req.params

        const deletedNotes = await notesModel.deleteMany({userId})

        return res.status(200).json({ message: "notes was deleted successfully", deletedNotes })

    } catch (error) {
        return res.status(500).json({ message: "error in api", error })
    }
}