//Variables generales
let level_dificulty = 'medium';    //Dificulty multiplier    default=medium=1; easy= 0.5; hard= 1.5
let madera = 0
let dinero = 0
let score;
let levelText; // Actual level Text
let currentLfProbability=0.2; // Probability for a life item is dropped
let timeElapsed; // Time elapsed on ms
let textTimeElapsed; // Text to show the time elapsed
let timeElapsedEndScreen; // Time elapsed on the end screen
let currentPart;

//Constantes generales
const LEVEL_ALIEN_PROBABILITY_PART_A = [0.3, 0.6, 0.9];
const MULT_ALIEN_VELOCITY_PART_A = [1, 1.5, 2.2];
const NUM_LEVELS_PART_A = 3;
const BUGS_FOR_LEVEL_PART_A = [8, 12, 20]; // Bugs to kill to pass the corresponding level
const NBULLETS = 50; // Bullets that can be seen on screen at the same time
const NALIENS = 20; // Aliens that cna be seen on screen at the same time
const TIMER_RHYTHM = 0.4 * Phaser.Timer.SECOND; // Timer to spawn enemies

//Variables del personaje
let player; // Player variable
let maxLifeCounter; // maximum life
let lifecounter; // Actual life
let lifeWidthScale; // Width of life bar HUD (to show when the player is damaged)
let life = { width: 100 }; // Life bar shown on HUD
let speed = 600; //velocidad de las balas 
let canShoot=0; // Time to shoot again
let controlsUsed = 'keyboard'; // Control to use (default keyboard)
let objecthitbox

//Variables de los enemigos
let groupEnemies; // Grupo de enemigos
let enemySpeed = 100; // Velocidad de los enemigos
let detectionRadius = 200;
let spawn_limit = 20;
let enemy_count=0;
let agressive = false;
let dinero_drop_prob = 0.4

//Grupos  
let bulletCount = 20; // Contador de balas disparadas
const maxBullets = 20; // Max amount of bullets
let groupBullets; // Group of bullets
let groupHPItems; // Group of HP items
let NCOIN = 50
let tree;
let treeHP = 3

//zona segura
let safezone;
let safezones;
let insafezone = false;
let maxsafezonetime = 10;
let safezonetimeleft = maxsafezonetime;
let safezonetimer;


//zona de recarga
let rechargezone;
let rechargezones;
let inrechargezone=false;
let recharge_timer=0;

//Pantallas adicionales
let nPages = 1; // Number of instruccion pages

let partAState = {
    preload: loadPartAAssets,
    create: doPartA,
    update: updatePlayPartA
};

function loadPartAAssets() {
    game.load.image('player', 'assets/imgs/jugador.png', 25, 15);
    game.load.image('Hup', 'assets/imgs/Hup.png');
    game.load.image('bullet', 'assets/imgs/Bala.png');
    game.load.image('tree', 'assets/imgs/arbol.png');
    game.load.spritesheet('alien', 'assets/imgs/alienAnimacion.png', 50, 35, 2);
    game.load.spritesheet('shoot', 'assets/imgs/Disparo_Personaje.png', 25, 15);
    game.load.spritesheet('collect', 'assets/imgs/Recoleccion_animacion.png', 25, 15);
    game.load.image('lifebar', 'assets/imgs/vida.png');
    game.load.image('madera', 'assets/imgs/Madera.png');
    game.load.image('moneda', 'assets/imgs/Moneda.png');
    game.load.image('bg', 'assets/imgs/fondo.png');
    game.load.image('safe', 'assets/imgs/cala.jpg');
    game.load.json('gameData', 'json/game_data.json');
    game.load.audio('1up', 'assets/snds/1up.wav');
}

function doPartA() {
    currentPart = 1;
    //Datos del json
    let gameData = game.cache.getJSON('gameData');
    
    game.world.setBounds(0,0,WORLD_WIDTH,WORLD_HEIGHT)
    game.add.sprite(0,0,gameData.map.image);
    game.add.sprite(1720,0,gameData.safeZones.image);

    setDificulty(level_dificulty); // Aplica la dificultad seleccionada
    createKeyControls();
    createBalas(NBULLETS);
    createHUD();
    createAliens(NALIENS);
    createTree();
    createPlayer(gameData.player)
    createLifeItems();
    createSafeZone(gameData.safeZones)
    //createRechargeZone(gameData.rechargeZones)
    createMoneyGroup(NCOIN);

    safezonetimer = game.time.events.loop(Phaser.Timer.SECOND, updateTimeInSafeZone, this);

    game.camera.follow(player);
    
}

