import { configureStore } from '@reduxjs/toolkit'
import storyReducer from './slices/StorySlice'
import loginReducer from './slices/LoginSlice'

export const store = configureStore({
  reducer: {
    story: storyReducer,
    login: loginReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch