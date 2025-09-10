import { HackerNewsAPI } from "../services/hackerNewsApi";
import { useQuery } from "@tanstack/react-query";

export const GetComments = (storyId: number) => {
    return useQuery({
        queryKey: ['comments', storyId],
        queryFn: () => HackerNewsAPI.getAllComments(storyId),
        enabled: !!storyId,
    });
};

export const GetReplies = (commentId: number) => {
    return useQuery({
        queryKey: ['replies', commentId],
        queryFn: async () => {
            const comment = await HackerNewsAPI.getStory(commentId);
            if (!comment.kids || comment.kids.length === 0) {
                return [];
            }
            
            const repliesData = await Promise.all(
                comment.kids.map(kid => HackerNewsAPI.getStory(kid))
            );
            return repliesData.filter(reply => reply && reply.text);
        },
        enabled: !!commentId,
        staleTime: 10 * 60 * 1000,
    });
};