function updatePlayPartA() {
    game.physics.arcade.overlap(groupBullets, groupEnemies, BalaHitAlien, null, this);
    game.physics.arcade.overlap(player, groupEnemies, AlienHitTurret, null, this);
    game.physics.arcade.overlap(groupBullets, groupHPItems, BalaHitHp, null, this);
    game.physics.arcade.overlap(player, groupHPItems, ApHpPickup, null, this);
    game.physics.arcade.overlap(player, safezone, playerInSafeZone, null, this);
    game.physics.arcade.overlap(player, moneyGroup, collectMoney, null, this)
    game.physics.arcade.overlap(groupEnemies, safezone, enemyhitsafezone, null, this)


    managePMovements();
    timeElapsed += game.time.elapsed;
    canShoot += game.time.elapsed;
    shootOnLeftClick();
    textTimeElapsed.setText('Tiempo: ' + Math.floor(timeElapsed / 1000));

    updateEnemyMovements();
    spawnEnemies();
    game.camera.follow(player);

    if (teclaF.isDown){
        grouptree.forEach(function(tree){
            collectResource(tree)
        });
    }
    if (keyR.isDown && insafezone) {
        reloadBullets();
    }
}

function createKeyControls() {
    cursors = game.input.keyboard.createCursorKeys();
    teclaF = game.input.keyboard.addKey(Phaser.Keyboard.F);
    game.input.onDown.add(shootOnLeftClick, this);
    game.input.mouse.capture = true;
    let keyE = game.input.keyboard.addKey(Phaser.Keyboard.E);
    keyE.onDown.add(setPermanentFiringRate, this);
    keyR = game.input.keyboard.addKey(Phaser.Keyboard.R); 

}

/*function hitbox(object, radius) {
    objecthitbox.setCircle(radius);
    objecthitbox.setOffset(-radius, -radius);
}*/

function createPlayer(){
    player = game.add.sprite(GAME_WIDTH/2, GAME_HEIGHT/2, 'player');
    game.physics.arcade.enable(player)
    player.anchor.setTo(0.5,0.8);
    player.scale.setTo(0.75,0.75);
    player.body.collideWorldBounds = true;
    player.bringToTop();
    //hitbox(player, 20)
}    

function createMoneyGroup(size) {
    moneyGroup = game.add.group();
    moneyGroup.enableBody = true;
    moneyGroup.createMultiple(size, 'moneda');
    moneyGroup.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', resetMember);
    moneyGroup.callAll('anchor.setTo', 'anchor', 0.5, 0.5);
    moneyGroup.setAll('checkWorldBounds', true);
    moneyGroup.forEach(function(money) {
        game.physics.arcade.enable(money);
        money.scale.setTo(0.3,0.3)
    });
}

function createMoney(x, y) {
    let money = moneyGroup.getFirstExists(false);
    if (money) {
        money.reset(x, y);
    }
    return money;
}

let shootDelay = 200;
let isFiringRateIncreased = false;

// Función para alternar la tasa de disparo
function setPermanentFiringRate() {
    shootDelay = 100;
}


// Función para disparar una bala al hacer clic izquierdo del ratón
function shootOnLeftClick() {
    if (bulletCount <= 0) {
        return; // No disparar si se ha alcanzado el límite de balas
    }

    if (game.input.activePointer.leftButton.isDown) {
        if (canShoot > shootDelay) {
            shootBala(player.x, player.y);
            canShoot = 0;
        }
    }
}

function createBalas(num){
    groupBullets = game.add.group();
    groupBullets.enableBody=true;
    groupBullets.createMultiple(num, 'bullet');
    groupBullets.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', resetMember);
    groupBullets.callAll('anchor.setTo', 'anchor', 0.5, 0.5)
    groupBullets.setAll('checkWorldBounds', true);
}

