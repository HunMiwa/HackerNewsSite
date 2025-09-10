import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { HackerNewsAPI } from "../services/hackerNewsApi";

export const GetInfiniteStories = (type: string, limit: number = 30) => {
    return useInfiniteQuery({
        queryKey: ['stories-infinite', type],
        queryFn: ({ pageParam = 0 }) => 
            HackerNewsAPI.getPaginatedStories(type as any, pageParam, limit),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.hasMore ? allPages.length : undefined;
        },
        initialPageParam: 0,
        staleTime: 5 * 60 * 1000,
        enabled: !!type,
    });
};

export const GetStory = (storyId: number) => {
    return useQuery({
        queryKey: ['story', storyId],
        queryFn: () => HackerNewsAPI.getStory(storyId),
        enabled: !!storyId,
        staleTime: 10 * 60 * 1000,
    });
};