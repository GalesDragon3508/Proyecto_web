let difficultSelection = {
    create: doDifficultSelection
};

let buttonEasy;
let buttonMedium;
let buttonHard;

function doDifficultSelection() {
    pPos=1;
    lifeCounter=3;
    score=0;
    timeElapsed = 0;

    game.add.image(0, 0, 'bg');
    let title = 'LEVEL SELECTION';
    let textBack = 'BACK';
    let textEasy = 'Easy';
    let textMedium = 'Medium';
    let textHard= 'Hard';
    let textPA = 'Part A';
    let textPB = 'Part B';


    let styleTextTitle = {
        fontSize: '28px',
        font: "Vintage Propagandist Regular",
        fill:'white'
    }

    let styleTextButtons = {
        fontSize: '20pt',
        font: "Vintage Propagandist Regular",
        fill:'white'
    };

    game.add.text(GAME_WIDTH / 2, 80, title, styleTextTitle).anchor.setTo(0.5, 0); // Title

    // BUTTON LEVEL EASY
    buttonEasy = game.add.button(GAME_WIDTH /2 - 150, GAME_HEIGHT / 2 - 200, 'btn', playEasy);
    buttonEasy.scale.setTo(0.5,0.5);
    buttonEasy.anchor.setTo(0.5, 0);
    game.add.text(buttonEasy.centerX, buttonEasy.centerY-2, textEasy, styleTextButtons).anchor.setTo(0.5, 0.5);

    // BUTTON SELECT MEDIUM
    buttonMedium = game.add.button(GAME_WIDTH /2 - 150, GAME_HEIGHT / 2 - 100, 'btn', playMedium);
    buttonMedium.scale.setTo(0.5,0.5);
    buttonMedium.anchor.setTo(0.5, 0);
    game.add.text(buttonMedium.centerX, buttonMedium.centerY-2, textMedium, styleTextButtons).anchor.setTo(0.5, 0.5);

    // BUTTON SELECT HARD
    buttonHard = game.add.button(GAME_WIDTH /2 - 150, GAME_HEIGHT / 2, 'btn', playHard);
    buttonHard.scale.setTo(0.5,0.5);
    buttonHard.anchor.setTo(0.5, 0);
    game.add.text(buttonHard.centerX, buttonHard.centerY-2, textHard, styleTextButtons).anchor.setTo(0.5, 0.5);

    // BUTTON PART A
    let buttonLevelA = game.add.button(GAME_WIDTH / 2 + 150, GAME_HEIGHT / 2 - 200, 'btn', playLevelA);
    buttonLevelA.scale.setTo(0.5,0.5);
    buttonLevelA.anchor.setTo(0.5, 0);
    game.add.text(buttonLevelA.centerX, buttonLevelA.centerY-2, textPA, styleTextButtons).anchor.setTo(0.5, 0.5);

    // BUTTON PART B
    let buttonLevelB = game.add.button(GAME_WIDTH / 2+ 150, GAME_HEIGHT / 2 - 100, 'btn', playLevelB);
    buttonLevelB.scale.setTo(0.5,0.5);
    buttonLevelB.anchor.setTo(0.5, 0);
    game.add.text(buttonLevelB.centerX, buttonLevelB.centerY-2, textPB, styleTextButtons).anchor.setTo(0.5, 0.5);

    // BUTTON BACK
    let buttonLevelSelecBack = game.add.button(GAME_WIDTH / 2, GAME_HEIGHT * 0.8, 'btn', goMainMenu);
    buttonLevelSelecBack.scale.setTo(0.5,0.5);
    buttonLevelSelecBack.anchor.setTo(0.5, 0);
    game.add.text(buttonLevelSelecBack.centerX, buttonLevelSelecBack.centerY-2, textBack, styleTextButtons).anchor.setTo(0.5, 0.5);
}

function playLevelA() {
    //setDificulty();
    game.state.start('partA');
}

function playLevelB() {
    //setDificulty();
    game.state.start('partB');
}

function playEasy() {
    buttonEasy.alpha = 0.5;
    buttonMedium.alpha = 1;
    buttonHard.alpha = 1;
    level_dificulty = 'easy';
}

function playMedium() {
    buttonEasy.alpha = 1;
    buttonMedium.alpha = 0.5;
    buttonHard.alpha = 1;
    level_dificulty = 'medium';
}

function playHard() {
    buttonEasy.alpha = 1;
    buttonMedium.alpha = 1;
    buttonHard.alpha = 0.5;
    level_dificulty = 'hard';
}