function createHUD() {
    let vidaX = GAME_WIDTH / 2;
    let vidaY = GAME_HEIGHT - 25;
    let scoreX = 5;
    let difficultyX = GAME_WIDTH - 150;
    let PartX = GAME_WIDTH * 0.75;
    let maderaX = GAME_WIDTH*0.75;
    let dineroX = GAME_WIDTH*0.75 + 120;
    let balasX = GAME_WIDTH*0.75 - 100 ;
    let allY = GAME_HEIGHT - 25;
    let styleHUD ={ fontSize: '18px', fill: 'white' };
    
    scoreText = game.add.text(scoreX, allY, 'Score: ' + score, styleHUD);
    scoreText.fixedToCamera = true;

    difficultyText = game.add.text(difficultyX, allY, 'level_dificulty', styleHUD);
    difficultyText.fixedToCamera = true;
    
    recurso_madera = game.add.image(maderaX,10,'madera')
    recurso_madera.scale.setTo(0.5,0.5)
    recurso_madera.fixedToCamera = true;

    maderacant = game.add.text(maderaX + 60, 10, madera, styleHUD)
    maderacant.fixedToCamera = true;

    recurso_dinero = game.add.image(dineroX,10,'moneda')
    recurso_dinero.scale.setTo(0.4,0.4)
    recurso_dinero.fixedToCamera = true;

    dinerocant = game.add.text(dineroX + 80, 10, dinero, styleHUD);
    dinerocant.fixedToCamera = true;


    recurso_balas = game.add.image(balasX,10,'bullet');
    recurso_balas.scale.setTo(1.25,1.25);
    recurso_balas.fixedToCamera = true;

    bulletcant = game.add.text(balasX + 40, 10, bulletCount, styleHUD);
    bulletcant.fixedToCamera = true;

    updateBulletText();
    updateMaderaText();
    updateDineroText();

    // Shows "PART A" or "PART B" whenever is Part A or B when it's created the HUD
    if(currentPart == 1) {
        levelText = game.add.text(PartX, allY, 'Part A', styleHUD);
    }
    else if(currentPart == 2) {
        levelText = game.add.text(PartX, allY, 'Part B', styleHUD);
    }
    levelText.fixedToCamera = true;

    life = game.add.image(vidaX, vidaY, 'lifebar');
    life.anchor.setTo(0.5, 0.5);
    life.fixedToCamera = true;

    textTimeElapsed = game.add.text(10, 10, 'Tiempo: 0', { font: '16px Arial', fill: 'white' });
    textTimeElapsed.fixedToCamera = true;
}

function updateBulletText() {
    bulletcant.setText(bulletCount);
}

function updateMaderaText() {
    maderacant.setText(madera);
}

function updateDineroText() {
    dinerocant.setText(dinero);
}

function createLifeItems() {
    groupHPItems=game.add.group();
    groupHPItems.enableBody=true;
    groupHPItems.createMultiple(10, 'Hup');
    groupHPItems.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', resetMember);
    groupHPItems.callAll('anchor.setTo', 'anchor', 0.5, 0.5)
    groupHPItems.setAll('checkWorldBounds', true);
}

function goMainMenu(button) {
    game.state.start('init');
}

function BalaHitAlien(bala, alien){
    let x= alien.x;
    let y= alien.y;
    alien.kill();
    bala.kill();

    let randomnumber = Math.random();

    if (randomnumber <= dinero_drop_prob) {
        createMoney(x ,y);
    }
    score++;
    scoreText.text = 'Score: ' + score;

    if(Math.random() < currentLfProbability) {
        createLifeItems(x,y);
    }
    enemy_count--;
}

function AlienHitTurret(player, alien){
    lifeCounter--;
    alien.kill();

    if (lifeCounter <= 0)
    {
        life.kill();
        game.state.start('defeat');
    } else {
        life.width -= lifeWidthScale;
    }
}

function BalaHitHp(bala, hp){
    hp.kill();
    bala.kill();
}

function ApHpPickup(player, hp){
    hp.kill();

    if(lifecounter < maxLifeCounter){
        lifecounter++;
        life.width += lifeWidthScale;
    }
}

/*function ApHpPickup (x, y) {
    groupHPItems.getFirstExists(false);
}*/

function playerInSafeZone(player, safeZone) {
    insafezone = true;
    safezonetimeleft = maxsafezonetime; 
    console.log(insafezone);
}

function playerOutSafeZone(player, safeZone) {
    insafezone = false;
    console.log(insafezone);
}

function reloadBullets() {
    if (bulletCount < maxBullets && inrechargezone === false) {
        inrechargezone = true;
        game.time.events.add(Phaser.Timer.SECOND * 3, function() {
            bulletCount = maxBullets;
            updateBulletText();
            inrechargezone = false;
        }, this);
    }
}

function collectMoney(player, coin) {
    coin.kill();
    dinero += 1;
    updateDineroText();
}

