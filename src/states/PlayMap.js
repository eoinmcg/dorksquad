import Phaser from 'phaser'
import Dude from '../sprites/Dude'
import Baddie from '../sprites/Baddie'

export default class extends Phaser.State {
  init () {
    this.nextSpawn = 100
    this.wave = 1
  }

  preload () {
    Phaser.Canvas.setSmoothingEnabled(this.game.context, false)
    this.load.spritesheet('bg', 'a/i/bg.png', 160, 200)
    this.load.spritesheet('dude', 'a/i/dude.png', 6, 8)
    this.load.spritesheet('baddie', 'a/i/baddie.png', 6, 8)
    this.load.spritesheet('boom', 'a/i/boom.png', 12, 12)
    this.load.spritesheet('text', 'a/i/text.png', 84, 10)
    this.load.image('particle', 'a/i/particle.png')
    this.load.image('bullet', 'a/i/bullet.png')
    this.load.image('flash', 'a/i/flash.png')
    this.load.image('boomerang', 'a/i/boomerang.png')
    this.load.image('spritesheet', 'a/i/bg.png', 160, 200)

    this.sfx = {
      thud: this.game.add.audio('thud'),
      combo: this.game.add.audio('combo'),
      collect: this.game.add.audio('collect'),
      die: this.game.add.audio('die'),
      hit1: this.game.add.audio('hit1'),
      hit2: this.game.add.audio('hit2'),
      hit3: this.game.add.audio('hit3')
    }
  }

  create () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.stage.backgroundColor = 'transparent'
    // this.bg = this.game.add.sprite(0, 0, 'bg')
    // this.bg.frame = 0
    this.gameOver = false

    this.map = this.game.add.tilemap('level1')
    this.map.addTilesetImage('tiles', 'tiles')
    this.map.setCollisionBetween(5, 7)
    this.backgroundLayer = this.map.createLayer('backgroundLayer')
    this.backgroundLayer.resizeWorld()

    this.baddies = this.game.add.group()
    this.baddies.enableBody = true
    this.baddies.physicsBodyType = Phaser.Physics.ARCADE

    this.dudes = this.game.add.group()
    this.dudes.enableBody = true
    this.dudes.physicsBodyType = Phaser.Physics.ARCADE

    this.bullets = this.game.add.group()
    // this.bullets.enableBody = true
    // this.bullets.physicsBodyType = Phaser.Physics.ARCADE
    this.bullets.createMultiple(30, 'bullet')
    this.bullets.setAll('anchor.x', 0.5)
    this.bullets.setAll('anchor.y', 1)
    this.bullets.setAll('outOfBoundsKill', true)
    this.bullets.setAll('checkWorldBounds', true)

    this.flash = this.game.add.group()
    this.flash.enableBody = false
    this.flash.createMultiple(10, 'flash')
    this.flash.setAll('anchor.x', 0.5)
    this.flash.setAll('anchor.y', 0.5)

    this.booms = this.game.add.group()
    this.booms.createMultiple(10, 'boom')
    this.booms.setAll('anchor.x', 0.5)
    this.booms.setAll('anchor.y', 0.5)
    this.booms.setAll('scale.x', 1)
    this.booms.setAll('scale.y', 1)
    this.booms.setAll('alpha', 1)
    this.booms.callAll('animations.add', 'animations', 'boom', [0, 1, 2, 3, 4, 5, 6, 7], 250, false)

    this.emitter = this.game.add.emitter(0, 0, 200)
    this.emitter.makeParticles('particle')
    this.emitter.minParticleScale = 1
    this.emitter.maxParticleScale = 3
    this.emitter.minRotation = -0
    this.emitter.maxRotation = 0
    this.emitter.forEach((particle) => {
      particle.body.allowGravity = false
    })

    this.dude0 = new Dude({
      p: this,
      name: 'dude',
      x: this.world.centerX + 20,
      y: this.map.heightInPixels - 20,
      asset: 'dude',
      scale: 1
    })
    this.game.add.existing(this.dude0)

