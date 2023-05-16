import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const postsRouter = createTRPCRouter({

  getAll: publicProcedure.query(({ ctx }) => {
    const res = ctx.prisma.post.findMany();
    console.log(res,"res")
    return res;
  }),
});
