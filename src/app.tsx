import logo from './assets/logo-nlw-experts.svg'
import { NoteCard } from './components/note-card'
import { NewnoteCard } from './components/new-noteCard'
import { ChangeEvent, useState } from 'react'

interface Note {//Propriedades gerais que todas as notas Vão possuir
  id: string
  date: Date
  content: string
}
export function App() {
  const [search, setSearch] = useState('')// Estado inicial que uma pesquisa irá conter[Usado na linha 50]

  const [notes, setNotes] = useState<Note[]>(() => {
    //função para Busca de notas já existentes no localStorage
    const notesOnStorage = localStorage.getItem('notes') //Pegando as notas
    if (notesOnStorage) { //Se existem faça:
      return JSON.parse(notesOnStorage) //Retorna as notas que foram transformadas em JSON na linha 29
    } else {//Se não:
      return [];
    }
  })

  function onNoteCreated(content: string) {//É passada por paramêtro para a componente que irá receber o content da Nota <NewNoteCard/>
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    } //Objecto que contém as propriedades gerais de uma nota!!

    const notesArray = [newNote, ...notes]//Array que contém as notas
    setNotes(notesArray) //Armazenando as notas na var => notesArray, para fácil transformação de Array para JSON
    localStorage.setItem('notes', JSON.stringify(notesArray)) //Salvar no local Storage do Browser

  }
  function onNoteDeleted(id: string) {
    const notesArray = notes.filter(note => {
      return note.id !== id
    })
    setNotes(notesArray)
    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value
    setSearch(query)
  }
  const filteredNotes = search !== '' ? notes.filter((note) => note.content.toLowerCase().includes(search.toLowerCase())) : notes 
  //Filtros para pesquisa de notas

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 p-5 md:px-0">
      <img src={logo} alt='nlw-logo' />

      <form className='w-full mt-6'>
        <input type='text' placeholder='Busque as suas notas...'
          className="w-full bg-transparent text-3xl font-semibold tracking-tight placeholder:text-slate-500 outline-none"
          onChange={handleSearch} />
      </form>

      <div className='h-px bg-slate-700' />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
        <NewnoteCard onNoteCreated={onNoteCreated} />
        {
          filteredNotes.map((note) => {
            return <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted} />
          }
          )
        }

      </div>
    </div>
  )
}

