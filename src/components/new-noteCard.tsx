import * as Dialog from "@radix-ui/react-dialog"
import { X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from "react"
import { toast } from 'sonner'

interface NewnoteCardProps {
    onNoteCreated: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null
export function NewnoteCard({ onNoteCreated }: NewnoteCardProps) {

    const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
    const [content, setContent] = useState('');
    const [isRecording, setIsRecording] = useState(false)
    function handleStartEditor() {
        setShouldShowOnboarding(false)
    }
    function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
        setContent(event.target.value)

        if (event.target.value === '') {
            setShouldShowOnboarding(true)
        }

    }
    function handleSaveNote(e: FormEvent) {
        e.preventDefault();
        if (content === '') { return }
        onNoteCreated(content)
        setContent('')
        setShouldShowOnboarding(true)
        toast.success('Nota criada com Sucesso!')
    }
    function handleStartRecording() {

        //API de gravação 
        const IsSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
        if (!IsSpeechRecognitionAPIAvailable) {
            alert('Infelizmente seu navegador não suporta a API de gravação!')
            return
        }

        setIsRecording(true)
        setShouldShowOnboarding(false)
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

        speechRecognition = new SpeechRecognitionAPI()

        speechRecognition.lang = 'pt-BR'
        speechRecognition.continuous = true
        speechRecognition.maxAlternatives = 1
        speechRecognition.interimResults = true

        speechRecognition.onresult = (event) => {
            const transcription = Array.from(event.results).reduce((text, result) => {
                return text.concat(result[0].transcript)
            }, '')

            setContent(transcription)
        }
        speechRecognition.start();


    }
    function handleStopRecording() {
        setIsRecording(false)
        if (speechRecognition !== null) {
            speechRecognition.stop()
        }
    }
    return (
        <Dialog.Root>
            <Dialog.Trigger className='rounded-md bg-slate-700 p-5 flex flex-col gap-3 hover:ring-2 hover:ring-slate-600 text-left focus-visible:ring-2 focus-visible:ring-lime-400 outline-none'>
                <span className='text-sm font-medium text-slate-200 text-left'>
                    Adicionar Nota
                </span>
                <p className='text-sm leading-6 text-slate-400 '>Grave uma Nota em áudio que será convertida para texto automaticamente.</p>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="inset-0 fixed bg-black/50">



                    <Dialog.Content className="overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2  fixed md:-translate-x-1/2 md:-translate-y-1/2
           md:max-w-[640px] w-full bg-slate-700  md:h-[60vh] outline-none">
                        <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
                            <X className="size-5" />
                        </Dialog.Close>

                        <form className="flex-1 flex flex-col">
                            <div className="flex flex-1 flex-col gap-3 p-5 rounded-md">
                                <span className='text-sm font-medium text-slate-300'>
                                    Adicionar Nota
                                </span>

                                {
                                    shouldShowOnboarding ? (
                                        <p className='text-sm leading-6 text-slate-400'>
                                            Comece <button type="button" onClick={handleStartRecording} className='font-medium text-lime-400 hover:underline'>gravando uma nota</button> em áudio ou se preferir <button type="button" onClick={handleStartEditor} className='font-medium text-lime-400 hover:underline'>utilize apenas texto</button>.
                                        </p>
                                    ) : (
                                        <textarea autoFocus
                                            className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                                            onChange={handleContentChanged}
                                            value={content} />

                                    )
                                }
                            </div>
                            {
                                isRecording ? (
                                    <button
                                        type="button"
                                        onClick={handleStopRecording}
                                        className="w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:bg-slate-100 ">
                                        <span className="size-3 rounded-full bg-red-600 animate-pulse" />
                                        Gravando! (Clique para interromper)
                                    </button>
                                    //Testar as classes
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleSaveNote}
                                        className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500">
                                        Salvar nota
                                    </button>
                                )
                            }

                        </form>
                    </Dialog.Content>





                </Dialog.Overlay>
            </Dialog.Portal>
        </Dialog.Root>
    )
}