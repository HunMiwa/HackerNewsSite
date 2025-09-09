import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { HackerNewsAPI } from "../../services/hackerNewsApi";

export enum StoryType {
    top = 'top',
    new = 'new',
    ask = 'ask',
    show = 'show',
    jobs = 'jobs',
}

export interface Story {
    id: number;
    title: string;
    url?: string;
    score: number;
    by: string;
    time: number;
    descendants?: number;
    text?: string;
    type: string;
}

export interface StoryState {
    storiesByType: Record<StoryType, Story[]>;
    currentType: StoryType;
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    currentPage: number;
}

export const loadStoriesThunk = createAsyncThunk(
    'story/loadStories',
    async ({ type, page = 0, append = false }: { type: StoryType, page?: number, append?: boolean }) => {
        const result = await HackerNewsAPI.getPaginatedStories(type, page, 30);
        return {
            type,
            stories: result.stories,
            hasMore: result.hasMore,
            page,
            append
        };
    }
);

export const loadMoreStoriesThunk = createAsyncThunk(
    'story/loadMoreStories',
    async (_, { getState }) => {
        const state = getState() as { story: StoryState };
        const { currentType, currentPage } = state.story;
        const result = await HackerNewsAPI.getPaginatedStories(currentType, currentPage + 1, 30);
        return {
            type: currentType,
            stories: result.stories,
            hasMore: result.hasMore,
            page: currentPage + 1,
            append: true
        };
    }
);

export const refreshStoriesThunk = createAsyncThunk(
    'story/refreshStories',
    async (_, { getState }) => {
        const state = getState() as { story: StoryState };
        const { currentType } = state.story;
        const result = await HackerNewsAPI.getPaginatedStories(currentType, 0, 30);
        return {
            type: currentType,
            stories: result.stories,
            hasMore: result.hasMore,
            page: 0,
            append: false
        };
    }
);

const initialState: StoryState = {
    storiesByType: {
        [StoryType.top]: [],
        [StoryType.new]: [],
        [StoryType.ask]: [],
        [StoryType.show]: [],
        [StoryType.jobs]: [],
    },
    currentType: StoryType.top,
    loading: false,
    error: null,
    hasMore: true,
    currentPage: 0,
}

export const storySlice = createSlice({
    name: 'story',
    initialState,
    reducers: {
        setStoriesForType: (state, action: PayloadAction<{type: StoryType, stories: Story[], append: boolean}>) => {
            const { type, stories, append } = action.payload;
            if (append) {
                state.storiesByType[type] = [...state.storiesByType[type], ...stories];
            } else {
                state.storiesByType[type] = stories;
            }
        },
        setStoryType: (state, action: PayloadAction<StoryType>) => {
            state.currentType = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setHasMore: (state, action: PayloadAction<boolean>) => {
            state.hasMore = action.payload;
        },
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
        resetStoriesForType: (state, action: PayloadAction<StoryType>) => {
            const type = action.payload;
            state.storiesByType[type] = [];
            state.currentPage = 0;
            state.hasMore = true;
            state.error = null;
        },
        clearAllStories: (state) => {
            state.storiesByType = {
                [StoryType.top]: [],
                [StoryType.new]: [],
                [StoryType.ask]: [],
                [StoryType.show]: [],
                [StoryType.jobs]: [],
            };
            state.currentPage = 0;
            state.hasMore = true;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadStoriesThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadStoriesThunk.fulfilled, (state, action) => {
                state.loading = false;
                const { type, stories, hasMore, page, append } = action.payload;
                if (append) {
                    state.storiesByType[type] = [...state.storiesByType[type], ...stories];
                } else {
                    state.storiesByType[type] = stories;
                }
                state.hasMore = hasMore;
                state.currentPage = page;
            })
            .addCase(loadStoriesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to load stories';
            })
            // loadMoreStoriesThunk
            .addCase(loadMoreStoriesThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadMoreStoriesThunk.fulfilled, (state, action) => {
                state.loading = false;
                const { type, stories, hasMore, page } = action.payload;
                state.storiesByType[type] = [...state.storiesByType[type], ...stories];
                state.hasMore = hasMore;
                state.currentPage = page;
            })
            .addCase(loadMoreStoriesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to load more stories';
            })
            // refreshStoriesThunk
            .addCase(refreshStoriesThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(refreshStoriesThunk.fulfilled, (state, action) => {
                state.loading = false;
                const { type, stories, hasMore } = action.payload;
                state.storiesByType[type] = stories;
                state.hasMore = hasMore;
                state.currentPage = 0;
            })
            .addCase(refreshStoriesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to refresh stories';
            });
    }
})

export const { 
    setStoriesForType,
    setStoryType,
    setLoading,
    setError,
    setHasMore,
    setCurrentPage,
    resetStoriesForType,
    clearAllStories
} = storySlice.actions;

export default storySlice.reducer