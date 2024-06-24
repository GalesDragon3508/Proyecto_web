//Variables generales
let level_difficulty = 'medium';    //Dificulty multiplier    default=medium=1; easy= 0.5; hard= 1.5
let madera = 0;
let dinero = 0;

let score;
let levelText; // Actual level Text
let currentLfProbability=0.2; // Probability for a life item is dropped
let timeElapsed; // Time elapsed on ms
let textTimeElapsed; // Text to show the time elapsed
let timeElapsedEndScreen; // Time elapsed on the end screen
let currentPart;
let secondZone = false;

//Constantes generales
const LEVEL_ALIEN_PROBABILITY_PART_A = [0.3, 0.6, 0.9];
const MULT_ALIEN_VELOCITY_PART_A = [1, 1.5, 2.2];
const NUM_LEVELS_PART_A = 3;
const BUGS_FOR_LEVEL_PART_A = [8, 12, 20]; // Bugs to kill to pass the corresponding level
const NBULLETS = 50; // Bullets that can be seen on screen at the same time
const NALIENS = 20; // Aliens that cna be seen on screen at the same time
const NMIMIC = 20
const TIMER_RHYTHM = 0.4 * Phaser.Timer.SECOND; // Timer to spawn enemies
const health=[1, 3, 5];
//Variables del personaje
let player; // Player variable
let maxLifeCounter;// maximum life
let lifeCounter; // Actual life
let lifeWidthScale; // Width of life bar HUD (to show when the player is damaged)
let life = { width: 100 }; // Life bar shown on HUD
let speed = 600; //velocidad de las balas 
let canShoot=0; // Time to shoot again
let controlsUsed = 'keyboard'; // Control to use (default keyboard)
let objecthitbox
let lastCollectTime = 0;
const collectCooldown = 500; // Tiempo de espera en milisegundos para la recolección

//Variables de los enemigos
let groupEnemies; // Grupo de enemigos
let enemy
let enemySpeed = 100; // Velocidad de los enemigos
let detectionRadius = 300;
let spawn_limit = 20;
let enemy_count=0;
let agressive = false;
let dinero_drop_prob = 0.4

//Grupos  
let bulletCount = 20; // Contador de balas disparadas
let maxBullets = 20; // Max amount of bullets
let groupBullets; // Group of bullets
let groupHPItems; // Group of HP items
let NCOIN = 50
let tree;
let treeHP = 3
let hudGroup;

//zona segura
let insafezone = false;
let maxsafezonetime = 10;
let safezonetimeleft = maxsafezonetime;
let safezonetimer;
let safezonetimeleftText
let hudTimeInSafeZone;
let remainingTimeInSafeZone;
let safeZonegroup;
let safeZone;
let buyText;
let texto;
let gameData;
let gamePaused = false;
let isReloading = false;

//Sonidos
let recargaMunicion
let muerteJugador
let talarArbol
let muerteEnemigo
let cogermoneda
let alarma
let abrirTienda
let disparar
let usoHacha
let musicanivel
let savezonesound

//Pantallas adicionales
let nPages = 1; // Number of instruccion pages

let cursors;
let n = 0;
let shootDelay = 200;
let isFiringRateIncreased = false;

//Variables de la tienda
let shopItems = {
    'permanentFiringRate': { cost: 1, purchased: false },
    'increaseMaxBullets': { cost: 2, purchased: false },
    'AvanzarZona': { cost: 15, purchased: false }
};
const habilidades = {
    'permanentFiringRate': { text: "Increases the rate of fire ", cost: 1, tecla: "B" },
    'increaseMaxBullets': { text: "Increases the maximum number of bullets to 40", cost: 2, tecla: "B" }
};
let keyB;
let bPressedOnce = false;
let unaCompra=false;
const habilidadTextos = Object.keys(habilidades).map(key => {
            const habilidad = habilidades[key];
            return `${habilidad.text}: cost ${habilidad.cost} coins, press ${habilidad.tecla} to buy the skill.`;
        }).join('\n');
let partAState = {
    preload: loadPartAAssets,
    create: doPartA,
    update: updatePlayPartA
};
function loadImage(){
    game.load.image('player', 'assets/imgs/jugador.png', 25, 15);
    game.load.image('Hup', 'assets/imgs/Hup.png');
    game.load.image('bullet', 'assets/imgs/Bala.png');
    game.load.image('tree', 'assets/imgs/arbol.png');
    game.load.image('lifebar', 'assets/imgs/vida.png');
    game.load.image('madera', 'assets/imgs/Madera.png');
    game.load.image('moneda', 'assets/imgs/Moneda.png');
    game.load.image('bg', 'assets/imgs/fondo.png');
    game.load.image('safe', 'assets/imgs/cala.jpeg');
}

