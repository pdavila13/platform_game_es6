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
  }

  create () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.player = this.game.add.sprite(250, 50, 'player')

    this.game.add.sprite(760/2-160, 400/2, 'ground')
    this.game.add.sprite(760/2-160, 400/2-80, 'wall')
    this.game.add.sprite(760/2+140, 400/2-80, 'wall')

    game.physics.arcade.enable(this.player)
    game.physics.arcade.enable(this.ground)

    this.player.body.gravity.y = 600
    this.player.body.setSize(20, 20, 0, 0);

    this.ground.body.immovable = true

    this.player.animations.add('idle', [3, 4, 5, 4], 5, true)
    this.player.animations.play('idle')

    this.cursor = game.input.keyboard.createCursorKeys()
  }

  update () {
    this.game.physics.arcade.collide(this.player, this.ground)

    this.inputs()
  }

  inputs () {
    if (this.cursor.left.isDown) {
      this.player.body.velocity.x = -100
      this.player.frame = 2;
    } else {
      this.plauer.velocity.x = 0
    }
  }

  render () {
    if (__DEV__) {
      //this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
