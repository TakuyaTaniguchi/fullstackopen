import React, {useState, useEffect} from 'react'
import axios from 'axios'
import Note from './components/Note'

const App = (props) => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/notes')
      .then(response => {
        console.log('promise fulfilled')
        setNotes(response.data)
      })
  },[])
  console.log('render', notes.length, 'notes')

  const toggleImportanceOf = id => {
    const url = `http://localhost:3001/notes/${id}`
    //notes全体から引数に指定されたnoteを探す。
    const note = notes.find(n => n.id === id)
    const changeNote = { ...note, important: !note.important}
    console.dir(changeNote);

    axios.put(url, changeNote).then(response => {
      setNotes(notes.map(note => note.id !== id ? note : response.data))
    })
    console.log(`importance of ${id} needs to be toggled`)
  }

  const notesToShow = showAll
  ? notes
  : notes.filter(note => note.important === true)

  const rows = () => notesToShow.map(note =>
    <Note
      key={note.id}
      note={note}
      toggleImportance={() => toggleImportanceOf(note.id)}
    />
  )

  const addNote = event => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      data: new Date(),
      important: Math.random() > 0.5,
    }

    axios
      .post('http://localhost:3001/notes',noteObject)
      .then(response => {
        setNotes(notes.concat(response.data))
        setNewNote('')
      })
  }

  const handleNoteChange = (event) =>{
    console.log(event.target.value)
    setNewNote(event.target.value)
  }


  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}> 
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {rows()}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange}/>
        <button type="submit">Save</button>
      </form>
    </div>
  )
}

export default App