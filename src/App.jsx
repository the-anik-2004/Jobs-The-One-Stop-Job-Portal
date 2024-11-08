import './App.css'
import AppLayout from './layout/app-layout'
import {LandingPage,OnBoarding , PostJob,MyJobs,JobPage, JobListing, SavedJobs,NotAuthorizedPage} from './pages'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import { ThemeProvider,ProtectedRoute } from "./components"

const router =createBrowserRouter(
  [
    {
      element:<AppLayout/>,
      children:[
        {
          path:"/",
          element:<LandingPage/>
        },
        {
          path:"/onboarding",
          element:(
            <ProtectedRoute>
              <OnBoarding/>
            </ProtectedRoute>
          )
        },
        {
          path:"/jobs",
          element:(
            <ProtectedRoute>
              <JobListing/>
            </ProtectedRoute>
          )
        },
        {
          path:"/Job/:id",
          element:(
            <ProtectedRoute>
              <JobPage/>
            </ProtectedRoute>
          )
          
        },
        {
          path:"/post-job",
          element:(
            <ProtectedRoute>
              <PostJob/>
            </ProtectedRoute>
          )
          
          
        },
        {
          path:"/saved-jobs",
          element:(
            <ProtectedRoute>
                <SavedJobs/>
            </ProtectedRoute>
          )
          
        
        },
        {
          path:"/my-jobs",
          element:(
            <ProtectedRoute>
              <MyJobs/>
            </ProtectedRoute>
          )
          
          
        },
      ]

    }
  ]
)

function App() {
return (
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
  <RouterProvider router={router}/>
</ThemeProvider>


);
}

export default App
