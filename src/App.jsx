// npm modules
import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'

// page components
import Signup from './pages/Signup/Signup'
import Login from './pages/Login/Login'
import Landing from './pages/Landing/Landing'
import Profile from './pages/Profile/Profile'
import ChangePassword from './pages/ChangePassword/ChangePassword'
import EventList from './pages/EventList/EventList'
import NewEvent from './pages/NewEvent/NewEvent'
import EditEvent from './pages/EditEvent/EditEvent'
import JobBoard from './pages/JobBoard/JobBoard'
import AddJob from './pages/AddJob/AddJob'
import JobDetails from './pages/JobDetails/JobDetails'
import EditJob from './pages/EditJob/EditJob'
import ResourceList from './pages/ResourceList/ResourceList'
import AddResource from './pages/AddResource/AddResource'
import ResourceDetails from './pages/ResourceDetails/ResourceDetails'
import EditResource from './pages/EditResource/EditResource'

// components
import NavBar from './components/NavBar/NavBar'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'

// services
import * as authService from './services/authService'
import * as eventService from './services/eventService'
import * as jobService from './services/jobService'
import * as resourceService from './services/resourceService'

// styles
import './App.css'

const App = () => {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [user, setUser] = useState(authService.getUser())
  const [jobs, setJobs] = useState([])
  const [resources, setResources] = useState([])


  const handleLogout = () => {
    authService.logout()
    setUser(null)
    navigate('/')
  }

  const handleSignupOrLogin = () => {
    setUser(authService.getUser())
  }

  const handleAddEvent = async (eventData) => {
    const newEvent = await eventService.create(eventData)
    setEvents([newEvent, ...events])
    navigate('/events')
  }

  useEffect (() => {
    const fetchAllEvents = async () => {
      const eventData = await eventService.index()
      setEvents(eventData)
    }
    if (user) fetchAllEvents()
  }, [user])

  const handleAddJob = async (jobData) => {
    const newJob = await jobService.create(jobData)
    setJobs([newJob, ...jobs])
    navigate('/jobs')
  }

  const handleUpdateJob = async (jobData) => {
    const updatedJob = await jobService.update(jobData)
    setJobs(jobs.map((j) => jobData._id === j._id ? updatedJob : j))
    navigate('/jobs')
  }

  const handleDeleteJob = async (id) => {
    const deletedJob = await jobService.deleteJob(id)
    setJobs(jobs.filter(j => j._id !== deletedJob._id))
    navigate('/jobs')
  }

  useEffect(() => {
    const fetchAllJobs = async () => {
      const jobData = await jobService.index()
      setJobs(jobData)
    }
    if (user) fetchAllJobs()
  }, [user])

  const handleAddResource = async (resourceData) => {
    const newResource = await resourceService.create(resourceData)
    setResources ([newResource, ...resources])
    navigate('/resources')
  }

  const handleUpdateResource = async (resourceData) => {
    const updatedResource = await resourceService.updateResource(resourceData)
    setResources(resources.map((r) => resourceData._id === r._id ? updatedResource : r))
    navigate('/resources')
  }

  const handleDeleteResource = async (id) => {
    const deletedResource = await resourceService.deleteResource(id)
    setResources(resources.filter(r => r._id !== deletedResource._id))
    navigate('/resources')
  }

  useEffect (() => {
    const fetchAllResources = async () => {
      const resourceData = await resourceService.index()
      setResources(resourceData)
    }
    if (user) fetchAllResources()
  }, [user])

  return (
    <>
      <NavBar user={user} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Landing user={user} />} />
        <Route
          path="/signup"
          element={<Signup handleSignupOrLogin={handleSignupOrLogin} />}
        />
        <Route
          path="/login"
          element={<Login handleSignupOrLogin={handleSignupOrLogin} />}
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user}>
              <Profile user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute user={user}>
              <ChangePassword handleSignupOrLogin={handleSignupOrLogin} />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/jobs"
          element={
            <ProtectedRoute user={user}>
              <JobBoard jobs={jobs} />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/addjob"
          element={
            <ProtectedRoute user={user}>
              <AddJob handleAddJob={handleAddJob} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs/:id"
          element={
            <ProtectedRoute user={user}>
              <JobDetails user={user} handleDeleteJob={handleDeleteJob} /> 
            </ProtectedRoute>
          }
        />
        <Route 
          path="/jobs/:id/edit" 
          element={
            <ProtectedRoute user={user}>
              <EditJob handleUpdateJob={handleUpdateJob} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/resources"
          element={
            <ProtectedRoute user={user}>
              <ResourceList resources={resources} />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/addresource"
          element={
            <ProtectedRoute user={user}>
              <AddResource handleAddResource={handleAddResource} />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/resources/:id/edit" 
          element={
            <ProtectedRoute user={user}>
              <EditResource handleUpdateResource={handleUpdateResource} />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/resources/:id"
          element={
            <ProtectedRoute user={user}>
              <ResourceDetails user={user} handleDeleteResource={handleDeleteResource} /> 
            </ProtectedRoute>
          }
        />
        <Route 
          path="/events"
          element={
            <ProtectedRoute user={user}>
              <EventList events={events} user={user} setEvents={setEvents} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/new"
          element={
            <ProtectedRoute user={user}>
              <NewEvent handleAddEvent={handleAddEvent}/>
            </ProtectedRoute>
          }
        />
        <Route
          path="events/:id/edit"
          element={
            <ProtectedRoute user={user}>
              <EditEvent setEvents={setEvents} events={events} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App
