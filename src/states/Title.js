import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {
    document.body.style.backgroundColor = '#000'
  }

  preload () {
    this.load.image('logo', 'a/i/logo.png')
    this.load.spritesheet('text', 'a/i/text.png', 100, 10)
    this.tune = this.game.add.audio('titleMusic')
    Phaser.Canvas.setSmoothingEnabled(this.game.context, false)
    this.game.input.gamepad.start()
  }

  create () {
    const world = this.game.world
    this.startTime = new Date().getTime()
    this.tune.play()
    this.tick = 0
    this.game.input.gamepad.start()
    this.pad = this.game.input.gamepad.pad1
    this.pa2 = this.game.input.gamepad.pad2
    this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    this.logo = this.game.add.sprite(world.centerX, world.centerY - 50, 'logo')
    this.logo.anchor.setTo(0.5, 0.5)

    this.text = this.game.add.sprite(this.game.world.centerX, 180, 'text')
    this.text.anchor.setTo(0.5, 0.5)
    this.text.frame = 0

    this.p1 = this.game.add.sprite(this.game.world.centerX, 120, 'text')
    this.p1.anchor.setTo(0.5, 0.5)
    this.p1.frame = 2
    this.p2 = this.game.add.sprite(this.game.world.centerX, 130, 'text')
    this.p2.anchor.setTo(0.5, 0.5)
    this.p2.frame = 3
    this.credits = this.game.add.sprite(this.game.world.centerX, 140, 'text')
    this.credits.anchor.setTo(0.5, 0.5)
    this.credits.frame = 4
    this.help = this.game.add.sprite(this.game.world.centerX, 150, 'text')
    this.help.anchor.setTo(0.5, 0.5)
    this.help.frame = 5

    this.keys = {
      k1: this.game.input.keyboard.addKey(Phaser.Keyboard.ONE),
      k2: this.game.input.keyboard.addKey(Phaser.Keyboard.TWO),
      c: this.game.input.keyboard.addKey(Phaser.Keyboard.C),
      h: this.game.input.keyboard.addKey(Phaser.Keyboard.H)
    }
  }

  update () {
    this.tick += 1
    if (this.tick > 1000) {
      this.tick = 0
    }
    this.text.alpha = (Math.floor(this.tick / 40) % 2) ? 0 : 1

    if (this.keys.c.isDown) {
      this.tune.stop()
      this.state.start('Credits')
    }
    if (this.keys.k1.isDown) {
      this.startGame(1)
    }
    if (this.keys.k2.isDown) {
      this.startGame(2)
    }
    if (this.keys.h.isDown) {
      this.tune.stop()
      this.state.start('Help')
    }

    if (this.spaceKey.isDown || this.pad.justPressed(Phaser.Gamepad.XBOX360_A)) {
      this.startGame()
    }
  }

  startGame (players = 1) {
    if (new Date().getTime() - this.startTime < 1000) {
      return
    }
    sessionStorage.setItem('players', players)
    this.tune.stop()
    this.state.start('Play')
  }
}