    this.dudes.add(this.dude0)
    this.dude1 = new Dude({
      p: this,
      name: 'unicorn',
      x: this.world.centerX - 20,
      y: this.map.heightInPixels - 20,
      asset: 'dude',
      scale: 1
    })
    this.game.add.existing(this.dude1)
    this.dudes.add(this.dude1)

    this.game.camera.follow(this.dude0)
  }

  update () {
    this.nextSpawn -= 1
    if (this.nextSpawn < 0) {
      this.spawnBaddie()
    }
    console.log(this.nextSpawn)

    this.game.physics.arcade.collide(this.dudes, this.backgroundLayer,
      (dude, tile) => { if (tile.index === 7) dude.kill() })
    this.game.physics.arcade.collide(this.bullets, this.backgroundLayer,
      (bullet, tile) => { if (tile.index < 7) bullet.kill() })

    this.game.physics.arcade.overlap(this.baddies, this.dudes, this.zombieHitDude, null, this)
    this.game.physics.arcade.overlap(this.bullets, this.baddies, this.bulletHitBaddie, null, this)
  }

  render () {
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

  zombieHitDude (baddie, dude) {
    dude.kill()
    this.sfx.die.play()
    baddie.eatDude()
    this.particleBurst(baddie.x, baddie.y)
    this.sfx.combo.play()
    const dudesLeft = this.getDudes()
    if (dudesLeft.length === 0 && !this.gameOver) {
      this.text = this.game.add.sprite(this.game.world.centerX, -50, 'text')
      this.text.anchor.setTo(0.5, 0.5)
      this.text.frame = 1

      this.game.add.tween(this.text)
        .to({y: this.game.world.height / 2}, 2500, Phaser.Easing.Elastic.Out)
        .start()
    }
  }

  bulletHitBaddie (bullet, baddie) {
    baddie.receiveDamage(bullet)
    this.sfx.hit1.play()
    // const dudesLeft = this.getDudes()
    bullet.kill()
    this.particleBurst(bullet.x, bullet.y)
  }

  spawnBullet (x, y, vx, vy) {
    let bullet = this.bullets.getFirstExists(false)
    bullet.name = 'bullet'
    bullet.reset(x, y)

    let flash = this.flash.getFirstExists(false) ||
      this.flash.getFirstAlive()

    if (flash) {
      flash.revive()
      flash.alpha = 1
      flash.reset(x, y)
      this.game.add.tween(flash)
        .to({ alpha: 0 }, 50, Phaser.Easing.Linear.None, true, 1)
      this.game.world.bringToTop(this.flash)
    }

    this.game.physics.enable(bullet, Phaser.Physics.ARCADE)
    bullet.body.velocity.x = vx * 200
    bullet.body.velocity.y = vy * 200
  }

  spawnBaddie (time = 500) {
    console.log('SPAWN')
    this.nextSpawn = Math.floor(Math.random() * time)
    const dudes = this.getDudes()
    if (dudes.length === 0) {
      return
    }

    this.baddies.add(new Baddie({
      game: this.game,
      asset: 'zombie',
      scale: 1,
      p: this
    }))
  }

  particleBurst (x, y, particles) {
    this.emitter.x = x
    this.emitter.y = y
    particles = particles || 5
    this.emitter.start(true, 3000, null, particles)
  }

  makeBoom (x, y, scale = 3) {
    let boom = this.booms.getFirstExists(false) ||
      this.booms.getFirstAlive()
    let g = this.game
    let tweenA = null
    let tweenB = null

    boom.revive()
    boom.alpha = 1
    boom.scale.x = 1
    boom.scale.y = 1
    boom.reset(x, y)
    boom.animations.play('boom')

    tweenA = g.add.tween(boom.scale)
      .to({x: scale, y: scale}, 200, Phaser.Easing.Linear.None, true, 1)

    tweenB = g.add.tween(boom.position)
      .to({y: boom.position.y - 3}, 200, Phaser.Easing.Linear.None, true, 1)
    tweenA.chain(tweenB)
    tweenA.start()
    tweenB.onComplete.add((boom, tween) => {
      boom.alpha = 0
      boom.x = -50
      console.log(boom, tween)
    })
    g.world.bringToTop(this.booms)
    // this.shakeWorld = 20;
  }
}
