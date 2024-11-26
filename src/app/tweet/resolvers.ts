import { Tweet } from "@prisma/client";
import { prismaClient } from "../../clients/db";
import { GraphqlContext } from "../../interfaces";

interface CreateTweetPayload {
  content: string;
  imageURL?: string;
}

const mutations = {
  createTweet: async (
    parent: any,
    { payload }: { payload: CreateTweetPayload },
    ctx: GraphqlContext
  ) => {
    if (!ctx?.user?.id) throw new Error("Not Logged in");
    console.log(payload, "payload");
    console.log(ctx, "ctx");

    const tweet = await prismaClient.tweet
      .create({
        data: {
          content: payload.content,
          imageURL: payload.imageURL,
          author: { connect: { id: ctx.user.id } },
        },
      })
      .catch((err) => {
        console.error("Database Error:", err);
        throw new Error("Failed to create tweet");
      });

    return tweet;
  },
};

const extraResolver = {
  Tweet: {
    author: async (parent: Tweet) => {
      const user = await prismaClient.user.findUnique({
        where: { id: parent.authorId },
      });
      return user;
    },
  },
};

const queries = {
  getAllTweets: async (parent: any, args: any, ctx: GraphqlContext) => {
    const tweets = await prismaClient.tweet.findMany({
      orderBy: { createdAt: "desc" },
    });

    return tweets;
  },
};

export const resolvers = { mutations, extraResolver, queries };
