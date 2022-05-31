window.addEventListener('load', () => {
  let LEVEL = JSON.parse(localStorage.getItem('LEVEL') || 0)
  let THEME = JSON.parse(localStorage.getItem("THEME") || 0)
  let GAME_BOARD = document.querySelector("#game-board")
  const SCORE_CARD = document.querySelector("#score-card")
  const MODAL_BASE = document.querySelector("#modal-base")
  const RESTART_BTN = document.querySelector("#restart-btn")
  const OPTIONS = {
    themes: {
      0: {
        name: "Flags", emojis: [
          "🇦🇪", "🇦🇫", "🇦🇬", "🇦🇮", "🇦🇱", "🇦🇲", "🇦🇴", "🇦🇶", "🇦🇷",
          "🇦🇸", "🇦🇹", "🇦🇺", "🇦🇼", "🇦🇽", "🇦🇿", "🇧🇦", "🇧🇧", "🇨🇦", "🇫🇴",
          "🇬🇪", "🇯🇵", "🇯🇲", "🇿🇦", "🇬🇭", "🇩🇪", "🇧🇷", "🇲🇲", "🇷🇸", "🇬🇧", "🇺🇸",]
      },
      1: {
        name: "Halloween",
        emojis: [
          "🦇", "🦉", "🪲", "🪳", "🕷", "👺", "👻", "👽", "💀", "☠", "🤡",
          "🕸", "🪱", "🥀", "🍫", "🕯", "🗡", "⛓", "🩸", "⚰", "🪦", "⚱", "👹",
        ]
      },
      2: {
        name: "Vehicles", emojis: [
          "✈️", "🚗", "🚕", "🚙", "🚌", "🚎", "🏎", "🚓", "🚑", "🚒", "🚐", "🛻", "🛳", "🛩", "🚇", "🚆",
          "🚚", "🚛", "🚜", "🚔", "🛵", "🚲", "🛴", "🦼", "🦯", "🛺", "✈️", "🚀", "🛸", "🚢", "⛴", "🛥", "🚠"]
      },
      3: {
        name: "Foods", emojis: ["🍏", "🍓", "🍌", "🍭", "🍹", "🥡", "🍨", "🍦", "🍣", "🍛",
          "🎂", "🥩", "🍞", "🥖", "🍔", "🍟", "🍕", "🌮", "🥬", "🍆", "🍅", "🍒", "🍊",
          "🍍", "🍉", "🧃", "☕️", "🍪", "🍩", "🍿",]
      },
      4: {
        name: "Animals", emojis: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "❄️", "🐨",
          "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐺", "🦉", "🦋", "🐌", "🐍", "🐳", "🦧",
          "🦒", "🦃", "🦩", "🦢", "🐓", "🐘", "🦈", "🐝"]
      }
    },
    level_options: {
      0: {name: "Easy", className: "easy", numCards: 8},
      1: {name: "Medium", className: "medium", numCards: 10},
      2: {name: "Hard", className: "hard", numCards: 15}
    }
  }

  //GAME STATE
  let EMOJIS = []
  let CARDS = {};
  let SELECTED = []
  let SCORE = 0
  let NAME = ""

  // const hMarker = document.querySelector(".horizontal-marker")
  // const vMarker = document.querySelector(".vertical-marker")

  const updateGameBardPerspective = (e) => {
    const rect = e.target.getBoundingClientRect()
    const xPos = rect.x + (rect.width / 2)
    const yPos = rect.y + (rect.height / 2)
    const xOrigin = 100 - (((window.innerWidth - xPos) / window.innerWidth) * 100)
    const yOrigin = 100 - (((window.innerHeight - yPos) / window.innerHeight) * 100)

    GAME_BOARD.style.perspectiveOrigin = `${xOrigin}% ${yOrigin}%`
  }
  const animateCards = (e) => {
    const cardId = e.target.id
    const rect = e.target.getBoundingClientRect()
    const xPos = rect.x + (rect.width / 2)
    const yPos = rect.y + (rect.height / 2)
    const xAxis = (xPos - e.pageX) / 10
    const yAxis = (yPos - e.pageY) / 10
    if (!CARDS[cardId].isFaceUp) {
      updateGameBardPerspective(e)
      GAME_BOARD.style.perspective = '12vw'
    }

    e.target.style.transform = `rotateY(${yAxis}deg) rotateX(${xAxis}deg)`
  }
  const flipCard = (e) => {
    updateGameBardPerspective(e)
    GAME_BOARD.style.perspective = '100vw'
    e.target.style.transform = `rotateY(-180deg)`
  }

  const start = () => {
    // shuffleArray(emojis) // shuffle emoji
    GAME_BOARD.classList.add(OPTIONS.level_options[LEVEL].className)

    SCORE = 0
    updateScore(0)
    const card_els = createCards()
    shuffleArray(card_els)
    card_els.forEach((card, id) => {
      card.el.id = `${id}`
      card.el.addEventListener("click", handleClick)
      CARDS[`${id}`] = card
      GAME_BOARD.appendChild(card.el)
    })
    const rect = GAME_BOARD.getBoundingClientRect()
    const card_rect = GAME_BOARD.querySelector('.card').getBoundingClientRect()
    // vMarker.style.left = `${((window.innerWidth-(rect.x + rect.width / 2))/window.innerWidth)*100}%`
    // hMarker.style.top = `${rect.y + rect.height}px`
    const xPos = `${((((rect.x + (rect.width / 2)) - card_rect.width / 2) / window.innerWidth)) * 100}%`
    const yPos = `${((rect.y + rect.height) / window.innerHeight) * 100}%`
    gsap.fromTo('.card', {
      top: yPos,
      margin: 0,
      position: "absolute",
      left: xPos,
      duration: 1.5,
      minWidth: "7vw",
      aspectRatio: "2/3",
      // minHeight: "17vh",
      boxShadow: 'rgba(50, 50, 93, 0.025) 0 13px 27px -5px, rgba(0, 0, 0, 0.003) 0px 8px 16px -8px;'

    }, {
      top: 'auto',
      stagger: .1,
      position: "relative",
      left: "auto",
      margin: "5%",
      minWidth: "auto",
      aspectRatio: "unset",
      // width: "auto",
      // height: "auto",
      // minHeight: "auto",
      boxShadow: 'rgba(50, 50, 93, 0.25) 0 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px'
    })


    // showHighScoreUserModal()
  }

  const checkGameOver = () => {
    return Object.values(CARDS).reduce((prev, cur) => {
      if (!prev) return false;
      return cur.isMatched
    })
  }

  const updateScore = (points) => {
    SCORE += points
    SCORE_CARD.textContent = SCORE

  }

  const calculateScore = () => {
    const round_score = CARDS[SELECTED[0]].attempts + CARDS[SELECTED[1]].attempts
    updateScore(round_score)
  }

  const updateCardScore = (card_id) => {
    if (CARDS[card_id].isFaceUp && CARDS[card_id].attempts > 1) {
      CARDS[card_id].attempts -= 1
    }
  }

  const handleClick = (e) => {
    const card_id = e.target.id
    if (!CARDS[card_id].isFaceUp) {
      clearSelected(card_id)
      toggleFaceUp(card_id)
      updateCardScore(card_id)
      const matches = checkMatches()
      if (matches) {
        const gameOver = checkGameOver()
        if (gameOver) handleGameOver();
      }
    }
  }

  const handleGameOver = () => {
    // save score if high score
    // SHOW MODAL
    if (hasHighScore()) {
      showHighScoreUserModal(showGameOverModal)
    } else {
      showGameOverModal()
    }
  }


  const showHighScoreUserModal = (onClose = null) => {
    const innerHtml = `
    <form id="get-user-name-form">
     <p class="">New High Score</p>
     <div class="form-body">
        <label for="user-name">Name</label>
        <input name="user-name" id="user-name" placeholder="Enter your name">
     </div>
    
    <button name="user-form-submit" type="submit" class="btn submit" id="user-form-btn">
        Submit
    </button>
    </form>
    `
    const {open, modal, close} = createModal(innerHtml, true, onClose)
    modal.querySelector("#user-form-btn").addEventListener('click',
      (e) => {
        e.preventDefault()
        const res = handleHighScoreFormSubmit()
        if (res) close();

      })
    open()
  }

  const handleHighScoreFormSubmit = () => {
    const el = document.querySelector("#user-name")
    NAME = el.value
    console.log(NAME)
    if (!NAME) return false
    el.value = ""
    setHighScore(NAME)
    return true

  }

  const restart = () => {
    // clear board.
    Object.values(CARDS).forEach((card) => {
      card.el.remove()

    })
    // empty cards ,
    CARDS = {}
    NAME = ""
    // EMPTY selected
    SELECTED = []
    // CLEAR SCORE
    SCORE = 0
    start()// restart
  }

  const checkMatches = () => {
    if (SELECTED.length === 2) {
      if (CARDS[SELECTED[0]].emoji === CARDS[SELECTED[1]].emoji) {
        SELECTED.forEach((card_id) => {
          CARDS[card_id].isMatched = true
          CARDS[card_id].el.removeEventListener("click", handleClick)
          // CARDS[card_id].el.style.transition = "opacity 350ms ease-out 1s"
          // CARDS[card_id].el.classList.add("matched")
          // window.requestAnimationFrame(()=> )
          window.setTimeout(_ => CARDS[card_id].el.classList.add("matched"), 500)

        })

        calculateScore()
        // console.log("MATCHED!")
        SELECTED = []
        return true
      }
      return false
    }
  }

  const clearSelected = (card_id) => {
    if (SELECTED.length === 2) {
      SELECTED.forEach(_card_id => toggleFaceUp(_card_id))
      SELECTED = []
    }
    SELECTED.push(card_id)

  }

  const toggleFaceUp = (card_id) => {
    CARDS[card_id].isFaceUp = !CARDS[card_id].isFaceUp
    CARDS[card_id].isFaceUp ?
      CARDS[card_id].el.classList.add("is-face-up") :
      CARDS[card_id].el.classList.remove("is-face-up")
    // todo move to
    const emoji = CARDS[card_id].el.querySelector(".emoji")
    emoji.innerHTML = CARDS[card_id].isFaceUp ? CARDS[card_id].emoji : ""
    emoji.style.transform = `rotateY(180deg)`

  }

  const handleMouseLeave = (e) => {
    const card_id = e.target.id
    e.target.removeEventListener("mousemove", animateCards)
    e.target.removeEventListener("mouseleave", handleMouseLeave)
    if (!CARDS[card_id].isFaceUp) {
      e.target.style.transition = "all 0.5s ease"
      e.target.style.transform = `rotateY(0deg) rotateX(0deg)`
    }

  }
  const handleMouseEnter = (e) => {
    const card_id = e.target.id
    if (!CARDS[card_id].isFaceUp) {
      e.target.style.transition = "none"
      e.target.addEventListener("mouseleave", handleMouseLeave)
      e.target.addEventListener("mousemove", animateCards)
    }
  }

  const handleCardClick = (e) => {
    e.target.removeEventListener("mousemove", animateCards)
    e.target.removeEventListener("mouseleave", handleMouseLeave)
    e.target.style.transition = "all 0.3s ease"
    flipCard(e)

  }

  const createCardElement = (emoji) => {
    const el = document.createElement('div')
    el.classList.add(`card`)
    el.innerHTML = `<span class="emoji">${emoji}</span>`

    el.addEventListener("mouseenter", handleMouseEnter)
    // el.addEventListener("mouseleave", handleMouseLeave)
    el.addEventListener("click", handleCardClick)
    return el

  }

  const createCards = (faceUp = false) => {
    //shuffle cards and choose num according to level
    shuffleArray(OPTIONS.themes[THEME].emojis)
    EMOJIS = OPTIONS.themes[THEME].emojis.slice(0, OPTIONS.level_options[LEVEL].numCards)
    const els = []
    EMOJIS.forEach((emoji) => {//create cards
      for (let i = 0; i < 2; i++) {
        els.push({
          emoji: emoji,
          isFaceUp: false,
          isMatched: false,
          attempts: 4,
          el: createCardElement(faceUp ? emoji : "")
        })
      }
    })
    return els
  }

  // noinspection DuplicatedCode
  const createModal = (innerHTML, ignoreOutsideClick = false, onClose = null) => {
    const modal = document.createElement("div")
    modal.classList.add("modal")
    modal.innerHTML = `
        <div class="modal-content">
        <button class=" close">&times;</button>
        <div class="modal-body">
          ${innerHTML}
        </div>
        
        </div>
      </div>
    `
    const open = () => {
      modal.classList.add("open")
    }
    const handleClose = () => {

      modal.classList.remove('open')
      modal.remove()
      if (onClose) {
        onClose()
      }
    }

    // noinspection DuplicatedCode
    const handleOutsideClick = (e) => {
      if (ignoreOutsideClick) return;
      if (e.target === modal && modal.classList.contains('open')) {
        handleClose()
      }
    }
    modal.querySelector('.close').addEventListener('click', handleClose)

    modal.addEventListener('click', handleOutsideClick)
    MODAL_BASE.appendChild(modal)

    return {modal, open, close: handleClose,}
  }

  const showGameOverModal = () => {
    const innerHtml = `
    <div class="game-over-modal">
      <h3 class="title">Game Complete</h3>
      ${hasHighScore() ? '<p class="body">You got a high score</p>' : ""}
      <p class="body">Your score was</p>
      <h2 class="score">${SCORE}</h2>
      <div class="btn-box">
        <a href="index.html" class="btn">Home</a>
        <button class="btn restart-btn">Restart</button>
      </div>
    </div>
    `

    const {open, modal, close} = createModal(innerHtml)
    modal.querySelector('.restart-btn')
      .addEventListener('click', () => {
        close()
        restart()
      })
    open()
  }

  const getHighScoreIndex = (highScores) => {
    let newHighScoreIdx = null;
    // find index of high score
    if (!highScores.length) return 0;

    for (let i = 0; i < highScores.length; i++) {
      console.log(`calculating hi score idx i=${i}`)
      if (SCORE >= highScores[i].score) {
        newHighScoreIdx = i;
        console.log(`calculating hi score idx cur score greater than cur idx`)
        return i
        // for (let j = i + 1; j < highScores.length; j++) {
        //   if (highScores[j].score === highScores[i].score) {
        //     newHighScoreIdx = j
        //   } else {
        //     break
        //   }
        // }
        // break
      }
    }

    return newHighScoreIdx
  }

  const hasHighScore = () => {
    //{score: int, name:str}
    const highScores = JSON.parse(localStorage.getItem("HIGH_SCORES")) || []
    if (!SCORE) return false;
    if (highScores.length < 10) {
      return true
    }
    return getHighScoreIndex(highScores) != null

  }


  const setHighScore = (name) => {
    const highScores = JSON.parse(localStorage.getItem("HIGH_SCORES")) || []
    const highScoreIdx = getHighScoreIndex(highScores)
    console.log(`High Score => ${highScores}`)
    console.log(highScores)
    console.log(highScoreIdx)
    highScores.splice(highScoreIdx, 0, {name: name, score: SCORE})
    if (highScores.length > 10) highScores.pop();
    localStorage.setItem("HIGH_SCORES", JSON.stringify(highScores))
  }
  RESTART_BTN.addEventListener("click", restart)

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  start()


})

