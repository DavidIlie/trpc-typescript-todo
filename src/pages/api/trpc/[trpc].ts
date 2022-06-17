import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";

import prisma from "../../../lib/prisma";

export const appRouter = trpc
   .router()
   .query("todos", {
      async resolve() {
         return { todos: await prisma.todo.findMany() };
      },
   })
   .mutation("create", {
      input: z.object({
         name: z.string(),
      }),
      async resolve({ input }) {
         await prisma.todo.create({ data: { name: input.name } });
         return;
      },
   })
   .mutation("update-state", {
      input: z.object({
         id: z.string().uuid(),
         state: z.boolean(),
      }),
      async resolve({ input }) {
         return await prisma.todo.update({
            where: { id: input.id },
            data: { complete: input.state },
         });
      },
   })
   .mutation("delete", {
      input: z.object({
         id: z.string().uuid(),
      }),
      async resolve({ input }) {
         await prisma.todo.delete({ where: { id: input.id } });
         return;
      },
   });

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
   router: appRouter,
   createContext: () => null,
});