function loadJson() {
    game.load.text('gameData', 'json/game_data.json');
}

function loadAudio(){
    game.load.audio('tienda', 'assets/snds/abrirTienda.mp3');
    game.load.audio('alarma', 'assets/snds/alarmazonasegura.mp3');
    game.load.audio('disparo', 'assets/snds/disparo.mp3');
    game.load.audio('muerteEnemigo', 'assets/snds/enemydies.wav');
    game.load.audio('golpeHacha', 'assets/snds/Golpehacha.mp3');
    game.load.audio('muerte', 'assets/snds/Personajemuere.wav');
    game.load.audio('cogerDinero', 'assets/snds/recogermoneda.wav');
    game.load.audio('recarga', 'assets/snds/Reload.mp3');
    game.load.audio('talar', 'assets/snds/TalarArbol.wav');
    game.load.audio('musica', 'assets/snds/Musica.mp3');
    game.load.audio('szSound', 'assets/snds/zonaSegura.wav');
}
function loadSprite(){
    game.load.spritesheet('alien', 'assets/imgs/alienAnimacion.png', 50, 35, 2);
    game.load.spritesheet('shoot', 'assets/imgs/Disparo_Personaje.png', 25, 15);
    game.load.spritesheet('collect', 'assets/imgs/Recoleccion_animacion.png', 25, 15);
}

function loadPartAAssets() {
    loadImage();
    loadAudio();
    loadSprite();
    loadJson();
}

function doPartA() {
    resetGame()
    musicanivel = game.add.audio('musica')
    musicanivel.loop = true;
    musicanivel.play()
    musicanivel.volume = 0.25 

    currentPart = 1;
    insafezone = false;
    //Datos del json
    gameData = JSON.parse(game.cache.getText('gameData'));
    safeZonegroup = game.add.group();
    safeZonegroup.enableBody = true;

    game.world.setBounds(0, 0, gameData.map.width, gameData.map.height)
    game.add.sprite(0,0,gameData.map.image);
    game.add.sprite(1720,0,gameData.safeZones.image);

    setDificulty(level_difficulty); // Aplica la dificultad seleccionada
    createKeyControls();
    createBalas(NBULLETS);
    createHUD();
    createAliens(NALIENS);
    createMimicEnemies(NALIENS)
    createTree();
    createPlayer(gameData.player)
    createLifeItems();
    creategrupoDinero(NCOIN);
    createSafeZoneGroup();

    recargaMunicion = game.add.sound('recarga');
    muerteJugador = game.add.sound('muerte');
    talarArbol = game.add.sound('talar');
    muerteEnemigo = game.add.sound('muerteEnemigo');
    cogermoneda = game.add.sound('cogerDinero');
    alarma = game.add.sound('alarma');
    abrirTienda = game.add.sound('tienda');
    disparar = game.add.sound('disparo');
    usoHacha = game.add.sound('golpeHacha');
    musicanivel = game.add.sound('musica');
    savezonesound = game.add.sound('szSound')

    safezonetimer = game.time.events.loop(Phaser.Timer.SECOND, updateTimeInSafeZone, this);
    game.camera.follow(player);
    texto = game.add.text(10, 70, habilidadTextos, { font: '20px Arial', fill: '#ffffff', wordWrap: true, wordWrapWidth: 600 });
    texto = game.add.text(1500, 70, habilidadTextos, { font: '20px Arial', fill: '#ffffff', wordWrap: true, wordWrapWidth: 600 });
}

