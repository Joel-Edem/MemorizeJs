window.addEventListener('load', () => {
  let GAME_BOARD = document.querySelector("#game-board")
  const SCORE_CARD = document.querySelector("#score-card")
  const MODAL_BASE = document.querySelector("#modal-base")
  const RESTART_BTN = document.querySelector("#restart-btn")
  const EMOJIS = [
    // "🇦🇪", "🇦🇫", "🇦🇬", "🇦🇮", "🇦🇱", "🇦🇲", "🇦🇴", "🇦🇶", "🇦🇷",
    "🇦🇸", "🇦🇹", "🇦🇺", "🇦🇼", "🇦🇽", "🇦🇿", "🇧🇦", "🇧🇧",
  ]
  let CARDS = {};
  let SELECTED = []
  let SCORE = 0

  const start = () => {
    // shuffleArray(emojis) // shuffle emoji
    GAME_BOARD.classList.add("easy") // todo change difficulties
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

  const handleClick = (e) => {
    const card_id = e.target.id
    if (!CARDS[card_id].isFaceUp) {
      clearSelected(card_id)
      toggleFaceUp(card_id)
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
    showGameOverModal()
  }

  const restart = () => {
    // clear board.
    Object.values(CARDS).forEach((card) => {
      card.el.remove()

    })
    // empty cards ,
    CARDS = {}
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
          CARDS[card_id].el.classList.add("matched")
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
    CARDS[card_id].el.querySelector(".emoji").innerHTML = CARDS[card_id].isFaceUp ? CARDS[card_id].emoji : ""
    if (CARDS[card_id].isFaceUp && CARDS[card_id].attempts > 1) {
      CARDS[card_id].attempts -= 1
    }
  }

  const createCardElement = (emoji) => {
    const el = document.createElement('div')
    el.classList.add(`card`)
    el.innerHTML = `<span class="emoji">${emoji}</span>`
    return el
  }

  const createCards = (faceUp = false) => {
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

  const createModal = (innerHTML, ignoreOutsideClick = false) => {
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
    }


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
      <h3 class="title">Game Complete<br/>Woohoo!</h3>
      <p class="body">Your score was</p>
      <h2 class="score">${SCORE}</h2>
      <div class="btn-box">
        <a href="index.html" class="btn">Home</a>
        <button class="btn restart-btn">Restart</button>
      </div>
    </div>
    `
    // todo add form to track high scores
    const {open, modal} = createModal(innerHtml)
    modal.querySelector('.restart-btn')
      .addEventListener('click', restart)
    open()
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

