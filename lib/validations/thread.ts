import * as z from "zod";

// Validation du fil de discussion
export const ThreadValidation = z.object({
  thread: z.string().nonempty().min(3, { 
    message: "Minimum 3 caractères." }),
  image_thread: z.string().url().optional(),
  accountId: z.string(),
  threadType: z.enum(['exercise', 'course_note', 'evaluation']), // Ajoutez cette ligne
});

// Validation du commentaire
export const CommentValidation = z.object({
  thread: z.string().nonempty().min(3, { 
    message: "Minimum 3 caractères." }),
});
