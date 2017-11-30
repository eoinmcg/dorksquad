import Phaser from 'phaser'

import {controls} from '../helpers'

export default class extends Phaser.Sprite {
  constructor ({ p, name, x, y, scale }) {
    super(p.game, x, y, 'dude')
    this.scale.setTo(scale, scale)
    this.p = p
    this.game.physics.enable(this, Phaser.Physics.ARCADE)
    this.collideWorldBounds = true
    this.anchor.setTo(0.5, 0.5)
    this.speed = 1
    this.gun = 0
    this.boost = 0
    this.name = name
    this.score = 0

    const anims = {
      idle: [8, 8, 8, 8, 8, 9],
      idle_up: [5],
      idle_down: [2],
      left: [0, 1],
      right: [0, 1],
      up: [6, 7],
      down: [3, 4]
    }
    const animOffset = this.name === 'dude' ? 0 : 10
    for (let n in anims) {
      let i = anims[n].length
      while (i--) {
        anims[n][i] += animOffset
      }
    }

    this.animations.add('idle', anims.idle, 10, true)
    this.animations.add('idle_up', anims.idle_up, 10, true)
    this.animations.add('idle_down', anims.idle_down, 10, true)
    this.animations.add('left', anims.left, 10, true)
    this.animations.add('right', anims.right, 10, true)
    this.animations.add('up', anims.up, 10, true)
    this.animations.add('down', anims.down, 10, true)
    this.animations.play('idle')
    this.vx = 1
    this.vy = 0
    this.facing = { x: this.vx, y: this.vy }
    this.dir = 'left'
    this.bulletDelay = 2

    this.game.input.gamepad.start()
    if (this.name === 'dude') {
      this.pad = this.game.input.gamepad['pad1']
      this.keys = {
        shoot: this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT),
        up: this.game.input.keyboard.addKey(Phaser.Keyboard.UP),
        down: this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
        left: this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
        right: this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
      }
    } else {
      this.pad = this.game.input.gamepad['pad2']
      this.keys = {
        shoot: this.game.input.keyboard.addKey(Phaser.Keyboard.R),
        up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
        down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
        left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
        right: this.game.input.keyboard.addKey(Phaser.Keyboard.D)
      }
    }
  }

  update () {
    let pad = this.pad
    this.bulletDelay = this.bulletDelay > 0
      ? this.bulletDelay - 1 : 0

    let input = controls(this.keys, pad)

    if (!this.visible && input.fire) {
      this.p.state.start('Title')
    }

    this.vx = input.vx * (this.speed + this.boost)
    this.vy = input.vy * (this.speed + this.boost)

    if (this.vx !== 0 || this.vy !== 0) {
      this.facing.x = this.vx
      this.facing.y = this.vy
    }

    if (this.vx > 0 && this.scale.x < 0) {
      this.scale.x *= -1
    } else if (this.vx < 0 && this.scale.x > 0) {
      this.scale.x *= -1
    }

    if (this.visible && input.fire) {
      if (this.bulletDelay < 1) {
        this.bulletDelay = (this.gun === 0) ? 10 : 5
        this.p.spawnBullet(this.x, this.y, this.facing.x, this.facing.y, this.name)
        if (this.gun > 1) {
          this.p.spawnBullet(this.x, this.y, -this.facing.x, -this.facing.y, this.name)
        }
        this.p.sfx.thud.play()
      }
    }

    if (this.vx === 0 && this.vy === 0) {
      let animDir = (this.dir !== 'left' && this.dir !== 'right')
        ? '_' + this.dir : ''
      this.animations.play('idle' + animDir)
    } else if (this.animations.currentAnim.name !== input.dir) {
      this.animations.play(input.dir)
    }

    this.dir = input.dir === false ? this.dir : input.dir

    this.body.velocity.x = this.vx * 50
    this.body.velocity.y = this.vy * 50

    if (this.x < 4) this.x = 4
    if (this.x > 156) this.x = 156
    if (this.y < 16) this.y = 16
    if (this.y > 180) this.y = 180
  }

  consumePowerup (name) {
    if (name === 'donut') {
      this.score += 20
    } else if (name === 'boot') {
      this.boost = this.boost < 1 ? this.boost + 0.5 : this.boost
    } else if (name === 'bullet') {
      this.gun += 1
    } else if (name === 'coin') {
      this.score += 10
    } else if (name === 'bomb') {
      this.p.killEmAll(this.position.x, this.position.y)
    }
  }
}
