/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'

export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#3498db'
  }
  preload () {
    this.game.load.spritesheet('player', './assets/images/player.png', 28, 22)
    this.game.load.image('ground', './assets/images/ground.png')
    this.game.load.image('wall', './assets/images/wall.png')

    this.game.load.image('enemy', './assets/images/enemy.png')
    this.game.load.image('coin', './assets/images/coin.png')

    this.game.load.image('dust', './assets/images/dust.png')
    this.game.load.image('exp', './assets/images/exp.png')

    this.game.load.audio('jump', ['./assets/audio/jump.wav', './assets/audio/jump.mp3'])
    this.game.load.audio('dust', ['./assets/audio/dust.wav', './assets/audio/dust.mp3'])
    this.game.load.audio('coin', ['./assets/audio/coin.wav', './assets/audio/coin.mp3'])
  }

  create () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE)

    this.player = this.game.add.sprite(360, 100, 'player')
    this.enemy = this.game.add.sprite(490, 400/2-20, 'enemy')

    this.addSounds()

    game.physics.arcade.enable(this.player)
    game.physics.arcade.enable(this.enemy)

    this.loadLevel()
    this.setParticles()
    this.putCoinsOnLevel()

    this.player.body.gravity.y = 600
    this.player.body.setSize(20, 20, 0, 0)

    this.player.animations.add('idle', [3, 4, 5, 4], 5, true)
    this.player.animations.play('idle')

    this.cursor = game.input.keyboard.createCursorKeys()
    this.hasJumped = false
  }

  update () {
    this.game.physics.arcade.collide(this.player, this.level)
    this.game.physics.arcade.overlap(this.player, this.enemy)
    this.game.physics.arcade.overlap(this.player, this.coins, this.takeCoin, null, this)

    this.inputs()

    if (this.player.body.touching.down && this.player.y > 100) {
      if (this.hasJumped) {
        this.dustSound.play()
        this.dust.x = this.player.x
        this.dust.y = this.player.y+10
        this.dust.start(true, 300, null, 8)
      }
      this.hasJumped = false
    }
  }

  putCoinsOnLevel () {
    this.coins = game.add.group()
    this.coins.enableBody = true

    game.add.sprite(260,400/2-20, 'coin', 0, this.coins)
    game.add.sprite(290,400/2-20, 'coin', 0, this.coins)
    game.add.sprite(320,400/2-20, 'coin', 0, this.coins)

    game.physics.arcade.enable(this.coins)
  }

  takeCoin (player, coin) {
    coin.body.enable = false
    game.add.tween(coin).to({width:0}, 100).start()
    this.coinSound.play()
  }

  loadLevel () {
    this.level = this.game.add.group()
    this.level.enableBody = true

    this.ground = game.add.sprite(760/2-160, 400/2, 'ground', 0, this.level)
    this.wall1 = game.add.sprite(760/2-160, 400/2-80, 'wall', 0, this.level)
    this.wall2 = game.add.sprite(760/2+140, 400/2-80, 'wall', 0, this.level)

    this.level.setAll('body.immovable', true)
    game.physics.arcade.enable(this.level)
  }

  inputs () {
    if (this.cursor.left.isDown || this.moveLeft) {
      this.player.body.velocity.x = -200
      this.player.frame = 2
    }
    else if (this.cursor.right.isDown || this.moveRight) {
      this.player.body.velocity.x = 200
      this.player.frame = 1
    }
    else {
      this.player.body.velocity.x = 0
    }

    if (this.cursor.up.isDown) {
      this.jumpPlayer()
    }
  }

  jumpPlayer () {
    this.player.body.velocity.y = -220

    if (!this.hasJumped) {
      this.jumpSound.play()
      this.hasJumped = true
    }
  }

  addSounds () {
    this.jumpSound = this.game.add.audio('jump', 0.1)
    this.dustSound = this.game.add.audio('dust', 0.1)
    this.expSound = this.game.add.audio('exp', 0.1)
    this.coinSound = this.game.add.audio('coin', 0.1)
  }

  setParticles () {
    this.dust = this.game.add.emitter(0, 0, 20)
    this.dust.makeParticles('dust')
    this.dust.setYSpeed(-100, 100)
    this.dust.setXSpeed(-100, 100)
    this.dust.gravity = 0

    this.exp = this.game.add.emitter(0, 0, 20)
    this.exp.makeParticles('exp')
    this.exp.setYSpeed(-150, 150)
    this.exp.setXSpeed(-150, 150)
    this.exp.gravity = 0
  }

  render () {
    if (__DEV__) {
      //this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
