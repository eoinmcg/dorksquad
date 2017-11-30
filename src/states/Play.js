/* global Phaser */
import BaseGame from './BaseGame'
import Baddie from '../sprites/Baddie'
import Kitten from '../sprites/Kitten'
import Powerup from '../sprites/Powerup'

import {padZeros, outOfArena} from '../helpers'

export default class extends BaseGame {
  init () {
    this.nextSpawn = 100
    this.wave = 1
  }

  create () {
    super.create()

    this.tick = 0
    this.bg = this.game.add.sprite(0, 0, 'bg')
    this.bg.frame = 0
    this.bgOverlay = this.game.add.sprite(0, 0, 'bg')
    this.bgOverlay.frame = 1

    this.baddies = super.addBaddies()
    this.bullets = super.addBullets()
    this.dudes = super.addDudes()
    this.powerups = super.addPowerups()
    this.kittens = super.addKittens()
    this.flash = super.addFlash()
    this.booms = super.addBooms()
    this.emitter = super.addEmitter()

    this.dude = this.addDude(0)
    this.p1Score = this.game.add.bitmapText(2, 2, 'cpc464', '00000', 8)

    if (sessionStorage.getItem('players') === '2') {
      this.unicorn = this.addDude(1)
      this.p2Score = this.game.add.bitmapText(110, 2, 'cpc464', '00000', 8)
    }
    sessionStorage.removeItem('players')
    this.kittens.add(new Kitten({ game: this.game, p: this }))
    this.keys = {
      esc: this.game.input.keyboard.addKey(Phaser.Keyboard.ESC)
    }
    this.gameOver = false
  }

  update () {

    this.tick += 1
    if (this.tick > 1000) {
      this.tick = 0
    }
    this.bgOverlay.alpha = (Math.floor(this.tick / 20) % 2) ? 0 : 1


    if (this.keys.esc.isDown) {
      this.game.paused = !this.game.paused
      this.game.physics.arcade.isPaused = !this.game.physics.arcade.isPaused
    }

    this.bullets.forEachAlive((b) => {
      if (outOfArena(b.x, b.y)) {
        this.particleBurst(b.x, b.y)
        b.kill()
      }
    })

    this.nextSpawn -= 1
    if (this.nextSpawn < 0) {
      this.spawnBaddie()
    }
    const collision = this.game.physics.arcade
    collision.overlap(this.baddies, this.dudes, this.baddieHitDude, null, this)
    collision.overlap(this.dudes, this.powerups, this.dudeHitPowerup, null, this)
    collision.overlap(this.dudes, this.kittens, this.dudeHitKitten, null, this)
    collision.overlap(this.bullets, this.baddies, this.bulletHitBaddie, null, this)
    collision.overlap(this.bullets, this.kittens, this.bulletHitKitten, null, this)

    this.p1Score.text = padZeros(this.dude.score)
    if (this.p2Score) { this.p2Score.text = padZeros(this.unicorn.score) }
  }

  render () {
    super.render()
  }

  getDudes () {
    let dudes = []
    this.dudes.forEach((dude) => {
      if (dude.key === 'dude' && dude.visible) {
        dudes.push(dude)
      }
    })
    return dudes
  }

  baddieHitDude (baddie, dude) {
    this.makeBoom(dude.x, dude.y, 7)
    dude.kill()
    this.sfx.die.play()
    baddie.killDude()
    this.particleBurst(baddie.x, baddie.y, 10)
    this.sfx.combo.play()
    const dudesLeft = this.getDudes()
    if (dudesLeft.length === 0 && !this.gameOver) {
      this.text = this.game.add.sprite(this.game.world.centerX, -50, 'text')
      this.text.anchor.setTo(0.5, 0.5)
      this.text.frame = 1

      this.game.add.tween(this.text)
        .to({y: this.game.world.height / 2}, 1000, Phaser.Easing.None)
        .start()
    }
  }

  dudeHitPowerup (dude, powerup) {
    powerup.receiveDamage(dude)
  }

  dudeHitKitten (dude, kitten) {
    kitten.kill()
    dude.score += 50
    this.sfx.collect.play()
  }

  bulletHitBaddie (bullet, baddie) {
    baddie.receiveDamage(bullet)
    this.sfx.hit1.play()
    // const dudesLeft = this.getDudes()
    bullet.kill()
    this.particleBurst(bullet.x, bullet.y)
  }

  bulletHitKitten (bullet, kitten) {
    bullet.kill()
    this.particleBurst(bullet.x, bullet.y)
    kitten.kill()
  }

  spawnBullet (x, y, vx, vy, owner) {
    let bullet = this.bullets.getFirstExists(false)
    bullet.name = 'bullet'
    bullet.owner = owner
    bullet.reset(x, y)

    let flash = this.flash.getFirstExists(false) ||
      this.flash.getFirstAlive()

    if (flash) {
      flash.revive()
      flash.alpha = 1
      flash.reset(x, y)
      flash.animations.play('flash')
      this.game.world.bringToTop(this.flash)
    }

    this.game.physics.enable(bullet, Phaser.Physics.ARCADE)
    bullet.body.velocity.x = vx * 200
    bullet.body.velocity.y = vy * 200
  }

  spawnBaddie (time = 100) {
    this.nextSpawn = Math.floor(Math.random() * time)
    const dudes = this.getDudes()
    if (dudes.length === 0) {
      return
    }

    this.baddies.add(new Baddie({
      game: this.game,
      p: this,
      type: false
    }))
  }

  spawnPowerup (x, y) {
    if (outOfArena(x, y)) return
    this.powerups.add(new Powerup({
      game: this.game,
      p: this,
      x: x,
      y: y
    }))
  }

  claimKill (owner) {
    if (owner === 'dude') {
      this.dude.score += 5
    } else if (owner === 'unicorn') {
      this.unicorn.score += 5
    }
  }

  killEmAll (x, y) {
    this.makeBoom(x, y, 5)
    this.baddies.forEachAlive((baddie) => {
      baddie.explode()
    })
  }

  particleBurst (x, y, particles) {
    this.emitter.x = x
    this.emitter.y = y
    particles = particles || 2
    this.emitter.start(true, 500, null, particles)
  }

  makeBoom (x, y, scale = 2) {
    let boom = this.booms.getFirstExists(false) ||
      this.booms.getFirstAlive()
    let g = this.game

    boom.revive()
    boom.scale.x = boom.scale.y = scale
    boom.reset(x, y)
    boom.animations.play('boom')

    g.world.bringToTop(this.booms)
    // this.shakeWorld = 20
  }
}
