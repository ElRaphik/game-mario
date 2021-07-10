import {init} from './init.js'
import {maps} from './maps.js'

init()

const PLAYER_CONSTANTS = {
    // small
    move_speed_small: 120,
    jump_force_small: 360,
    // big
    move_speed_big: 120,
    jump_force_big: 550,
}
const Orientation = {
    BOTTOM: 0,
    RIGHT: 1,
    TOP: 2,
    LEFT: 3,
}
const DEATH_BARRIERS = [400]


scene('game', ({level, score}) => {

    const World = ~~(level/4) + 1
    const CurrentLevel = (level%4) + 1

    layers(
        ['bg', 'obj', 'ui'], // all the different layers
        'obj' // main layer
    )
    camIgnore(['bg', 'ui'])

    // config the level
    const levelConfig = chooseConfig(level)
    // create the current level
    const gameLevel = addLevel(maps[level], levelConfig)



    // some ui
    add([
        text(`level ${World} - ${CurrentLevel}`, 16),
        pos(30, 10),
        layer('ui')])
    const scoreLabel = add([
        text(`score ${score}`, 16),
        pos(250, 10),
        layer('ui'),
    ])

    // go big or small
    function big() {
        let timer = 0
        let isBig = false
        return {
            update() {
                if(isBig) {
                    timer -= dt()
                    if(timer <= 0) {
                        this.smallify()
                    }
                }
            },
            isBig() {
                return isBig
            },
            smallify() {
                this.scale = vec2(1)
                timer = 0
                isBig = false
                this.jump_force = PLAYER_CONSTANTS.jump_force_small
                this.move_speed = PLAYER_CONSTANTS.move_speed_small
            },
            biggify(time) {
                this.scale = vec2(2)
                timer = time
                isBig = true
                this.jump_force = PLAYER_CONSTANTS.jump_force_big
                this.move_speed = PLAYER_CONSTANTS.move_speed_big
            }
        }
    }

    // init player
    let player = add([
        sprite('mario'), solid(),
        pos(30, 0),
        body(),
        big(),
        origin('bot'),
        {
            jump_force: [PLAYER_CONSTANTS.jump_force_small],
            move_speed: [PLAYER_CONSTANTS.move_speed_small],
            was_jumping: true,
            is_jumping: true,
        }
    ])


    // player actions
    player.action(() => {
        player.was_jumping = player.is_jumping
        player.is_jumping = !player.grounded();
        camPos(player.pos)
        if(player.pos.y >= DEATH_BARRIERS[Orientation.BOTTOM]) gameOver({score: score, level: level})
    })

    // bumping w/ the head
    player.on('headbump', (obj) => {
        // regular block
        if(obj.is('block') && player.isBig()) {
            destroy(obj)
        }

        // surprises
        if(obj.is('coin-surprise')) {
            gameLevel.spawn('$', obj.gridPos.sub(0,1))
            destroy(obj)
            gameLevel.spawn('}', obj.gridPos.sub(0,0))
        }
        if(obj.is('mushroom-surprise')) {
            gameLevel.spawn('#', obj.gridPos.sub(0,1))
            destroy(obj)
            gameLevel.spawn('}', obj.gridPos.sub(0,0))
        }
    })

    // collisions
    player.collides('mushroom', (m) => {
        destroy(m)
        player.biggify(6)
    })
    player.collides('coin', (c) => {
        destroy(c)
        score++
        scoreLabel.text = 'score ' + score.toString()
    })
    player.collides('goomba', (d) => {player.was_jumping ? destroy(d) : gameOver({score: score, level: level})})
    player.collides('pipe', () => {
        keyPress('down', () => {
            if(level < 31) { // max level should be 31 at the end
                go("game", {
                    score: score,
                    level: level+1
                })
            } else endGame({score: score})
        })
    })


    // movements
    keyDown('left', () => {
        player.move(-player.move_speed, 0)
    })
    keyDown('right', () => {
        player.move(player.move_speed, 0)
    })
    keyPress('space', () => {
        if(player.grounded()) {
            player.is_jumping = true
            player.jump(player.jump_force)
        }
    })


    // objects behaviour
    action('mushroom', (m) => {
        m.move(50, 0)
    })

    // ennemies behaviour
    action('goomba', (d) => {
        d.move(-20, 0)
    })

    function endGame({score}) {
        go('end', {score: score})
    }
    function gameOver({score, level}){
        go('lose', {score : score, level: level})
    }
})

scene('lose', ({score, level}) => {
    const World = ~~(level/4) + 1, CurrentLevel = (level%4) + 1
    add([text(`I bet you can make through it! Try again!\n\nYou failed at level ${World}-${CurrentLevel}\n\nscore ${score}`, 18), origin('center'), pos(width()/2, height()/2)])
})

scene('end', ({score}) => {
    add([text(`Congrats, you finished the game !\nYour score is ${score}`, 24), origin('center'), pos(width()/2, height()/2)])
})


// run the thing
start("game", {level: 0, score: 0})

function chooseConfig(level) {
    return {
        width: 20,
        height: 20,


        // define items sprite-sign relations
        '$': [sprite('coin'), 'coin'],
        '#': [sprite('mushroom'), solid(), 'mushroom', body()],


        // define blocks ....
        '=': [sprite('block'), solid(), 'block'],
        '}': [sprite('unboxed'), solid()],
        // surprises
        '*': [sprite('surprise'), solid(), 'mushroom-surprise'],
        '%': [sprite('surprise'), solid(), 'coin-surprise'],
        // pipes
        '(': [sprite('pipe-bottom-left'), solid(), scale(0.5)],
        ')': [sprite('pipe-bottom-right'), solid(), scale(0.5)],
        '-': [sprite('pipe-top-left'), solid(), scale(0.5), 'pipe'],
        '+': [sprite('pipe-top-right'), solid(), scale(0.5), 'pipe'],


        // define ennemies ....
        '^': [sprite('goomba'), solid(), 'goomba', body()],
    }
}