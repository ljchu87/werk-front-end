import { useState, useEffect } from 'react'
import styles from './Profile.module.css'
import MyLogs from '../../components/MyLogs/MyLogs'
import * as profileService from '../../services/profileService'

const Profile = ({user}) => {
  const [profile, setProfile] = useState({})

  const [form, setForm] = useState({ 
    date: '',
    logEntry: '',
    skills: '',
  })

  useEffect(() => {
    const fetchProfile = async () => {
      const profileData = await profileService.getProfile()
      setProfile(profileData)
    }
    fetchProfile()
  }, [])

  const handleChange = ({ target }) => {
    setForm({ ...form, [target.name]: target.value })
  }
  
  const handleAddLog = async (logData) => {
    const updatedProfile = await profileService.createLog(user.profile, logData)
    setProfile(updatedProfile)
  }

  const handleDeleteLog = async (id) => {
    const updatedProfile = await profileService.deleteLog(user.profile, id)
    setProfile(updatedProfile)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleAddLog(form)
    setForm({    
      date: '',
      logEntry: '',
      skills: '',
    })
  }

  return (
    <main className={styles.container}>
      <header>
        <h1>Welcome, {user.name}</h1>
        <img src={profile.photo} alt="" />
      </header>
      <p>This is your profile page to log your progress. Here you can keep track of anything you'd like in your job search journey. Maybe you applied to a few jobs, or learend a new skill. Now thats making progress!</p>
      <h3>Add A New Log</h3>
      <form onSubmit={handleSubmit}>
      <label htmlFor="date-input">Date: </label>
      <input
        required
        type="date"
        name="date"
        id="date-input"
        value={form.date}
        onChange={handleChange}
      />
      <label htmlFor="logEntry-input">Log: </label>
      <textarea
        required
        type="text"
        name="logEntry"
        id="logEntry-input"
        value={form.logEntry}
        placeholder="Add a Log"
        onChange={handleChange}
      />
      <label htmlFor="skills-input">Skills: </label>
      <textarea
        type="text"
        name="skills"
        id="skills-input"
        value={form.skills}
        placeholder="Skills"
        onChange={handleChange}
      />
      <button type="submit" >Submit</button>
    </form>
    <h3>My Logs:</h3>
    <article>
      <MyLogs user={user} myLogs={profile.myLogs} handleDeleteLog={handleDeleteLog} />
    </article>
    </main>
  )
}

export default Profile