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
         return await prisma.todo.create({ data: { name: input.name } });
      },
   })
   .mutation("delete", {
      input: z.object({
         id: z.string().uuid(),
      }),
      async resolve({ input }) {
         return await prisma.todo.delete({ where: { id: input.id } });
      },
   });

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
   router: appRouter,
   createContext: () => null,
});
