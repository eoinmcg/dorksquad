import Phaser from 'phaser'
import Dude from '../sprites/Dude'

export default class extends Phaser.State {
  preload () {
    Phaser.Canvas.setSmoothingEnabled(this.game.context, false)
    this.load.spritesheet('bg', 'a/i/bg.png', 160, 200)
    this.load.spritesheet('dude', 'a/i/dude.png', 6, 8)
    this.load.spritesheet('baddies', 'a/i/baddies.png', 6, 8)
    this.load.spritesheet('boom', 'a/i/boom.png', 12, 12)
    this.load.spritesheet('text', 'a/i/text.png', 100, 10)
    this.load.spritesheet('powerups', 'a/i/powerups.png', 6, 6)
    this.load.spritesheet('kitten', 'a/i/kitten.png', 7, 6)
    this.load.spritesheet('flash', 'a/i/flash.png', 4, 4)
    this.load.image('particle', 'a/i/particle.png')
    this.load.image('bullet', 'a/i/bullet.png')
    this.load.image('boomerang', 'a/i/boomerang.png')
    this.load.image('spritesheet', 'a/i/bg.png', 160, 200)
    this.load.bitmapFont('cpc464', 'a/fonts/cpc464.png', 'a/fonts/cpc464.xml')
    this.sfx = {
      thud: this.game.add.audio('thud'),
      combo: this.game.add.audio('combo'),
      collect: this.game.add.audio('collect'),
      die: this.game.add.audio('die'),
      hit1: this.game.add.audio('hit1'),
      hit2: this.game.add.audio('hit2'),
      hit3: this.game.add.audio('hit3'),
      boom: this.game.add.audio('boom')
    }
  }

  create () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.stage.backgroundColor = 'transparent'
    this.bg = this.game.add.sprite(0, 0, 'bg')
    this.bg.frame = 0
    this.gameOver = false
  }

  addDudes () {
    const dudes = this.game.add.group()
    dudes.enableBody = true
    dudes.physicsBodyType = Phaser.Physics.ARCADE
    return dudes
  }

  addDude (num = 0) {
    const dudeData = [
      {name: 'dude', x: this.world.centerX + 20, y: this.world.centerY - 20},
      {name: 'unicorn', x: this.world.centerX - 20, y: this.world.centerY - 20}
    ]
    const dude = new Dude({
      p: this,
      name: dudeData[num].name,
      x: dudeData[num].x,
      y: dudeData[num].y,
      scale: 1
    })
    this.game.add.existing(dude)
    this.dudes.add(dude)
    return dude
  }

  addBaddies () {
    const baddies = this.game.add.group()
    baddies.enableBody = true
    baddies.physicsBodyType = Phaser.Physics.ARCADE
    return baddies
  }

  addPowerups () {
    const powerups = this.game.add.group()
    powerups.enableBody = true
    powerups.physicsBodyType = Phaser.Physics.ARCADE
    return powerups
  }

  addKittens () {
    const kittens = this.game.add.group()
    kittens.enableBody = true
    kittens.physicsBodyType = Phaser.Physics.ARCADE
    return kittens
  }

  addBullets () {
    const bullets = this.game.add.group()
    bullets.createMultiple(30, 'bullet')
    bullets.setAll('anchor.x', 0.5)
    bullets.setAll('anchor.y', 1)
    bullets.setAll('outOfBoundsKill', true)
    bullets.setAll('checkWorldBounds', true)
    return bullets
  }

  addFlash () {
    const flash = this.game.add.group()
    flash.enableBody = false
    flash.createMultiple(10, 'flash')
    flash.setAll('anchor.x', 0.5)
    flash.setAll('anchor.y', 0.5)
    flash.callAll('animations.add', 'animations', 'flash', [0, 1, 2, 1, 0], 35, false)
    return flash
  }

  addBooms () {
    const booms = this.game.add.group()
    booms.createMultiple(10, 'boom')
    booms.setAll('anchor.x', 0.5)
    booms.setAll('anchor.y', 0.5)
    booms.setAll('scale.x', 1)
    booms.setAll('scale.y', 1)
    booms.callAll('animations.add', 'animations', 'boom', [1, 0, 2, 3, 4, 5, 6, 7, 8], 18, false)
    return booms
  }

  addEmitter () {
    const emitter = this.game.add.emitter(0, 0, 200)
    emitter.makeParticles('particle')
    emitter.minParticleScale = 1
    emitter.maxParticleScale = 1
    emitter.minRotation = -0
    emitter.maxRotation = 0
    emitter.particleFriction = 0.1
    return emitter
  }
}