function updatePlayPartA() {
    game.physics.arcade.overlap(groupBullets, groupEnemies, BalaHitAlien, null, this);
    game.physics.arcade.collide(player, groupEnemies, AlienHitPlayer, null, this);
    game.physics.arcade.collide(player, enemy, MimicHitPlayer, null, this);
    game.physics.arcade.overlap(groupBullets, groupHPItems, BalaHitHp, null, this);
    game.physics.arcade.overlap(player, groupHPItems, ApHpPickup, null, this);
    game.physics.arcade.overlap(player, safeZonegroup, playerInSafeZone, null, this);
    game.physics.arcade.overlap(player, grupoDinero, collectMoney, null, this);
    game.physics.arcade.collide(groupEnemies, safeZonegroup, enemyHitSafeZone, null, this)

    if(!game.physics.arcade.overlap(player, safeZonegroup)  && insafezone == true)
    {
        insafezone = false;
        resetSafeZoneTimeText();
        unaCompra = true; 
    }

    timeElapsed += game.time.elapsed;
    canShoot += game.time.elapsed;
    textTimeElapsed.setText('Tiempo: ' + Math.floor(timeElapsed / 1000));
    
    managePMovements();
    shootOnLeftClick();
    updateEnemyMovements();
    spawnEnemies();
   
    game.camera.follow(player);

    if (teclaF.isDown){
        usoHacha.play();
        grouptree.forEach(function(tree){
            collectResource(tree)
        });
    }
    //MODIFICACION SIN INSAFEZONE
    if (insafezone == true && keyR.isDown) {
       reloadBullets();
    }
    if(secondZone== false && score >= 30 ){         //cambiar a secondZone ==true && item comprado cuando este hecho
        secondZone=true;
        changeLevel();
    }
}

function createPlayer(){
    player = game.add.sprite(gameData.player.startX, gameData.player.startY, 'player');
    game.physics.arcade.enable(player)
    player.anchor.setTo(0.5,0.8);
    player.scale.setTo(0.75,0.75);
    player.body.collideWorldBounds = true;
    player.body.immovable = true;
    player.bringToTop();
}

function createnormalEnemies(numb) {
    for (let i = 0; i < numb; i++) {
        let enemyData = gameData.normalEnemy[i % gameData.normalEnemy.length]; // Usar el índice del array normalEnemy
        let enemy = groupEnemies.create(
            game.rnd.integerInRange(500, enemyData.startX),
            game.rnd.integerInRange(1000, enemyData.startY),
            'alien'
        );        
        enemy.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(enemy);
        enemy.body.collideWorldBounds = true;
        enemy.body.bounce.set(1);
        enemy.body.velocity.x = game.rnd.integerInRange(-enemySpeed, enemySpeed);
        enemy.body.velocity.y = game.rnd.integerInRange(-enemySpeed, enemySpeed);
        enemy_count++;

    }
}

function spawnEnemies(){
    if(enemy_count<spawn_limit){
        game.time.events.add(createnormalEnemies(1), this); // Añade 1 enemigo por cada llamada
        game.time.events.add(createMimicEnemies(1), this); // Añade 1 enemigo por cada llamada
    }
}

function createMimicEnemies(numb) {
    for (let i = 0; i < numb; i++) {
        let enemyData = gameData.mimicEnemy[i % gameData.mimicEnemy.length];
        let enemy = groupEnemies.create(
            game.rnd.integerInRange(800, enemyData.startX),
            game.rnd.integerInRange(900, enemyData.startY),
            'moneda'
        );
        enemy.isMimic = true; // Marcar como enemigo Mimic
        enemy.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(enemy);
        enemy.body.collideWorldBounds = true;
        enemy.body.immovable = true; // El enemigo no se mueve hasta que se convierte
        enemy.body.bounce.set(1);
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

function creategrupoDinero(size) {
    grupoDinero = game.add.group();
    grupoDinero.enableBody = true;
    grupoDinero.createMultiple(size, 'moneda');
    grupoDinero.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', resetMember);
    grupoDinero.callAll('anchor.setTo', 'anchor', 0.5, 0.5);
    grupoDinero.setAll('checkWorldBounds', true);
    grupoDinero.forEach(function(dinero) {
        game.physics.arcade.enable(dinero);
        dinero.scale.setTo(0.3,0.3)
    });
}

function createMoney(x, y) {
    let dinero = grupoDinero.getFirstExists(false);
    if (dinero) {
        dinero.reset(x, y);
    }
    return dinero;
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
        tree.treeHP = 3;
        tree.isCollected = false; 
    });
}
function createBalas(num){
    groupBullets = game.add.group();
    groupBullets.enableBody=true;
    groupBullets.createMultiple(num, 'bullet');
    groupBullets.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', resetMember);
    groupBullets.callAll('anchor.setTo', 'anchor', 0.5, 0.5)
    groupBullets.setAll('checkWorldBounds', true);
}

