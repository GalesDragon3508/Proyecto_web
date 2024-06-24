const WORLD_WIDTH=3840;
const WORLD_HEIGHT=2160;
const GAME_WIDTH=1000;
const GAME_HEIGHT=700;
let game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.CANVAS, 'projectGameStage');


window.onload = startGame;

function startGame() {
    // Initial Screen
    game.state.add('init', initState);
    //Credits Screen
    game.state.add('credits', creditsState);
    // Instructions Screen
    game.state.add('instructions', instructionsState);
    // Difficult Selection
    game.state.add('difficultSelection', difficultSelection);
    // Part A Screen
    game.state.add('partA', partAState);
    // Part B Screen
    game.state.add('partB', partBState);

    game.state.add('victory', victoryState);

    game.state.add('defeat', defeatState);

    game.state.start('init');
}