function managePMovements() {
    let dx = game.input.activePointer.worldX - player.x;
    let dy = game.input.activePointer.worldY - player.y;
    let keyW = game.input.keyboard.addKey(Phaser.Keyboard.W);
    let keyA = game.input.keyboard.addKey(Phaser.Keyboard.A);
    let keyS = game.input.keyboard.addKey(Phaser.Keyboard.S);
    let keyD = game.input.keyboard.addKey(Phaser.Keyboard.D);

    // Calcular el ángulo utilizando atan2
    let angle_rad = Math.atan2(dy, dx);
    let angle_deg = (angle_rad/Math.PI*180) + (angle_rad > 0 ? 0 : 360);
    // Convertir el ángulo a grados y establecer la rotación del jugador
    player.angle = Phaser.Math.wrapAngle(angle_deg) +90

    //Mover el personaje
    if(inrechargezone === false){
        if (cursors.left.isDown || keyA.isDown) {
            player.x -= 5; // Mueve hacia la izquierda
        } else if (cursors.right.isDown || keyD.isDown) {
            player.x += 5; // Mueve hacia la derecha
        }
    
        if (cursors.up.isDown || keyW.isDown) {
            player.y -= 5; // Mueve hacia arriba
        } else if (cursors.down.isDown || keyS.isDown) {
            player.y += 5; // Mueve hacia abajo
        }
    }

}

function resetMember(item) {
    item.kill();
}

function shootBala (x, y) {
    let dx = game.input.activePointer.worldX - player.x;
    let dy = game.input.activePointer.worldY - player.y;
    let angle_rad = Math.atan2(dy, dx);
    let angle_deg = (angle_rad/Math.PI*180) + (angle_rad > 0 ? 0 : 360);

    let shot = groupBullets.getFirstExists(false);
    if(shot){
        shot.reset(x, y);
        shot.animations.add('shoot', [0, 1, 2], 3, false);
        shot.animations.play('shoot');
        shot.body.velocity.x = speed * Math.cos(angle_rad);
        shot.body.velocity.y = speed * Math.sin(angle_rad);
        player.angle = Phaser.Math.wrapAngle(angle_deg) +90
        bulletCount--;
        updateBulletText();  
    }
    return shot;// Código para disparar una bala
} 

function createTree(){
    grouptree = game.add.group();
    grouptree.enableBody = true;
    grouptree.createMultiple(5, 'tree');
    grouptree.callAll('anchor.setTo', 'anchor', 0.5, 1);

    grouptree.forEach(function(tree) {
        let ranX = game.rnd.integerInRange(0, game.world.width);
        let ranY = game.rnd.integerInRange(0, game.world.height);
        tree.reset(ranX, ranY);
        tree.body.immovable = true; // Hace que los árboles no se muevan al colisionar
    });
}

function collectResource(tree) {
    let playerX = player.x;
    let playerY = player.y;
    let treeX = tree.x;
    let treeY = tree.y;

    // Calcular la distancia entre el jugador y el árbol
    if ((playerX-treeX <= 50) && (playerY-treeY <=50)) {
        treeHP--
        madera += 1; // Incrementar el recurso recolectado
        updateMaderaText();
        if(treeHP == 0){
            tree.kill();
        }
    }
}

function setDificulty(level_dificulty){
    if (level_dificulty == 'easy') {
        maxLifeCounter = 5;
        lifecounter = 5;
        currentLfProbability = 0.3; // Probabilidad de obtener una vida en 'easy'
    } else if (level_dificulty == 'medium') {
        maxLifeCounter = 3;
        lifecounter = 3;
        currentLfProbability = 0.2; // Probabilidad de obtener una vida en 'medium'
    } else if (level_dificulty == 'hard') {
        maxLifeCounter = 1;
        lifecounter = 1;
        currentLfProbability = 0.1; // Probabilidad de obtener una vida en 'hard'
    }
    lifeWidthScale = life.width / maxLifeCounter; // Ajustar la escala de la barra de vida
}


function createSafeZone(safeZonesData) {
    safezones = game.add.group();
    safezones.enableBody = true;
    safeZonesData.forEach(function(safeZoneData) {
        let safezone = safezones.create(safeZoneData.x, safeZoneData.y, safeZoneData.image);
        safezone.anchor.setTo(0.5, 1);
        safezone.body.immovable = true;
        // Añadir las colisiones de entrada y salida
        safezone.body.onCollide = new Phaser.Signal();
        safezone.body.onCollide.add(playerInSafeZone, this);
        safezone.body.onCollide.add(playerOutSafeZone, this);
    });
}

function createRechargeZone(rechargeZonesData) {        //de momento solo he copiado la anterior y he cambiado cosas
    rechargezones = game.add.group();
    rechargezone.enableBody = true;
    rechargezono.forEach(function(rechargeZoneData) {
        let rechargezone = rechargezone.create(rechargeZoneData.x, rechargeZoneData.y, rechargeZoneData.image);
        rechargezone.anchor.setTo(0.5, 1);
        rechargezone.body.immovable = true;
    });
}



