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

  Array.prototype.forEach.call(contents, (c) => {
    c.dataset.height = c.offsetHeight
    c.style.height = '0'
  })

  const expandAllCollapse = () => {
    Array.prototype.forEach.call(contents, (c) => {
      c.style.height = 'auto'
    })
    Array.prototype.forEach.call(titles, (t) => {
      t.classList.add('active')
    })
  }

  const collapseAllCollapse = () => {
    Array.prototype.forEach.call(contents, (c) => {
      c.style.height = '0'
    })
    Array.prototype.forEach.call(titles, (t) => {
      t.classList.remove('active')
    })
  }

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

  const handleResize = () => {
    const windowWidth = window.innerWidth

    const bodyStyle = window.getComputedStyle(body)
    paddingTopValue = parseInt(bodyStyle.getPropertyValue('padding-top'), 10)

    if (windowWidth <= 768) {
      bindCollapseEvents()
      bindMenuButtonEvent()
      collapseAllCollapse()

      if (!menu.classList.contains('show')) {
        menu.style.height = '0'
      }
    } else {
      unbindCollapseEvents()
      unbindMenuButtonEvent()
      expandAllCollapse()

      menu.style.height = ''
      menu.classList.remove('show')
    }
  }

  handleResize()
  window.addEventListener('resize', handleResize)

  navButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      navButtons.forEach((btn) => btn.classList.remove('active'))
      button.classList.add('active')
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

  const sections = Array.from(navButtons).map((button) =>
    document.querySelector(button.getAttribute('data-href'))
  )

  window.addEventListener('scroll', () => {
    let currentPosition = window.scrollY + paddingTopValue

    sections.forEach((section, index) => {
      if (!section) return

      const sectionTop = section.offsetTop - paddingTopValue
      const sectionHeight = section.offsetHeight

      if (
        currentPosition >= sectionTop &&
        currentPosition < sectionTop + sectionHeight
      ) {
        navButtons.forEach((btn) => btn.classList.remove('active'))

        navButtons[index].classList.add('active')
      }
    })
  })
})
