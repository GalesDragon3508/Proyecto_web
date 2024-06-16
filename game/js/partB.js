const LEVEL_ALIEN_PROBABILITY_PART_B = [ 0.3, 0.6, 0.9];
const MULT_ALIEN_VELOCITY_PART_B = [1, 1.5, 2.2];
const NUM_LEVELS_PART_B = 3;
const BUGS_FOR_LEVEL_PART_B = [5, 7, 12];// Bugs to kill to pass the current level

let currentKilledBugsPartB;
let bugsAppearedLevelPartB;
let portalsI;
let portalsS;
let TeleportAnims;

let partBState = {
    preload: loadPartBAssets,
    create: doPartB,
    update: updatePlayB
};

function loadPartBAssets() {
    game.load.image('player', 'assets/imgs/jugador.png');
    game.load.image('Hup', 'assets/imgs/Hup.png');
    game.load.image('bullet', 'assets/imgs/Bala.png');
    game.load.spritesheet('alien', 'assets/imgs/alienAnimacion.png', 50, 35, 2);
    game.load.image('lifebar', 'assets/imgs/vida.png');
}

function doPartB() {
    currentPart = 2;
    currentLevel = 1;
    currentKilledBugsPartB = 0;
    bugsAppearedLevelPartB = 0;
    distBStrng = GAME_WIDTH/nPages;
    nextPoint = (GAME_HEIGHT-50)/10; // aliens velocity
    game.add.image(0, 0, 'bg');
    for (let index = 1; index < nPages+1; index++) {

        let threads = game.add.sprite(index*distBStrng-distBStrng/2+1, 25, 'Laser');
        threads.anchor.setTo(0.5,0)
        threads.scale.setTo(0.2,7)
        threads.alpha = 0.7;
    }

    createKeyControls();
    createPortals();
    createPortalsSalida();
    createTeleportAnims();
    activPortals();
    createBalas(NBULLETS);
    createHUD();
    createAliensPartB(NALIENS);
    createLifeItems();
    player = game.add.sprite((distBStrng-distBStrng/2)+distBStrng*(pPos-1), GAME_HEIGHT-28, 'player');
    player.anchor.setTo(0.5,1);
    player.scale.setTo(0.69,0.69);
}

function updatePlayB() {
    game.physics.arcade.overlap(groupBullets, groupAliens, BalaHitAlien, null, this);
    game.physics.arcade.overlap(groupTurrets, groupAliens, AlienHitTurret, null, this);
    game.physics.arcade.overlap(groupBullets, groupHPItems, BalaHitHp, null, this);
    game.physics.arcade.overlap(groupTurrets, groupHPItems, HpHitTurret, null, this);
    game.physics.arcade.overlap(groupAliens, PortalsI, Teleport, null, this);

    managePMovements();
    timeElapsed += game.time.elapsed;
    canShoot+= game.time.elapsed;
    textTimeElapsed.setText('Tiempo: ' + Math.floor(timeElapsed / 1000));
}

function createPortalsSalida(){
    PortalsS = game.add.group();
    PortalsS.enableBody = true;
}

function createPortals(){
    PortalsI = game.add.group();
    PortalsI.enableBody = true;
}

function createTeleportAnims(){
    TeleportAnims = game.add.group();
}

function activPortals() {
    for (let index = 1; index < nPages+1; index++) {
        let x1=(Math.floor(Math.random() * (nPages-1+1) + 1))*distBStrng-distBStrng/2;
        let y1=(Math.floor(Math.random() * (3 - 1 + 1)+1)*GAME_HEIGHT/10);
        //      math.floor(math.random() * (        max         -      min       + 1)) + min

        PortalsI.create(x1, y1, 'portals', index-1, index).anchor.setTo(0.5,0.5);
        TeleportAnims.create(x1, y1, 'teleport').anchor.setTo(0.5, 0.5); // Animation sprite on every portal to appear when an enemy has been teleported

        let x2=(Math.floor(Math.random() * (nPages-1+1) + 1))*distBStrng-distBStrng/2;
        let y2=(Math.floor(Math.random() * (6 - 4 + 1)+4)*GAME_HEIGHT/10);

        PortalsS.create(x2, y2, 'portals', index-1, index).anchor.setTo(0.5,0.5);
    }

    PortalsI.callAll('scale.setTo', 'scale', 0.4, 0.4)
    PortalsS.callAll('scale.setTo', 'scale', 0.4, 0.4)
    TeleportAnims.callAll('scale.setTo', 'scale', 0.25, 0.25);
    TeleportAnims.callAll('animations.add', 'animations', 'telepAnim', [0, 1, 2, 3], 8);
    TeleportAnims.setAll('visible', false);
}

function createAliensPartB (numb) {
    createAliens(numb);
    game.time.events.loop(TIMER_RHYTHM, activateAlienB, this);

    // Array of boolean values to see if an enemy can use a specific teleport or not (this code is needed because the teleport it's a sprite and every frame is called to see if the enemy can be teleported)
    groupAliens.children.forEach((alien) => {
        alien.canTeleport = Array(nPages).fill(true);
    });
}

function activateAlienB() {
    if((bugsAppearedLevelPartB < BUGS_FOR_LEVEL_PART_B[currentLevel-1]) && (Math.random() < LEVEL_ALIEN_PROBABILITY_PART_B[currentLevel-1])) {
        let alien = groupAliens.getFirstExists(false);
        if(alien) {
            let x= (Math.floor(Math.random() * (nPages-1+1) + 1))*distBStrng-distBStrng/2;
            alien.reset(x, 0);
            alien.body.velocity.x = 0;
            alien.body.velocity.y = nextPoint * MULT_ALIEN_VELOCITY_PART_B[currentLevel-1];
        }
        bugsAppearedLevelPartB++;
    }
}

function changeLevelPartB() {
    if(currentKilledBugsPartB == BUGS_FOR_LEVEL_PART_B[currentLevel-1]) {
        currentLevel++;
        currentKilledBugsPartB = 0;
        bugsAppearedLevelPartB = 0;
        if(currentLevel == NUM_LEVELS_PART_B + 1) { // The part ends when all levels have been pass
            //game.state.start('partC');
            game.state.start('victory');
        }
        else {
            levelText.text = 'Part B Level: ' + currentLevel;
        }
    }
}
function Teleport(alien, portal) {
    let indexPortalTeleport = PortalsI.getChildIndex(portal);

    if(alien.canTeleport[indexPortalTeleport]) {
        if(Math.random() < 0.5) {
            let telepAnim = TeleportAnims.getChildAt(indexPortalTeleport);
            telepAnim.visible = true;
            telepAnim.animations.play('telepAnim');
            alien.x = PortalsS.getChildAt(indexPortalTeleport).x;
            alien.y = PortalsS.getChildAt(indexPortalTeleport).y;
        } else {
            alien.canTeleport[indexPortalTeleport] = false; // The alien can't use that teleport anymore
        }
    }
};