function createLifeItems() {
    groupHPItems=game.add.group();
    groupHPItems.enableBody=true;
    groupHPItems.createMultiple(10, 'Hup');
    groupHPItems.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', resetMember);
    groupHPItems.callAll('anchor.setTo', 'anchor', 0.5, 0.5)
    groupHPItems.setAll('checkWorldBounds', true);
}

function createSafeZoneGroup() {
    gameData.safeZones.forEach(createSafeZone, this);
}

function createSafeZone() {
    safeZone = safeZonegroup.create(gameData.safeZones[n].x, gameData.safeZones[n].y, 'safe');
    safeZone.width = gameData.safeZones.width;
    safeZone.height = gameData.safeZones.height;
    safeZone.anchor.setTo(0.5, 0.5);
    safeZone.scale.setTo(1, 1);
    //game.physics.arcade.enable(safeZone);
    safeZone.body.immovable = true;
    n++;
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
    scoreText.bringToTop();

    difficultyText = game.add.text(difficultyX, allY, level_difficulty, styleHUD);
    difficultyText.fixedToCamera = true;
    difficultyText.bringToTop();
    
    recurso_madera = game.add.image(maderaX,10,'madera')
    recurso_madera.scale.setTo(0.5,0.5)
    recurso_madera.fixedToCamera = true;
    recurso_madera.bringToTop();

    maderacant = game.add.text(maderaX + 60, 10, madera, styleHUD)
    maderacant.fixedToCamera = true;
    maderacant.bringToTop();

    recurso_dinero = game.add.image(dineroX,10,'moneda')
    recurso_dinero.scale.setTo(0.4,0.4)
    recurso_dinero.fixedToCamera = true;
    recurso_dinero.bringToTop();

    dinerocant = game.add.text(dineroX + 80, 10, dinero, styleHUD);
    dinerocant.fixedToCamera = true;
    dinerocant.bringToTop();

    recurso_balas = game.add.image(balasX,10,'bullet');
    recurso_balas.scale.setTo(1.25,1.25);
    recurso_balas.fixedToCamera = true;
    recurso_balas.bringToTop();

    bulletcant = game.add.text(balasX + 40, 10, bulletCount, styleHUD);
    bulletcant.fixedToCamera = true;
    bulletcant.bringToTop();
    
    //Quizá meterle un if para que aparezca solo cuando esta dentro de la safezone
    safezonetimeleftText = game.add.text(GAME_WIDTH / 4, 10, `TIME LEFT IN SAFE ZONE: ${maxsafezonetime}`, { font: 'bold 15pt Arial', fill: '#F44611', stroke: '#000000', strokeThickness: 4 });
    safezonetimeleftText.fixedToCamera = true;

    updateBulletText();
    updateMaderaText();
    updateDineroText();
    updateTimeInSafeZone();

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

    lifeWidthScale = life.width / maxLifeCounter;

    textTimeElapsed = game.add.text(10, 10, 'Tiempo: 0', { font: '16px Arial', fill: 'white' });
    textTimeElapsed.fixedToCamera = true;
}

function enemyHitSafeZone(enemy,safezone){
    enemy.body.velocity.x *= -1;
    enemy.body.velocity.y *= -1;
}

function BalaHitAlien(bala, alien){
    let x= alien.x;
    let y= alien.y;
    alien.kill();
    bala.kill();
    muerteEnemigo.play();

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
    if(score>=100 && secondZone==true){
        victory();
    }
}

function AlienHitPlayer(player, alien){
    alien.kill();
    lifeCounter--;
    if (lifeCounter <= 0)
    {
        defeat();
    } else{
        life.width -= lifeWidthScale;
    }
}

function MimicHitPlayer(player, mimic){
    mimic.kill();
    lifeCounter--;
    if (lifeCounter <= 0)
    {
        defeat();
    } else{
        life.width -= lifeWidthScale;
    }
}

function BalaHitHp(bala, hp){
    hp.kill();
    bala.kill();
}

function ApHpPickup(player, hp){
    hp.kill();

    if(lifeCounter < maxLifeCounter){
        lifeCounter++;
        life.width += lifeWidthScale;
    }
}

