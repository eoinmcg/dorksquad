import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {
  }

  preload () {
    Phaser.Canvas.setSmoothingEnabled(this.game.context, false)

    this.loadingSfx = this.game.add.audio('loading')

    this.load.image('skull', 'a/i/skull.png')
    this.load.spritesheet('bg', 'a/i/bg.png', 160, 200)

    const link = document.querySelector("link[rel*='icon']") ||
      document.createElement('link')
    link.type = 'image/x-icon'
    link.rel = 'shortcut icon'
    link.href = 'a/i/skull.png'
    document.getElementsByTagName('head')[0].appendChild(link)

    const body = document.querySelector('body')
    body.style.position = 'fixed;'
    body.style.transition = 'background-position 3s ease-out'

    const style = document.createElement('style')
    style.type = 'text/css'
    style.innerHTML = `
    body.loading {
       background: #333 url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAADICAYAAABvaOoaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QsJFBUFR+QFKwAAAbVJREFUeNrt3IENwyAMRUETsf/KZIhgUOy7EaqnXzWFjIhYAZc8PgIEiABBgLQzl58gWEAECAJEgCBABAgCRIAgQAQICUY4D4gFRIAgQAQIAqQLB1KxgAgQBIgAQYAIEASIACGV41hYQAQIAkSAIEAECAJEgCBABAgCRIAgQAQIAkSAIEAECALkf7ycCAuIAEGACBAEiABBgAgQBIgAQYAIEARIHd6QigVEgCBABAgCpA93QrCACBAEiABBgAgQBIgAQYAIEASIAEGACBC2cCkJC4gAQYAIEARIHy4lYQERIAgQAYIAESAIEAGCABEgpHAgFQuIAEGACBAEiABBgNTnSD4WEAHCFf6KwwIiQBAgAoSjPAfEAiJAECACBAEiQBAgAgQBIkAQIAKErZyIxgIiQBAgAgQBIkAQIAIEAVKXa5lYQAQIAkSAIEAECAJEgCBABAgCRIAgQAQIAkSA8IlXc2ABESAIEAGCABEgCJD6XEzHAiJAECACBAEiQBAgAgQBUpcT0VhABAgCRIAgQAQIAqQ+J6KxgAgQBIgAQYAIEI5wHIurPAfEVzACBAEiQBAgAoQjXs0KIns7vl4bAAAAAElFTkSuQmCC'); 
    }
    body.scroll {
        background-position:0px -3000px;
    }
    `
    document.getElementsByTagName('head')[0].appendChild(style)
    setTimeout(() => {
      document.querySelector('body').classList.add('loading')
      this.loadingSfx.play()
    }, 500)
    setTimeout(() => {
      document.querySelector('body').classList.add('scroll')
    }, 800)
    setTimeout(() => {
      document.querySelector('body').classList.remove('loading')
      document.querySelector('body').classList.remove('scroll')
      this.bg.kill()
      this.loadingSfx.stop()
      body.style.backgroundColor = '#000'
    }, 4200)
  }

  create () {
    this.bg = this.game.add.sprite(0, 0, 'bg')
    this.bg.frame = 2

    setTimeout(() => {
      this.state.start('Title')
    }, 4400)
  }

  update () {
  }
}
