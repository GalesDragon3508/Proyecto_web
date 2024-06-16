
let instructionsState = {
    create: doInstructions
};

let btnMouse;
let btnKeyboard;
let textShowNPage;
let instructions = [
    "Main objective: buy the all mighty golden axe.\n" +
    "For this, shoot the enemies with your shotgun\n" +
    "while you collect the resources to buy bridges.",

    "Use LMouse to shoot and WASD keys to move.\n"+
    "If you need to recharge, stand on one safe zone and press R.\n" +
    "Killing enemies will have a chance to give you gold.\n" +
    "Press F near a tree to collect wood.",

    "Your HP depends on which difficulty you play\n" +
    "(easy = 5, medium = 3, hard = 1)\n" +
    "If you stay for more then 10 seconds on a safe zone,\n" +
    "you will die due to the character lazyness"
];
let currentInstructionIndex = 0;

function doInstructions() {
    let bg = game.add.image(0, 0, 'bg');
    bg.scale.setTo(0.5,0.5)

    let title = 'INSTRUCTIONS';
    let textBack = 'BACK';
    let textNextPg = '--- >';
    let textLastPg = '< ---';
    let textNPages = nPages.toString();

    let styleTextButtons = {
        fontSize: '28pt',
        font: "Vintage Propagandist Regular",
        fill:'white'
    };

    let styleNPages = {
        fontSize: '28pt',
        font: "Vintage Propagandist Regular",
        fill:'black'
    };

    // Title
    game.add.text(GAME_WIDTH/2, 50, title, {fontSize: '28px', font: "Vintage Propagandist Regular", fill:'black '}).anchor.setTo(0.5,0.5);

    let btnBack = game.add.button(GAME_WIDTH/8, GAME_HEIGHT*0.1, 'btn', goMainMenu);
    let btnNextPg = game.add.button(GAME_WIDTH-150, GAME_HEIGHT*0.9, "btn", NextPage);
    let btnLastPg = game.add.button(GAME_WIDTH/6 , GAME_HEIGHT*0.9, "btn", LastPage);

    btnBack.scale.setTo(0.45,0.45);
    btnNextPg.scale.setTo(0.35,0.35);
    btnLastPg.scale.setTo(0.35,0.35);

    btnBack.anchor.setTo(0.5,0.5);
    btnNextPg.anchor.setTo(0.5,0.5);
    btnLastPg.anchor.setTo(0.5,0.5);

    game.add.text( btnBack.centerX, btnBack.centerY-2, textBack, styleTextButtons).anchor.setTo(0.5,0.5);
    game.add.text( btnNextPg.centerX, btnNextPg.centerY-4, textNextPg, styleTextButtons).anchor.setTo(0.5,0.5);
    game.add.text( btnLastPg.centerX, btnLastPg.centerY-4, textLastPg, styleTextButtons).anchor.setTo(0.5,0.5);
    textShowNPage = game.add.text( GAME_WIDTH/2, btnNextPg.centerY, textNPages, styleNPages);
    textShowNPage.anchor.setTo(0.5, 0.5);
    textShowInstructions = game.add.text(GAME_WIDTH/2, GAME_HEIGHT/2, instructions[currentInstructionIndex], styleNPages);
    textShowInstructions.anchor.setTo(0.5, 0.5);
}

function NextPage(){
    if (nPages<3){
        nPages++;
        textShowNPage.setText(nPages.toString());
    }
    if (currentInstructionIndex < instructions.length - 1) {
        currentInstructionIndex++;
        textShowInstructions.setText(instructions[currentInstructionIndex]);
    }
}
function LastPage(){
    if(nPages>1){
        nPages--;
        textShowNPage.setText(nPages.toString());
    }
    if (currentInstructionIndex > 0) {
        currentInstructionIndex--;
        textShowInstructions.setText(instructions[currentInstructionIndex]);
    }
}