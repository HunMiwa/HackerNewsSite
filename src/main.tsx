import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './quaries/QueryClient'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { CommentsList } from './components/CommentsList/CommentsList'
import { StoryList } from './components/StoryList/StoryList'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <StoryList />,
      },
      {
        path: ':type',
        element: <StoryList />,
      },
      {
        path: 'story/:id/comments',
        element: <CommentsList />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </QueryClientProvider>
  </StrictMode>,
)
