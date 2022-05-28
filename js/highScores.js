window.addEventListener('load', () => {
  const HIGH_SCORE_PARENT = document.querySelector("#high-scores")

  const loadHighScores = () => {
    const highScores = JSON.parse(localStorage.getItem("HIGH_SCORES")) || []
    for (let i = highScores.length - 1; i >= 0; i--) {
      const entry = highScores[i]
      entry.rank = highScores.length - i
      createHighScoreEl(entry)
    }
  }

  const createHighScoreEl = ({rank, name, score}) => {
    const el = document.createElement("div")
    el.classList.add("high-score-entry")
    const rankEL = document.createElement("p")
    rankEL.innerText = rank
    rankEL.classList.add("score-rank")
    el.appendChild(rankEL)
    const nameEL = document.createElement("p")
    nameEL.innerText = name
    nameEL.classList.add("score-name")
    el.appendChild(nameEL)
    const scoreEl = document.createElement("p")
    scoreEl.innerText = score
    scoreEl.classList.add("score-points")
    el.appendChild(scoreEl)

    HIGH_SCORE_PARENT.appendChild(el)

  }


  loadHighScores()
})