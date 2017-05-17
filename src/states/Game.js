/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'

export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#3498db'
  }
  preload () {
    this.game.load.spritesheet('player','./assets/player.png',28,22)
    this.game.load.image('ground','./assets/ground.png')
    this.game.load.image('wall','./assets/wall.png')

    this.game.load.image('enemy','./assets/enemy.png')
    this.game.load.image('coin', 'assets/coin.png');

    this.game.load.image('dust', 'assets/dust.png');
    this.game.load.image('exp', 'assets/exp.png');


    this.game.load.audio('jump',['./assets/jump.wav','./assets/jump.mp3'])
    this.game.load.audio('dust', ['assets/dust.wav', 'assets/dust.mp3']);
    this.game.load.audio('dead', ['assets/dead.wav', 'assets/dead.mp3']);
    this.game.load.audio('coin', ['assets/coin.wav', 'assets/coin.mp3']);

  }

  setParticles() {
    this.dust = game.add.emitter(0, 0, 20);
    this.dust.makeParticles('dust');
    this.dust.setYSpeed(-100, 100);
    this.dust.setXSpeed(-100, 100);
    // this.dust.gravity = 0;

    this.explosion = game.add.emitter(0, 0, 20);
    this.explosion.makeParticles('exp');
    this.explosion.setYSpeed(-150, 150);
    this.explosion.setXSpeed(-150, 150);
    // this.explosion.gravity = 0;
  }

  spawnPlayer() {
    if(this.playerIsDead) {
      // this.player.x= 380
      // this.player.y= 101
      this.player.reset(380, 101);
      this.playerIsDead=false;
    } else {
      this.player = this.game.add.sprite(380,101,'player')
    }
  }

  configurePlayer() {
    this.player.body.gravity.y= 600
    this.player.body.setSize(20,20,0,0);

    this.player.animations.add('idle',[3,4,5,4],5,true)

    this.player.animations.play('idle')
  }

  create () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.game.physics.setBoundsToWorld()
    this.addSounds()

    //Initial states
    this.playerIsDead=false;
    this.hasJumped = false

    //PLAYER
    this.spawnPlayer()
    game.physics.arcade.enable(this.player)
    this.configurePlayer()
    this.player.checkWorldBounds = true;
    this.player.events.onOutOfBounds.add(this.dead,this)

    //LEVEL
    this.loadLevel()

    //Collectibles
    this.putCoinsOnLevel()

    //ENEMIES
    this.enemy = this.game.add.sprite(500, 400/2-20, 'enemy')
    game.physics.arcade.enable(this.enemy)

    //CONFIGURE INPUTS
    this.cursor = game.input.keyboard.createCursorKeys()
    game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.RIGHT, Phaser.Keyboard.LEFT]);

    this.setParticles()
  }

  addSounds() {
    this.jumpSound = this.game.add.audio('jump')
    this.dustSound = game.add.audio('dust')
    this.coinSound = game.add.audio('coin')
    this.deadSound = game.add.audio('dead')
  }

  update () {
    this.game.physics.arcade.collide(this.player, this.level)

    this.game.physics.arcade.overlap(this.player, this.enemy, this.dead, null, this)
    this.game.physics.arcade.overlap(this.player, this.coins, this.takeCoin, null, this)

    this.inputs()
    if (this.player.body) {
      if (this.player.body.touching.down) {
        if (this.hasJumped) {
          this.dustSound.play();
          this.dust.x = this.player.x;
          this.dust.y = this.player.y+10;
          this.dust.start(true, 300, null, 8);
        }
        this.hasJumped = false
      }

      if (this.player.y < 100 ) {
        this.player.body.velocity.y = 0
      }
    }

    this.explosion.forEachAlive(function(p){
      p.alpha = game.math.clamp(p.lifespan / 100, 0, 1);
    }, this);
  }

  putCoinsOnLevel() {

    this.coins = game.add.group()
    game.add.sprite(280,400/2-20,'coin',0,this.coins)
    game.add.sprite(325,400/2-20,'coin',0,this.coins)
    game.add.sprite(350,400/2-20,'coin',0,this.coins)

    this.coins.enableBody = true
    game.physics.arcade.enable(this.coins)
  }

  takeCoin(player,coin) {
    //Reproduir coin
    coin.body.enable = false
    game.add.tween(coin).to({width:0},100).start()
    this.coinSound.play()
  }

  loadLevel () {
    this.level = this.game.add.group();
    this.level.enableBody = true;

    this.ground = game.add.sprite(760/2-160,400/2,'ground',0, this.level);
    this.wall1 = game.add.sprite(760/2-160,500/2-80,'wall',0, this.level);
    this.wall2 = game.add.sprite(760/2+140,400/2-80,'wall',0, this.level);

    this.level.setAll('body.immovable', true)

  }

  inputs () {

    if (this.player.body) {
      if (this.cursor.left.isDown) {
        this.player.body.velocity.x = -200
        this.player.frame = 2
      } else if (this.cursor.right.isDown)
      {
        this.player.body.velocity.x = +200
        this.player.frame = 1
      } else {
        this.player.body.velocity.x = 0
      }
    }

    if (this.cursor.up.isDown) {
      this.jumpPlayer();
    }
  }

  dead() {
    this.playerIsDead = true
    this.deadSound.play()
    game.camera.shake(0.05, 200)

    if (this.playerIsDead) {
      this.explosion.x = this.player.x
      this.explosion.y = this.player.y+10
      this.explosion.start(true,300,null,20)
    }
    //tornar a colocar usuari en posició inicial
    this.spawnPlayer()

  }

  jumpPlayer () {

    if (!this.hasJumped) {
      this.player.body.velocity.y = -220
      this.jumpSound.play()
      this.hasJumped = true
    }

  }

  render () {
    if (__DEV__) {
      //this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