function updateTimeInSafeZone() {
    if (insafezone) {
        safezonetimeleft--;
        if (safezonetimeleft <= 0) {
            insafezone = false;
        }
    }
}

function enemyhitsafezone(groupEnemies,safezone){
    -groupEnemies.body.velocity.x 
    -groupEnemies.body.velocity.y
}

function updateRechargeTime() {
    if (inrechargezone) {
        recharge_timer++;
        if (recharge_timer >= 3) {
            inrechargezone = false;
            recharge_timer=0;
        }
    }
}

function updateEnemyMovements() {
    if (groupEnemies) {
        groupEnemies.forEachAlive(function(enemy) {
            let distanceToPlayer = game.physics.arcade.distanceBetween(player, enemy);
            if (distanceToPlayer < detectionRadius && !agressive) {
                agressive = true; // Cambiar estado a agresivo
            }
            else if (distanceToPlayer >= detectionRadius || insafezone == true) {
                agressive = false; // Cambiar estado a normal
            }

            if (agressive) {
                game.physics.arcade.moveToObject(enemy, player, enemySpeed);
            }
            else {
                if (enemy.body.velocity.x === 0 && enemy.body.velocity.y === 0) {
                    enemy.body.velocity.x = game.rnd.integerInRange(-enemySpeed, enemySpeed);
                    enemy.body.velocity.y = game.rnd.integerInRange(-enemySpeed, enemySpeed);
                }
                if(inrechargezone){
                    enemy.body.velocity.x = 0;
                    enemy.body.velocity.y = 0;
                }
            }
        });
    }
}


function spawnEnemies(){
    if(enemy_count<spawn_limit){
        game.time.events.add(createEnemies(1), this); // Añade 1 enemigo por cada llamada
    }
}

function createEnemies(numb) {
    for (let i = 0; i < numb; i++) {
        let enemy = groupEnemies.create(game.rnd.integerInRange(500, WORLD_WIDTH), game.rnd.integerInRange(500, WORLD_HEIGHT), 'alien');
        enemy.anchor.setTo(0.5, 0.5);
        enemy.body.collideWorldBounds = true;
        enemy.body.bounce.set(1);
        enemy.body.velocity.x = game.rnd.integerInRange(-enemySpeed, enemySpeed);
        enemy.body.velocity.y = game.rnd.integerInRange(-enemySpeed, enemySpeed);
        enemy_count++;

    }
}

function createAliens (numb) {
    groupEnemies = game.add.group();
    groupEnemies.enableBody = true;
    groupEnemies.createMultiple(numb, 'alien');
    groupEnemies.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', resetMember);
    groupEnemies.callAll('anchor.setTo', 'anchor', 0.5, 0.5);
    groupEnemies.setAll('checkWorldBounds', true);
    groupEnemies.callAll('animations.add', 'animations', 'alien', [0, 1], 5, true);
    groupEnemies.callAll('animations.play', 'animations', 'alien');
}

function resetInput() {
    game.input.enabled = false;
}

//Tienda

let texthabilidad1;
let texthabilidad2;
let texthabilidad3;

/*function Shop(){
    texthabilidad1=game.add.text(800,1600, 'Press E to buy \n   ('+levelCofig.habilidad1.cost+'habilidad1)',){
        font: 'bold 13pt TrashCinemaBB',
        fill: '#F44611',
        stroke: #000000',
        strokeThickness: 4,
    });

    texthabilidad2=game.add.text(680, 1600, 'Press E to buy \n  ('+levelConfig.habilidad2.cost+'zenis)',{
        font: 'bold 13pt TrashCinemaBB',
        fill: '#F44611',
        stroke: '#000000',
        strokeThickness: 4,
        });

    texthabilidad3=game.add.text(930, 1600, 'Press E to buy \n  ('+levelConfig.habilidad3.cost+'zenis)',{
        font: 'bold 13pt TrashCinemaBB',
            fill: '#F44611',
            stroke: #000000',
            strokeThickness: 4,
        });
    texthabilidad1.anchor.setTo(0.5,0.5);
    texthabilidad1.anchor.alpha=0;

    texthabilidad2.anchor.setTo(0.5,0.5);
    texthabilidad2.anchor.alpha=0;

    texthabilidad3.anchor.setTo(0.5,0.5);
    texthabilidad3.anchor.alpha=0;

}
function UpdateShop(){

}
let habilidad1buy=false;
function buyhabilidad1(){
    let habilidad1=game.physics.arcade.distance(player, tp);
    if (distanciatp<50){
        texthabilidad1.alpha=1;
    }
    else{
        texthabilidad1.alpha=0;
    }
}   
*/