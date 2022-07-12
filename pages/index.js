import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import styles1 from '../styles/Home.module.css'
import { words } from '../public/words'
import { MdOutlineBackspace } from  'react-icons/md'
const API_URL = "https://emmanyel368.api.stdlib.com/wordle-api@1.0.1/wordle/"
export default function Home() {
    const [solution, setSolution] = useState('PANEL')
    const [matched,setMatched] = useState(false)
    const [lineNumber, setLineNumber] = useState(0);
    const [letterNumber, setLetterNumber] = useState(0);
    const [guesses,setGuesses] = useState(['','','','','',''])
    const [styles,setStyles] = useState(Array(6).fill('11111'))
    const reset = () => {
        setModalVisible(null)
        const getWord = () => {
        
                setSolution(word);
        };
        const word = words[Math.floor(Math.random()*words.length)]
        // console.log(word+'---------------');
        getWord();
        setMatched(m => false)
        setLineNumber(m => 0)
        setLetterNumber(m => 0)
        setGuesses(m => ['','','','','',''])
        setStyles(m => Array(6).fill('11111'))
        setGuessedLetters(m => [])
    }
    useEffect(() => {
        const getWord = () => {
        
                setSolution(m => word);
        };
        const word = words[Math.floor(Math.random()*words.length)]
        // console.log(word+'---------------');
        getWord();
    },[solution]);

    // console.log(guesses);
    useEffect(() => {
    
        const checkWord = () => {
            if(solution.toLocaleUpperCase()===guesses[lineNumber].toLocaleUpperCase()){
                styles[lineNumber] = '33333'
                return true
            }
            let solStyle = ['1','1','1','1','1']
            var styleArr = ['1','1','1','1','1']
            for (let i = 0; i < 5; i++) {
                const element = guesses[lineNumber][i];
                if(element.toString().toLocaleUpperCase() === solution[i].toString().toLocaleUpperCase()){
                    styleArr[i] = '3'
                    solStyle[i] = '3'
                }
            }
            for (let i = 0; i < 5; i++) {
                if(styleArr[i]==='1'){
                    const element = guesses[lineNumber][i];
                    for(let j = 0; j < 5; j++) {
                        if(solStyle[j]==='1'){
                            // console.log('comparing '+element.toString().toLocaleUpperCase()+'and '+solution[i].toString().toLocaleUpperCase());
                            if(element.toString().toLocaleUpperCase() === solution[j].toString().toLocaleUpperCase()){
                                styleArr[i]= '2'
                                solStyle[j]= '2'
                                break
                            }
                        }
                    }
                }
            }
            for(let j = 0; j < 5; j++) {
                if(styleArr[j]==='1'){
                    styleArr[j]='0'
                }
            }
            styles[lineNumber] = styleArr.join('');
            setGuessedLetters([...guessedLetters, ...guesses[lineNumber].split('') ])
            setStyles(styles)
            return false
        }
        const handleType = (event) => {
            if(matched) return
            if(event.key === 'Backspace' && letterNumber > 0){
                setPressedLetter(p => 'Backspace')
                // console.log(event.key);
                guesses[lineNumber]=guesses[lineNumber].substring(0,guesses[lineNumber].length-1)
                setLetterNumber(prev => prev-1)
                // return
            }
            else if(event.key === 'Enter' && guesses[lineNumber].length===5){
                setPressedLetter(p => 'Enter')
                if(checkWord() === true){
                    setModalVisible(m => 'MATCHED')
                    setMatched(m => true)
                }else if(guesses[5].length>=5){
                    setModalVisible(m => 'FAILED LOL')
                }
                setLineNumber(prev => prev+1)
                
                // return
            }
            else if(guesses[5].length>=5) return
            else if(event.keyCode<=90 && event.keyCode>=65  && guesses[lineNumber].length<5){
                setPressedLetter(p =>event.key.toLocaleUpperCase())
                guesses[lineNumber]=guesses[lineNumber]+''+(event.key.toString())
                setGuesses(g => guesses)
                setLetterNumber(prev => prev+1)
            }
            
            setTimeout(() => {
                setPressedLetter(p => null)
            }, 100);
        }
        window.addEventListener('keydown', handleType)
        return () => window.removeEventListener('keydown', handleType);
    },[lineNumber,letterNumber
        , guesses 
        , matched
        ,guessedLetters
        , solution
        , styles
    ])
    
    const lineBoxes = (guess,j) => {
        const tiles = []
        for (let i = 0; i < 5; i++) {
            const char = guess[i]
            tiles.push(<div key={i} className={classStyle(styles[j][i])}>
                <span className='text-3xl'>
                    {char}
                </span>
            </div>)
        }
        return <div key={j} className='grid grid-cols-5 gap-2 w-fit '>{tiles}</div>
    }
    const classStyle = (type) => {
        switch (type) {
            case '0':
                return ' border-2 border-gray-400 bg-gray-400 rounded-md w-14 h-14 flex justify-center items-center'
        
            case '1':
                return ' border-2 border-gray-400 rounded-md w-14 h-14 flex justify-center items-center'
        
            case '2':
                return 'bg-yellow-600 border-2 border-gray-400 rounded-md w-14 h-14 flex justify-center items-center'
        
            case '3':
                return 'bg-green-600 border-2 border-gray-400 rounded-md w-14 h-14 flex justify-center items-center'
        
            default:
                break;
        }
    }

    const [modalVisible,setModalVisible] = useState(null)
    const [ copiedVisible, setCopiedVisible ] = useState(0)
    const handleCopy = () => {
        setCopiedVisible(1)
        navigator.clipboard.writeText('http://localhost:3000/')
        setTimeout(function() {
            setCopiedVisible(0)
        }, 1000);
    }
    const [pressedLetter,setPressedLetter] = useState(null)
    const [guessedLetters,setGuessedLetters] = useState([])
    const hoverClass = (letter) => {
        
        if(guessedLetters.find(lett =>  lett.toLocaleUpperCase() === letter.toLocaleUpperCase() )) {
            return solution.split('').find((lett)=>{
                return lett.toLocaleUpperCase() === letter.toLocaleUpperCase()})?' bg-yellow-600 text-black ':' bg-gray-600 text-white '
            
        }
        return pressedLetter===letter ? ' bg-black text-white ' : 'bg-gray-200 '
    }


    return (
    <div className=''>
        <Head>
            <title>{`Nitin's Wordle`}</title>
            <meta name="description" content="Generated by create next app" />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className={modalVisible?'fixed top-0 left-0 w-screen h-screen':'hidden'}>
            <div className={'w-full h-full flex justify-center items-center text-white bg-gray-200/50'}>
                <div className={modalVisible==='MATCHED'?'bg-green-600 border border-gray-400 rounded-lg w-44 h-56 flex flex-col justify-evenly items-center':'bg-red-500 border border-gray-400 rounded-lg w-44 h-56 flex flex-col justify-evenly items-center'}>
                    <h2 className='text-xl font-bold'>{modalVisible}</h2>
                    <h3>{modalVisible==='MATCHED'?'':'"'+solution+'"'}</h3>
                    <div onClick={reset} className='cursor-pointer border border-white hover:bg-white hover:text-gray-400 rounded-lg px-5 py-1'>
                        <span>New Game</span>
                    </div>
                    <div onClick={handleCopy} className='cursor-pointer border border-white hover:bg-white hover:text-gray-400 rounded-lg px-5 py-1' >Share Game</div>
                </div>
            </div>
        </div>
        <div className={copiedVisible?'fixed w-screen h-screen':'hidden'}>
            <div className=' bottom-0 right-0 w-fit h-fit px-3 py-5 bg-gray-600 rounded-lg text-white' >Copied!</div>

        </div>

        <div className=' h-screen flex flex-col font-sans'>
            <div>
                <h1 className='w-full text-center text-5xl font-extrabold font-sans py-10' >{`Nitin's Wordle`}</h1>
            </div>
            <div className=' flex justify-evenly items-center h-fit '>
                <div className='w-1/2 flex justify-center items-center '>
                    <div className='p-2 border-black grid grid-rows-6 gap-2 font-bold '>
                    { guesses.map((guess,i) => <div key={i}>{lineBoxes(guess.toLocaleUpperCase(),i)}</div> ) }
                    </div>
                </div>
                <div className='flex flex-col justify-center items-center w-1/2 font-bold ' >
                    <div className='flex justify-center items-center py-1'>
                        {['Q','W','E','R','T','Y','U','I','O','P'].map((letter) => (
                            <div key={letter} className='px-1'>
                                <div className={hoverClass(letter)+'border rounded-lg hover:bg-white w-8 text-center px-2 py-2 cursor-pointer ' }>{letter}</div>
                            </div>
                        ))}
                    </div>
                    <div className='flex justify-center items-center py-1'>
                        {['A','S','D','F','G','H','J','K','L'].map((letter) => (
                            <div key={letter} className='px-1'>
                                <div className={hoverClass(letter)+'border rounded-lg hover:bg-white w-8 text-center px-2 py-2 cursor-pointer ' }>{letter}</div>
                            </div>
                        ))}
                    </div>
                    <div className='flex justify-center items-center py-1'>
                        {['Backspace','Z','X','C','V','B','N','M','Enter'].map((letter) => {
                            if(letter === 'Backspace'){
                                return <div key={letter} className='px-1'>
                                    <div className={hoverClass(letter)+'border rounded-lg hover:bg-white w-fit text-center px-3 py-2 cursor-pointer ' }>{<MdOutlineBackspace size={24} />}</div>
                                </div>
                            }
                            else if(letter === 'Enter'){
                                return <div key={letter} className='px-1'>
                                    <div className={hoverClass(letter)+'border rounded-lg hover:bg-white w-fit text-center px-3 py-2 cursor-pointer ' }>{letter}</div>
                                </div>
                            }
                            return <div key={letter} className='px-1'>
                                <div className={hoverClass(letter)+'border rounded-lg hover:bg-white w-8 text-center px-2 py-2 cursor-pointer ' }>{letter}</div>
                            </div>
                        })}
                    </div>
                </div>
            </div>
        </div>

    </div>
    )
}
