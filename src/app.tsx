import logo from './assets/logo-nlw-experts.svg'
import { NoteCard } from './components/note-card'
import { NewnoteCard } from './components/new-noteCard'


export function App() {
  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6">
      <img src={logo} alt='nlw-logo' />

      <form className='w-full mt-6'>
        <input type='text' placeholder='Busque as suas notas...'
          className="w-full bg-transparent text-3xl font-semibold tracking-tight placeholder:text-slate-500 outline-none" />
      </form>

      <div className='h-px bg-slate-700' />

      <div className="grid grid-cols-3 gap-6 auto-rows-[250px]">
        <NewnoteCard />
        <NoteCard note={
          {
            date: new Date(),
            content: "Hello Vagabond"
          }
        } />

      </div>
    </div>
  )
}

