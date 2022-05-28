window.addEventListener('load', () => {
  const MODAL_BASE = document.querySelector("#modal-base")

  const changeOptionsBtn = document.querySelector("#change-opts-btn")

  // noinspection DuplicatedCode
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

  const LEVEL_OPTIONS = {
    0: {name: "Easy", icon: ""},
    1: {name: "Medium", icon: ""},
    2: {name: "Hard", icon: ""}
  }
  const THEME_OPTIONS = {
    0: {name: "Flags", icon: ""},
    1: {name: "Halloween", icon: ''},
    2: {name: "Vehicles", icon: ""}
  }

  let LEVEL = JSON.parse(localStorage.getItem('LEVEL') || 0)
  let THEME = JSON.parse(localStorage.getItem("THEME") || 0)

  const showOptionsModal = () => {
    const modalStr = `
    <div class="opts-modal">
    
      <div class="level-opt-container game-options">
        <h5 class="title">Difficulty</h5>
            <img class="left arrow" src="../imgs/left-chevron.svg" alt="left arrow"/>
        <div class="difficulty-opts">
            ${Object.keys(LEVEL_OPTIONS).map((key) => {
      return `
                <p class="lv-opt ${key === `${LEVEL}` ? "show" : ''}" id=lv-${key}-opt >
                  ${LEVEL_OPTIONS[key].name}
                </p>`
    }).join(" ")}
        </div>
            <img src="../imgs/right-chevron.svg" class="right arrow" alt="right arrow"/>
      </div>
      
      <div class="theme-opt-container game-options">
        <h5 class="title">Theme</h5>
        <img class="left arrow" src="../imgs/left-chevron.svg" alt="left arrow"/>
        <div class="theme-opts">
            ${Object.keys(THEME_OPTIONS).map((key) => {
      return ` <p class="theme-opt ${key === `${THEME}` ? "show" : ''}" id="theme-${key}-opt">${THEME_OPTIONS[key].name}
                <span class="theme-icon">${THEME_OPTIONS[key].icon}</span>
                </p>`
    }).join("")}
        </div>
        <img class="right arrow" src="../imgs/right-chevron.svg" alt="right arrow"/>
      </div>
    </div>  
    `
    const {open, modal} = createModal(modalStr)
    const level_box = modal.querySelector('.level-opt-container')
    const theme_box = modal.querySelector('.theme-opt-container')
    level_box.querySelectorAll('.arrow').forEach(
      (el) => {
        el.addEventListener('click', handleLevelChange)
      }
    )
    theme_box.querySelectorAll('.arrow').forEach(
      (el) => {
        el.addEventListener('click', handleThemeChange)
      }
    )
    open()

  }

  const handleLevelChange = (e) => {
    const prev_level = LEVEL
    if (e.target.classList.contains('left')) {
      if (--LEVEL < 0) LEVEL = Object.keys(LEVEL_OPTIONS).length - 1;
    } else {
      if (++LEVEL > Object.keys(LEVEL_OPTIONS).length-1) LEVEL = 0;
    }
    document.querySelector(`#lv-${prev_level}-opt`).classList.remove("show")
    document.querySelector(`#lv-${LEVEL}-opt`).classList.add("show")
    localStorage.setItem('LEVEL', JSON.stringify(LEVEL))
  }

  const handleThemeChange = (e) => {
    const prev_theme = THEME;
    if (e.target.classList.contains('left')) {
      if (--THEME < 0) THEME = Object.keys(THEME_OPTIONS).length - 1;
    } else {
      if (++THEME > Object.keys(THEME_OPTIONS).length-1) THEME = 0;
    }
    document.querySelector(`#theme-${prev_theme}-opt`).classList.remove("show")
    document.querySelector(`#theme-${THEME}-opt`).classList.add("show")
    localStorage.setItem('THEME', JSON.stringify(THEME))

  }

  changeOptionsBtn.addEventListener('click', showOptionsModal)

})

// todo close modal on level restart