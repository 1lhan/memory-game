import { useState } from "react"

export default function App() {
    const [difficultyLevel, setDifficultyLevel] = useState(-1)
    const [emojis, setEmojis] = useState([])
    const [clickedEmojis, setClickedEmojis] = useState([])
    const [clickCount, setClickCount] = useState(0)
    const [disableClick, setDisableClick] = useState(false)
    const [correctCount, setCorrectCount] = useState(0)

    const startGame = () => {
        const memoryGameDiv = document.getElementById('memory-game-div');
        if (memoryGameDiv.children.length > 0) {
            for (let i = 0; i < memoryGameDiv.children.length; i++) {
                memoryGameDiv.children[i].children[0].classList.remove('turn')
            }
        }

        setCorrectCount(0)
        setClickCount(0)
        setClickedEmojis([])
        setEmojis([])

        const allEmojis = [
            '🍇', '🍈', '🍉', '🍊', '🍋', '🍌', '🍍', '🥭', '🍎',
            '🍏', '🍐', '🍑', '🍒', '🍓', '🥝', '🍅', '🥥'
        ]

        if (difficultyLevel == -1) return false

        let _emojis = [...allEmojis.slice(0, difficultyLevel), ...allEmojis.slice(0, difficultyLevel)]
        for (let i = 0; i < 5; i++) {
            for (let j in _emojis) {
                let random = Math.ceil(Math.random() * (_emojis.length - 1))
                let emoji = _emojis.splice(j, 1)[0]
                _emojis.splice(random, 0, emoji)
            }
        }
        setTimeout(() => setEmojis(_emojis), 750);
    }

    const onClickToEmoji = (e) => {
        if (!e.target.parentNode.classList.contains('turn')) {
            e.target.parentNode.classList.add('turn')
            let _arr = clickedEmojis;
            _arr.push(e.target.id)
            if (_arr.length % 2 == 0) setDisableClick(true)
            setClickedEmojis(() => _arr)
            setClickCount(clickCount + 1)
        }

        if (clickedEmojis.length % 2 == 0) {
            setTimeout(() => {
                let value1 = clickedEmojis.slice(clickedEmojis.length - 2)[0]
                let value2 = clickedEmojis.slice(clickedEmojis.length - 2)[1]

                if (emojis[value1] != emojis[value2]) {
                    document.getElementById('memory-game-div').children[value1].children[0].classList.remove('turn')
                    document.getElementById('memory-game-div').children[value2].children[0].classList.remove('turn')
                }
                else setCorrectCount(() => correctCount + 1)

                setDisableClick(false)
            }, 1000);
        }
    }

    return (
        <div className="memory-game-page">
            <h2 className="header">Memory Game</h2>
            <div className="game-settings-div">
                <div style={{ width: '10rem' }} className='custom-select'>
                    <span className='selected-value'>
                        {difficultyLevel == -1 ? 'Difficulty Level' : difficultyLevel}
                        <i className="fa-solid fa-caret-down" />
                    </span>
                    <div className='values-div'>
                        {[...Array(13)].map((item, index) =>
                            index > 0 && index % 2 == 0 ?
                                <span onClick={() => setDifficultyLevel(index)} key={index}>{index}</span> : ''
                        )}
                    </div>
                </div>
                <button className="btn" onClick={() => startGame()}>Start Game</button>
            </div>
            <div className="click-count-div">
                <span>Click Count</span>
                <span>{clickedEmojis.length}</span>
            </div>
            {emojis.length > 0 && correctCount == emojis.length / 2 && '🎉'}
            <div style={{ padding: emojis.length > 0 ? '' : 0 + 'px' }} id="memory-game-div" className="memory-game-div">
                {emojis?.map((item, index) =>
                    <span style={{ height: (((document.getElementById('memory-game-div').getBoundingClientRect().width) - 32) * 0.24) + 'px' }} className="emoji" key={index}>
                        <span className="emoji-inner">
                            <button disabled={disableClick} id={index} onClick={(e) => onClickToEmoji(e)} className="emoji-front" />
                            <span className="emoji-back">{item}</span>
                        </span>
                    </span>
                )}
            </div>
        </div>
    )
}