function playerInSafeZone(player, safeZone) {
    if(insafezone == false)
    {
        savezonesound.play()
        insafezone = true;
        bPressedOnce = true;
        updateTimeInSafeZone();
        unaCompra=false;
    }

    //Ir a la otra zona segura al comprar
    else if (bPressedOnce == true && keyB.isDown) {
        openShop();
        bPressedOnce = false;
        
        if(gameData.safeZones[0].x == safeZone.x)
        {
            player.x = gameData.safeZones[1].x;
            player.y = gameData.safeZones[1].y;
        }
        else
        {
            player.x = gameData.safeZones[0].x;
            player.y = gameData.safeZones[0].y;
        }

        
    }
}

function collectMoney(player, coin) {
    cogermoneda.play();
    coin.kill();
    dinero += 1;
    totalDinero += 1;
    updateDineroText();
}

// Función para alternar la tasa de disparo
function setPermanentFiringRate() {
    shootDelay = 100;
}

function setBulletsAmount() {
    maxBullets = 40;
}



function resetGame() {
    bulletCount = 20
    madera = 0
    dinero = 0
    totalDinero = 0
    totalMadera = 0
    enemy_count = 0
    score = 0
    n = 0
    unaCompra=false;
    secondZone=false;
    spawn_limit=20;
    shootDelay = 200;
    maxBullets = 20;
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

function resetSafeZoneTimeText() {
    alarma.stop()
    safezonetimeleft = maxsafezonetime;
    safezonetimeleftText.setText("TIME LEFT IN SAFE ZONE: " + TimeLeftInSafeZone(safezonetimeleft));
}


function TimeLeftInSafeZone(seconds) {
    let minutes = String(Math.trunc(seconds / 60)).padStart(2, "0");
    let secs = String(seconds % 60).padStart(2, "0");
    return `${minutes}:${secs}`;
}

function updateTimeInSafeZone() {
    if (insafezone) {
        safezonetimeleft = Math.max(0, safezonetimeleft - 1);
        safezonetimeleftText.setText("TIME LEFT IN SAFE ZONE: " + TimeLeftInSafeZone(safezonetimeleft));

        if(safezonetimeleft <=3){
            alarma.play();
            alarma.volume = 0.4;
        }
        
        if (safezonetimeleft == 0) {
            defeat();
        }
    }
}

function reloadBullets() {
    if(insafezone){
        if (bulletCount === maxBullets) {
            return;
        }

        recargaMunicion.play();
        isReloading = true;
        pauseGame();
        const bulletsPerReload = 1;
        let bulletsReloaded = 0;

        // Función para recargar balas de manera gradual
        function reload() {
            if (bulletCount < maxBullets) {
                bulletCount += bulletsPerReload;
                bulletsReloaded++;
                updateBulletText();
                setTimeout(reload, 500); // Pausa de medio segundo entre recargas
            } else {
                isReloading = false; // La recarga ha terminado
                resumeGame();
            }
        }

        // Inicia la primera recarga
        reload();
    }
}


function openShop() {

    if (insafezone) {
        abrirTienda.play();
        abrirTienda.volume = 0.6
        if(!unaCompra){
          if (dinero >= shopItems.permanentFiringRate.cost && !shopItems.permanentFiringRate.purchased) {
                dinero -= shopItems.permanentFiringRate.cost;
                updateDineroText();
                shopItems.permanentFiringRate.purchased = true;
                setPermanentFiringRate();
                secondZone = true;
            } else if (dinero >= shopItems.increaseMaxBullets.cost && shopItems.permanentFiringRate.purchased && !shopItems.increaseMaxBullets.purchased) {
                dinero -= shopItems.increaseMaxBullets.cost;
                updateDineroText();
                shopItems.increaseMaxBullets.purchased = true;
                setBulletsAmount();
            }
        }
        unaCompra=true; 
    }
}

function createKeyControls() {
    cursors = game.input.keyboard.createCursorKeys();
    teclaF = game.input.keyboard.addKey(Phaser.Keyboard.F);
    game.input.onDown.add(shootOnLeftClick, this);
    game.input.mouse.capture = true;
    keyR = game.input.keyboard.addKey(Phaser.Keyboard.R);
    keyB = game.input.keyboard.addKey(Phaser.Keyboard.B);
    keyB.onDown.add(openShop, this); 

}

function managePMovements() {
    if (isReloading) {
        return; // No permitir el movimiento si el jugador está recargando
    }
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
    if ((cursors.left.isDown || keyA.isDown)/* && player.x >= gameData.playableZones[n].x1*/){
        player.x -= 5; // Mueve hacia la izquierda
    } else if ((cursors.right.isDown || keyD.isDown) /*&& player.x <= gameData.playableZones[n].x2*/) {
        player.x += 5; // Mueve hacia la derecha
    }

    if ((cursors.up.isDown || keyW.isDown) /*&& player.y <= gameData.playableZones[n].y1*/) {
        player.y -= 5; // Mueve hacia arriba
    } else if ((cursors.down.isDown || keyS.isDown) /*&& player.y >= gameData.playableZones[n].y2*/) {
        player.y += 5; // Mueve hacia abajo
    }

}

// Función para disparar una bala al hacer clic izquierdo del ratón
function shootOnLeftClick() {
    if(insafezone == false)
    {

        if (bulletCount <= 0) {
            return; // No disparar si se ha alcanzado el límite de balas
        }
    
        if (game.input.activePointer.leftButton.isDown) {
            if (canShoot > shootDelay) {
                disparar.play();
                disparar.volume = 0.5
                shootBala(player.x, player.y);
                canShoot = 0;
            }
        }
    }
}

function collectResource(tree) {
    let playerX = player.x;
    let playerY = player.y;
    let treeX = tree.x;
    let treeY = tree.y;

    if (tree.isCollected) {
        return;
    }

    let distance = Phaser.Math.distance(playerX, playerY, treeX, treeY);
    if (distance <= 150 && game.time.now > lastCollectTime + collectCooldown) {
        talarArbol.play();
        tree.treeHP--; 
        madera += 1;
        totalMadera+=1;
        updateMaderaText();
        lastCollectTime = game.time.now; // Actualizar el tiempo de la última recolección
        if (tree.treeHP <= 0) {
            tree.isCollected = true; // Marcar el árbol como recolectado
            tree.destroy();
        }
    }
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

function setDificulty(level_difficulty) {
    if (level_difficulty === 'easy') {
        maxLifeCounter = 5;
        currentLfProbability = 0.3;
    } else if (level_difficulty === 'medium') {
        maxLifeCounter = 3;
        currentLfProbability = 0.2;
    } else if (level_difficulty === 'hard') {
        maxLifeCounter = 1;
        currentLfProbability = 0.1;
    }
    lifeCounter = maxLifeCounter; // Asegúrate de inicializar lifeCounter correctamente
    lifeWidthScale = maxLifeCounter/life.width; // Ajusta la escala de la barra de vida
}

function changeLevel(){
    spawn_limit=25;
    player.x = gameData.safeZones[0].x;
    player.y = gameData.safeZones[0].y;

    groupEnemies.forEach(function(enemy) {
        enemy.kill();
    });
}

function updateEnemyMovements() {
    if (groupEnemies) {
        groupEnemies.forEachAlive(function(enemy) {
            if (enemy.isMimic) {
                let distanceToPlayer = game.physics.arcade.distanceBetween(player, enemy);
                if (distanceToPlayer < detectionRadius) {
                    // Cambiar el sprite y comportamiento a enemigo normal
                    enemy.loadTexture('alien', 0);
                    enemy.isMimic = false;
                    enemy.body.immovable = false;
                    enemy.body.velocity.x = game.rnd.integerInRange(-enemySpeed, enemySpeed);
                    enemy.body.velocity.y = game.rnd.integerInRange(-enemySpeed, enemySpeed);
                }
            }
            else{
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
                }
            }
            
        });
    }
}

function defeat() {
    muerteJugador.play();
    alarma.stop();
    musicanivel.stop();

    groupEnemies.forEach(function(enemy) {
        enemy.kill();
    });
    bulletCount = 20;
    player.kill();
    game.time.events.remove(safezonetimer);
    game.state.start('defeat');
}

function victory() {
    groupEnemies.forEach(function(enemy) {
        enemy.kill();
    });
    musicanivel.stop();
    bulletCount = 20;
    player.kill();
    game.time.events.remove(safezonetimer);
    game.state.start('victory');
}

function pauseGame() {
    gamePaused = true;

    // Pausar el movimiento de los enemigos
    groupEnemies.forEachAlive(function(enemy) {
        enemy.body.velocity.setTo(0, 0);
        enemy.body.moves = false;
    });

}

function resumeGame() {
    gamePaused = false;

    // Reanudar el movimiento de los enemigos
    groupEnemies.forEachAlive(function(enemy) {
        enemy.body.moves = true;
    });

}

function goMainMenu(button) {
    game.state.start('init');
}

function resetMember(item) {
    item.kill();
}