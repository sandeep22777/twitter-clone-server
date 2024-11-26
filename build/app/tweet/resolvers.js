"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const db_1 = require("../../clients/db");
const mutations = {
    createTweet: (parent_1, _a, ctx_1) => __awaiter(void 0, [parent_1, _a, ctx_1], void 0, function* (parent, { payload }, ctx) {
        var _b;
        if (!((_b = ctx === null || ctx === void 0 ? void 0 : ctx.user) === null || _b === void 0 ? void 0 : _b.id))
            throw new Error("Not Logged in");
        console.log(payload, "payload");
        console.log(ctx, "ctx");
        const tweet = yield db_1.prismaClient.tweet
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
    }),
};
const extraResolver = {
    Tweet: {
        author: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield db_1.prismaClient.user.findUnique({
                where: { id: parent.authorId },
            });
            return user;
        }),
    },
};
const queries = {
    getAllTweets: (parent, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const tweets = yield db_1.prismaClient.tweet.findMany({
            orderBy: { createdAt: "desc" },
        });
        return tweets;
    }),
};
exports.resolvers = { mutations, extraResolver, queries };
