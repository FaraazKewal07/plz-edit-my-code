//creating variables
var PLAY = 1;
 var END = 0;
var gameState = PLAY;

var json, json_running , json_collided;
var pathImg,path,invisiblePath ;


var enemyGroup,enemy1,enemy2,enemy3,enemy4,enemy;
var backgroundImg;
var score = 0;
var jumpSound,collidedSound;

var gameOver, gameOverImg ;
 var restartImg,restart;


function preload(){
backgroundImg = loadImage("background.png");

json_running = loadAnimation ("json1.png","json2.png","json3.png","json4.png","json5.png","json6.png","json7.png");
json_collided = loadAnimation ("jsonfall1.png","jsonfall2.png","jsonfall3.png","jsonfall4.png","jsonfall5.png")

pathImg = loadImage ("path.png");

enemy1 = loadImage("enemy1.png");
enemy2 = loadImage("enemy2.png");
enemy3 = loadImage("enemy3.png");
enemy4 = loadImage("enemy4.png");

gameOverImg = loadImage ("gameOver.png");
restartImg = loadImage ("restart.png");

jumpSound = loadSound("jump.wav");
collidedSound = loadSound("collided.wav");

}

function setup() { 

    createCanvas(windowWidth,windowHeight);

    json = createSprite(300,height-150,20,20);

    json.addAnimation("running", json_running);
    json.addAnimation("collided", json_collided);
    json.setCollider('circle',0,0,150);
    json.scale = 0.200;


    invisiblePath = createSprite(width/2,height-10,width,125);  

    path = createSprite(width/2,height,width,2);
    path.addImage("path",pathImg);
    path.x = width/2
    path.velocityX = -(6 + 3*score/100);

    gameOver = createSprite(width/2,height/2- 50);
    gameOver.addImage(gameOverImg);
    
    restart = createSprite(width/2,height/2);
    restart.addImage(restartImg);
    
    gameOver.scale = 0.5;
    restart.scale = 0.1;
  
    gameOver.visible = false;
    restart.visible = false;

    enemyGroup = new Group();
    
    score = 0;
}
    function draw() {
    background(backgroundImg);
    textSize(20);
    fill("black")
    text("Score: "+ score,30,50);
    
    
    if (gameState===PLAY){
      score = score + Math.round(getFrameRate()/60);
      path.velocityX = -(6 + 3*score/100);
      
      if((touches.length > 0 || keyDown("SPACE")) && json.y  >= height-120) {
        jumpSound.play();
        json.velocityY = -10;
        
      }
      
      json.velocityY = json.velocityY + 0.8
    
      if (path.x < 0){
        path.x = path.width/2;
      }
    
      json.collide(invisiblePath);
      
      spawnEnemy();
    
      if(enemyGroup.isTouching(json)){
          collidedSound.play()
          gameState = END;
      }
    }
    else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
      
      //set velcity of each game object to 0
      path.velocityX = 0;
      json.velocityY = 0;
      enemyGroup.setVelocityXEach(0);
    
      
      //change the trex animation
      json.changeAnimation("collided",json_collided);
      
      //set lifetime of the game objects so that they are never destroyed
      enemyGroup.setLifetimeEach(-1);
     
      
      if(touches.length>0 || keyDown("SPACE")) {      
        reset();
      
      }
    }
    
    
    drawSprites();
  }



  function spawnEnemy() {
    if(frameCount % 60 === 0) {
      var enemy = createSprite(600,height-95,20,30);
      enemy.setCollider('circle',0,0,45)
     
    
      enemy.velocityX = -(6 + 3*score/100);
      
      //generate random obstacles
      var rand = Math.round(random(1,4));
      switch(rand) {
        case 1: enemy.addImage(enemy1);
                break;
        case 2: enemy.addImage(enemy2);
                break;
        case 3: enemy.addImage(enemy3);
                break;
        case 4: enemy.addImage(enemy4);
                break;
        default: break;

      }
      
      //assigning scale and lifetime to the obstacle           
      enemy.scale = 0.3;
      enemy.lifetime = 300;
      enemy.depth = enemy.depth;
      enemy.depth +=1;
      //add each obstacle to the group
      enemyGroup.add(enemy);
    }
  }
  
  function reset(){
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;
    
    enemyGroup.destroyEach();
    
    
    json.changeAnimation("running",json_running);
    
    score = 0;
    
  }

 
