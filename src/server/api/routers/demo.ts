import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const demoRouter = createTRPCRouter({
  // SAVE: Create a new message in the database
  saveMessage: publicProcedure
    .input(z.object({ author: z.string().min(1), message: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.demoMessage.create({
        data: {
          author: input.author,
          message: input.message,
        },
      });
    }),

  // RETRIEVE: Get all messages from the database
  getMessages: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.demoMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 20, // Limit to last 20 messages
    });
  }),

  // DELETE: Clear all messages (for resetting demo)
  clearAll: publicProcedure.mutation(async ({ ctx }) => {
    return ctx.db.demoMessage.deleteMany();
  }),
});
