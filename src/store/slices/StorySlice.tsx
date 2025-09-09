import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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