/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'

export default class extends Phaser.State {
  init () {}
  preload () {
    this.game.load.spritesheet('player', './assets/images/player.png')
  }

  create () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.player = this.game.add.sprite(250, 50, 'player')

    game.physics.arcade.enable(this.player)
    this.player.body.gravity.y = 600
  }

  render () {
    if (__DEV__) {
      //this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
