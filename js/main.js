window.addEventListener('DOMContentLoaded', () => {
  const contents = document.querySelectorAll('.collapse-wrapper .contents-box')
  const titles = document.querySelectorAll('.title-box')
  const body = document.body
  const navButtons = document.querySelectorAll('.navbar .menu-item')
  const menuButton = document.querySelector('.navbar .menu-button')
  const menu = document.querySelector('.navbar .menu-wrapper')

  let paddingTopValue = 0
  let isCollapseBound = false
  let isMenuButtonBound = false

  // Collapse 展開/收合邏輯，僅在 768px 以下有效
  const bindCollapseEvents = () => {
    if (!isCollapseBound) {
      Array.prototype.forEach.call(titles, (t) => {
        t.addEventListener('click', handleTitleClick)
      })
      isCollapseBound = true
    }
  }

  const unbindCollapseEvents = () => {
    if (isCollapseBound) {
      Array.prototype.forEach.call(titles, (t) => {
        t.removeEventListener('click', handleTitleClick)
      })
      isCollapseBound = false
    }
  }

  const handleTitleClick = (e) => {
    e.target.classList.toggle('active')
    const content = e.target.parentNode.querySelector('.contents-box')
    const height = content.dataset.height
    if (e.target.classList.contains('active')) {
      content.style.height = height + 'px'
    } else {
      content.style.height = '0'
    }
  }

  // 設置 title-box 內容初始高度，並設置為 0
  Array.prototype.forEach.call(contents, (c) => {
    c.dataset.height = c.offsetHeight
    c.style.height = '0'
  })

  // Collapse 展開，當視窗寬度大於 768px 時自動展開
  const expandAllCollapse = () => {
    Array.prototype.forEach.call(contents, (c) => {
      c.style.height = 'auto' // 自動展開
    })
    Array.prototype.forEach.call(titles, (t) => {
      t.classList.add('active') // 確保標題顯示展開狀態
    })
  }

  // Collapse 收合，當視窗寬度小於等於 768px 時重置高度
  const collapseAllCollapse = () => {
    Array.prototype.forEach.call(contents, (c) => {
      c.style.height = '0' // 收合內容
    })
    Array.prototype.forEach.call(titles, (t) => {
      t.classList.remove('active') // 確保標題顯示收合狀態
    })
  }

  // 菜單切換功能，僅在 768px 以下有效
  const toggleMenu = () => {
    menu.classList.toggle('show')
    if (menu.classList.contains('show')) {
      const menuHeight = menu.scrollHeight
      menu.style.height = `${menuHeight}px`
    } else {
      menu.style.height = '0'
    }
  }

  const bindMenuButtonEvent = () => {
    if (!isMenuButtonBound) {
      menuButton.addEventListener('pointerdown', handleMenuButtonClick)
      isMenuButtonBound = true
    }
  }

  const unbindMenuButtonEvent = () => {
    if (isMenuButtonBound) {
      menuButton.removeEventListener('pointerdown', handleMenuButtonClick)
      isMenuButtonBound = false
    }
  }

  const handleMenuButtonClick = (e) => {
    e.preventDefault()
    toggleMenu()
  }

  // 綁定或解除 Collapse 和菜單按鈕的點擊事件，僅在 768px 以下
  const handleResize = () => {
    const windowWidth = window.innerWidth

    // 獲取 body 的 padding-top 值
    const bodyStyle = window.getComputedStyle(body)
    paddingTopValue = parseInt(bodyStyle.getPropertyValue('padding-top'), 10)

    if (windowWidth <= 768) {
      bindCollapseEvents()
      bindMenuButtonEvent()
      collapseAllCollapse() // 收合所有內容
      // 確保小於等於 768px 時菜單預設為收合狀態
      if (!menu.classList.contains('show')) {
        menu.style.height = '0'
      }
    } else {
      unbindCollapseEvents()
      unbindMenuButtonEvent()
      expandAllCollapse() // 展開所有內容
      // 清除菜單 inline 樣式，確保大螢幕下正常顯示
      menu.style.height = ''
      menu.classList.remove('show')
    }
  }

  // 初始執行
  handleResize()
  window.addEventListener('resize', handleResize)

  // 導航按鈕的點擊事件始終保持綁定，平滑滾動到對應區域
  navButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const section = button.getAttribute('data-href')
      const target = document.querySelector(section)
      const positionTop = target
        ? target.offsetTop - paddingTopValue
        : body.scrollHeight - paddingTopValue

      if (menu.classList.contains('show')) {
        menu.classList.remove('show')
        menu.style.height = '0'
      }

      window.scrollTo({ top: positionTop, behavior: 'smooth' })
    })
  })
})
