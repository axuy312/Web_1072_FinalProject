
//canvas
var ctx,buttonCTX, Player1CTX, P1ScoreCTX, Player2CTX, P2ScoreCTX, timeHeadCTX, timeCTX, topCTX, tipCTX, p1KeyCTX, p2KeyCTX;
var start_point_1P = new Array(2);
var start_point_2P = new Array(2);
var current_position = new Array(2);
var current_position_player2 = new Array(2);
//[y][x][direction] = true / false
var map_connect_data;
//[y][x] = item code
var map_item_data;
//Y_max, X_max
var const_row = 20, const_colume = 30;
var start = false;
//array[const_row][const_colume]
var scoretable;
var score_1P;
var score_2P;
//time
var time;
var endAnimationTime;
var start_time = false;
var timingInterval = null;
//transfer door
var transfer_door_interval = null;
var gererate_transfer_door_times;
//image
var all_images;
//topAnimation
var topAnimationParameter = new Array();
//win
var win = 0;
var nameP1 = "Player1", nameP2 = "Player2";
//data
var move;
var kill;
var changeTime;
var end;

// set map
$(document).ready(function() {
    //change Player1 Name
    $("#buttonCanvas").click(function() {
        return restart();
    });
    //change Player1 Name 
    $("#buttonCanvas").mouseover(function() {
        buttonCTX.fillStyle = "white";
        buttonCTX.fillRect(0,0,$("#buttonCanvas").width(), $("#buttonCanvas").height());
        buttonCTX.fillStyle = "#003C9D";
        buttonCTX.fillText("重新開始", $("#buttonCanvas").width() / 2, $("#buttonCanvas").height() / 2 + 5);
        return;
    });
    $("#buttonCanvas").mouseout(function() {
        buttonCTX.fillStyle = "#003C9D";
        buttonCTX.fillRect(0,0,$("#buttonCanvas").width(), $("#buttonCanvas").height());
        buttonCTX.fillStyle = "white";
        buttonCTX.fillText("重新開始", $("#buttonCanvas").width() / 2, $("#buttonCanvas").height() / 2 + 5);
        return;
    });
    
    
    //effect Player1 Name
    $("#Player1Canvas").click(function() {
        if (start_time)
            return;
        nameP1= prompt("Player1 Name: ", nameP1);
        $("#p1_name").html(nameP1);
        Player1CTX.clearRect(0, 0, $("#Player1Canvas").width(), $("#Player1Canvas").height());
        Player1CTX.fillText(nameP1, $("#Player1Canvas").width() / 2, $("#Player1Canvas").height() / 2);
    });
    //change Player2 Name
    $("#Player2Canvas").click(function() {
        if (start_time)
            return;
        nameP2= prompt("Player2 Name: ", nameP2);
        $("#p2_name").html(nameP2);
        Player2CTX.clearRect(0, 0, $("#Player2Canvas").width(), $("#Player2Canvas").height());
        Player2CTX.fillText(nameP2, $("#Player2Canvas").width() / 2, $("#Player2Canvas").height() / 2);
    });
    //effect Player1 Name
    $("#Player1Canvas").mouseover(function() {
        Player1CTX.clearRect(0, 0, $("#Player1Canvas").width(), $("#Player1Canvas").height());
        Player1CTX.fillStyle = "red";
        Player1CTX.fillText(nameP1, $("#Player1Canvas").width() / 2, $("#Player1Canvas").height() / 2 + 8);
    });
    $("#Player1Canvas").mouseout(function() {
        Player1CTX.clearRect(0, 0, $("#Player1Canvas").width(), $("#Player1Canvas").height());
        Player1CTX.clearRect(0, 0, $("#Player1Canvas").width(), $("#Player1Canvas").height());
        Player1CTX.fillStyle = "white";
        Player1CTX.fillText(nameP1, $("#Player1Canvas").width() / 2, $("#Player1Canvas").height() / 2 + 8);
    });
    //effect Player2 Name
    $("#Player2Canvas").mouseover(function() {
        Player2CTX.clearRect(0, 0, $("#Player1Canvas").width(), $("#Player1Canvas").height());
        Player2CTX.fillStyle = "blue";
        Player2CTX.fillText(nameP2, $("#Player2Canvas").width() / 2, $("#Player2Canvas").height() / 2 + 8);
    });
    $("#Player2Canvas").mouseout(function() {
        Player2CTX.clearRect(0, 0, $("#Player1Canvas").width(), $("#Player1Canvas").height());
        Player2CTX.fillStyle = "white";
        Player2CTX.fillText(nameP2, $("#Player2Canvas").width() / 2, $("#Player2Canvas").height() / 2 + 8);
    });
    $("#TimeCanvas").click(function() {
        if (start_time || end)
            return;
        if (!changeTime){
            timeCTX.fillStyle="black";
            timeCTX.fillRect(0,0,150, 70);
            timeCTX.fillStyle = "#D549EE";
            timeCTX.fillText(time, $("#TimeCanvas").width() / 2, $("#TimeCanvas").height() / 2 + 20);
        }
        else{
            timeCTX.fillStyle="black";
            timeCTX.fillRect(0,0,150, 70);
            timeCTX.fillStyle = "white";
            timeCTX.fillText(time, $("#TimeCanvas").width() / 2, $("#TimeCanvas").height() / 2 + 20);
        }
        changeTime = !changeTime;
    });
    ready();
});

function ready(){
    time = 60;
    reload_mapData();
    generateMap();
    canvasReload();
}

//Generate Map-------------------------------------------------------------------------------------------------------------------------------------------------------

function reload_mapData(){
    changeTime = false;
    end = false;
    //map_connect_data[][][]  = 0 -> false
    map_connect_data = new Array(const_row);
    for (var i = 0; i < const_row; i++){
        map_connect_data[i] = new Array(const_colume);
        for (var j = 0; j < const_colume; j++){
            map_connect_data[i][j] = new Array(4);
            for (var c = 0; c < 4; c++){
                map_connect_data[i][j][c] = false;
            }
        }
    }
    
    //initial score
    scoretable = new Array(const_row);
    for (var i = 0; i < const_row; i++){
        scoretable[i] = new Array(const_colume);
        for (var j = 0; j < const_colume; j++){
            scoretable[i][j] = 0;
        }
    }
    score_1P = 1;
    score_2P = 1;
    
    //initial map_item_data
    map_item_data = new Array(const_row);
    for (var i = 0; i < const_row; i++){
        map_item_data[i] = new Array(const_colume);
        for (var j = 0; j < const_colume; j++){
            scoretable[i][j] = 0;
        }
    }
    
    //img
    all_images = new Array(10);
    all_images[5] = new Image();
    all_images[5].src = "game/images/transferDoor.PNG"
    
    //topAnimationParameter
    topAnimationParameter[0] = 0;
    topAnimationParameter[1] = 0;
    topAnimationParameter[4] = 130;//p2 Y
    topAnimationParameter[5] = 1040;//p2 X
    topAnimationParameter[2] = null;
    topAnimationParameter[3] = null;
    
    move = new Array(3);
    move[1] = 0;
    move[2] = 0;
    kill = new Array(3);
    kill[1] = 0;
    kill[2] = 0;
}

function int_reverse_direction(direction){
    switch (direction){
        case 0:
            return 1;
        break;
        case 1:
            return 0;
        break;
        case 2:
            return 3;
        break;
        case 3:
            return 2;
        break;
    }
}
            
function finishMap(available_position){
    for(var i = 0; i < const_row; i++){
        for(var j = 0; j < const_colume; j++){
            if (available_position[i][j])
                return false;
        }
    }
    return true;
}

function generateMap(){
    ctx = $("#myCanvas")[0].getContext("2d");
    ctx.fillStyle="black";
    ctx.fillRect(0,0,1055, 705);
    var direction;
    var map_current_position = new Array(2);
    var system_generate_route = new Array();
    var available_position = new Array(const_row);
    var timeout = 1;
    var available_direction = new Array(4);
    
    //map_current_position[] -> random{Y, X}
    map_current_position[0] = Math.floor(Math.random() * const_row / 2);
    map_current_position[1] = Math.floor(Math.random() * const_colume / 2);
    
    //current_position[](Y,X)
    current_position[0] = map_current_position[0];
    current_position[1] = map_current_position[1];
    
    //current_position_player2[](Y,X)
    current_position_player2[0] = Math.floor(const_row / 2 + Math.random() * const_row / 2);
    current_position_player2[1] = Math.floor(const_colume / 2 + Math.random() * const_colume / 2);
    
    //start_point
    start_point_1P[0] = current_position[0];
    start_point_1P[1] = current_position[1];
    start_point_2P[0] = current_position_player2[0];
    start_point_2P[1] = current_position_player2[1];
    
    //available_position[][] -> true
    for (var i = 0; i < const_row; i++){
        available_position[i] = new Array(const_colume);
        for (var j = 0; j < const_colume; j++){
            available_position[i][j] = true;
        }
    }
    
    //score table
    scoretable[current_position[0]][current_position[1]] = 1;
    scoretable[current_position_player2[0]][current_position_player2[1]] = 2;
    
    
    available_position[current_position[0]][current_position[1]] = false;
    
    //run
    while(!finishMap(available_position)){
        //available_direction
        for (var i = 0; i < 4; i++)
            available_direction[i] = true;
        
        while(true){
            direction = Math.floor(Math.random() * 4);
            //alert("X: "+map_current_position[1]+" Y: "+map_current_position[0]+"dir: "+direction);
            if (!generate_validRoute(system_generate_route, available_position, map_current_position, direction)){
                //alert("fault");
                available_direction[direction] = false;
            }
            else
                break;
            if (!available_direction[0] && !available_direction[1] && !available_direction[2] && !available_direction[3])
                break;
        }
        
        if(!available_direction[0] && !available_direction[1] && !available_direction[2] && !available_direction[3]){
            //unavailable_position
            available_position[map_current_position[0]][map_current_position[1]] = false;
            //draw
            setTimeout(drawRect, 50*timeout+50, ctx, 5+35*map_current_position[1], 5+map_current_position[0]*35, 35+map_current_position[1]*35, 35+map_current_position[0]*35, 5, "white");
            //backward
            backwardPosition(map_current_position, system_generate_route[system_generate_route.length - 1]);
            //pop route(0,1,2,3)
            system_generate_route.pop();
         }
        else{
            //A->B
            map_connect_data[map_current_position[0]][map_current_position[1]][direction] = true;
            //push route(0,1,2,3)
            system_generate_route.push(direction);
            //draw
            setTimeout(drawRect, 50*timeout++, ctx, 5+35*map_current_position[1], 5+map_current_position[0]*35, 35+map_current_position[1]*35, 35+map_current_position[0]*35, direction, "white");
            //forward
            forwardPosition(map_current_position, direction);
            //B->A
            map_connect_data[map_current_position[0]][map_current_position[1]][int_reverse_direction(direction)] = true;
        }
    }
    
    //start setTimeout
    setTimeout(function(){start = true}, 50*timeout+100);
    
    //draw player1
    setTimeout(drawRect, 50, ctx, 5+35*current_position[1], 5+current_position[0]*35, 35+current_position[1]*35, 35+current_position[0]*35, 4, "red");
    
    //draw player2
    setTimeout(drawRect, 50*timeout+50, ctx, 5+35*current_position_player2[1], 5+current_position_player2[0]*35, 35+current_position_player2[1]*35, 35+current_position_player2[0]*35, 4, "blue");
}

function canvasReload(){
    p1KeyCTX = $("#P1KeyCanvas")[0].getContext("2d");
    p1KeyCTX.font="50px Comic Sans MS";
    p1KeyCTX.fillStyle = "#003C9D";
    p1KeyCTX.textAlign = "center";
    p1KeyCTX.fillText("W", $("#P1KeyCanvas").width() / 2, $("#P1KeyCanvas").height() / 2 - 20);
    p1KeyCTX.fillText("A", $("#P1KeyCanvas").width() / 2 - 60, $("#P1KeyCanvas").height() / 2 + 40);
    p1KeyCTX.fillText("S", $("#P1KeyCanvas").width() / 2, $("#P1KeyCanvas").height() / 2 + 40);
    p1KeyCTX.fillText("D", $("#P1KeyCanvas").width() / 2 + 60, $("#P1KeyCanvas").height() / 2 + 40);
    
    p2KeyCTX = $("#P2KeyCanvas")[0].getContext("2d");
    p2KeyCTX.font="50px Comic Sans MS";
    p2KeyCTX.fillStyle = "#003C9D";
    p2KeyCTX.textAlign = "center";
    p2KeyCTX.fillText("I", $("#P2KeyCanvas").width() / 2, $("#P2KeyCanvas").height() / 2 - 20);
    p2KeyCTX.fillText("J", $("#P2KeyCanvas").width() / 2 - 60, $("#P2KeyCanvas").height() / 2 + 40);
    p2KeyCTX.fillText("K", $("#P2KeyCanvas").width() / 2, $("#P2KeyCanvas").height() / 2 + 40);
    p2KeyCTX.fillText("L", $("#P2KeyCanvas").width() / 2 + 60, $("#P2KeyCanvas").height() / 2 + 40);
    
    buttonCTX = $("#buttonCanvas")[0].getContext("2d");
    buttonCTX.fillStyle = "#003C9D";
    buttonCTX.fillRect(0,0,$("#buttonCanvas").width(), $("#buttonCanvas").height());
    buttonCTX.font="20px Comic Sans MS";
    buttonCTX.fillStyle = "white";
    buttonCTX.textAlign = "center";
    buttonCTX.fillText("重新開始", $("#buttonCanvas").width() / 2, $("#buttonCanvas").height() / 2 + 5);
    
    tipCTX = $("#TipCanvas")[0].getContext("2d");
    
    Player1CTX = $("#Player1Canvas")[0].getContext("2d");
    Player1CTX.fillStyle="black";
    Player1CTX.fillRect(0,0,200, 30);
    
    P1ScoreCTX = $("#P1ScoreCanvas")[0].getContext("2d");
    P1ScoreCTX.fillStyle="black";
    P1ScoreCTX.fillRect(0,0,200, 70);
    
    Player2CTX = $("#Player2Canvas")[0].getContext("2d");
    Player2CTX.fillStyle="black";
    Player2CTX.fillRect(0,0,200, 30);
    
    P2ScoreCTX = $("#P2ScoreCanvas")[0].getContext("2d");
    P2ScoreCTX.fillStyle="black";
    P2ScoreCTX.fillRect(0,0,200, 70);
    
    timeHeadCTX = $("#TimeHeadCanvas")[0].getContext("2d");
    timeHeadCTX.fillStyle="black";
    timeHeadCTX.fillRect(0,0,150, 30);
    
    timeCTX = $("#TimeCanvas")[0].getContext("2d");
    timeCTX.fillStyle="black";
    timeCTX.fillRect(0,0,150, 70);
    
    topCTX = $("#TopCanvas")[0].getContext("2d");
    topCTX.fillStyle="black";
    topCTX.fillRect(0,0,1055, 150);
    topCTX.fillStyle="white";
    topCTX.fillRect(0,130,1044, 5);
    
    
    Player1CTX.font="27px Comic Sans MS";
    Player1CTX.fillStyle = "white";
    Player1CTX.textAlign = "center";
    Player1CTX.fillText(nameP1, $("#Player1Canvas").width() / 2, $("#Player1Canvas").height() / 2+8);
    
    P1ScoreCTX.font="40px Comic Sans MS";
    P1ScoreCTX.fillStyle = "white";
    P1ScoreCTX.textAlign = "center";
    P1ScoreCTX.fillText(score_1P, $("#P1ScoreCanvas").width() / 2, $("#P1ScoreCanvas").height() / 2+5);
    
    Player2CTX.font="27px Comic Sans MS";
    Player2CTX.fillStyle = "white";
    Player2CTX.textAlign = "center";
    Player2CTX.fillText(nameP2, $("#Player2Canvas").width() / 2, $("#Player2Canvas").height() / 2+8);
    
    P2ScoreCTX.font="40px Comic Sans MS";
    P2ScoreCTX.fillStyle = "white";
    P2ScoreCTX.textAlign = "center";
    P2ScoreCTX.fillText(score_2P, $("#P2ScoreCanvas").width() / 2, $("#P2ScoreCanvas").height() / 2+5);
    
    timeHeadCTX.font="20px Comic Sans MS";
    timeHeadCTX.fillStyle = "white";
    timeHeadCTX.textAlign = "center";
    timeHeadCTX.fillText("T I M E", $("#TimeHeadCanvas").width() / 2, $("#TimeHeadCanvas").height() / 2);
    
    timeCTX.font="50px Comic Sans MS";
    timeCTX.fillStyle = "white";
    timeCTX.textAlign = "center";
    timeCTX.fillText(time, $("#TimeCanvas").width() / 2, $("#TimeCanvas").height() / 2 + 20);
    
}

function generate_validRoute(route, available_position, map_current_position, direction){
    var next_position = new Array(2);
    next_position[0] = map_current_position[0];
    next_position[1] = map_current_position[1];
    forwardPosition(next_position, direction);
    
    //out of map
    if (next_position[0] < 0 || next_position[1] < 0 || next_position[0] >= const_row || next_position[1] >= const_colume)
        return false;
    
    //unavailable_position
    if (!available_position[next_position[0]][next_position[1]])
        return false;
    
    //repeat route
    var temp_position = new Array(2);
    temp_position[0] = current_position[0];
    temp_position[1] = current_position[1];
    for (var i = 0; i < route.length; i++){
        if (temp_position[0] == next_position[0] && temp_position[1] == next_position[1])
            return false;
        forwardPosition(temp_position, route[i]);
    }
    
    return true;
}

//Draw---------------------------------------------------------------------------------------------------------------------------------------------------------------

function drawRect(functionCTX, x1, y1, x2, y2, direction, color){
    functionCTX.fillStyle=color;
    if (direction == 0)
        functionCTX.fillRect(x1,y1 - 5,x2 - x1, y2 - y1 + 5);
    else if (direction == 1)
        functionCTX.fillRect(x1,y1,x2 - x1, y2 - y1 + 5);
    else if (direction == 2)
        functionCTX.fillRect(x1 - 5,y1,x2 - x1 + 5, y2 - y1);
    else if (direction == 3)
        functionCTX.fillRect(x1,y1,x2 - x1 + 5, y2 - y1);
    else
        functionCTX.fillRect(x1,y1,x2 - x1, y2 - y1);
}
 
function drawCircle(x, y, r, color){
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.fill();
}

//Move Position------------------------------------------------------------------------------------------------------------------------------------------------------
    
function forwardPosition(position, direction){
    if (direction == 0)//up
        position[0] -= 1;
    else if (direction == 1)//down
        position[0] += 1;
    else if (direction == 2)//left
        position[1] -= 1;
    else if (direction == 3)//right
        position[1] += 1;
    return position;
}

function backwardPosition(position, direction){
    if (direction == 0)//up
        position[0] += 1;
    else if (direction == 1)//down
        position[0] -= 1;
    else if (direction == 2)//left
        position[1] += 1;
    else if (direction == 3)//right
        position[1] -= 1;
    return position;
}


//timing-------------------------------------------------------------------------------------------------------------------------------------------------------------

function timing(){
    if (time == 0){
        clearInterval(timingInterval);
        timingInterval = null;
        //P1
        $("#player1_die_num").html("死亡次數 : " + kill[2]);
        $("#player1_kill_num").html("擊殺次數 : " + kill[1]);
        if ((kill[1] + kill[2]) == 0)
            $("#player1_kill_rate").html("擊殺率 : " + 0.0 + "%");
        else
            $("#player1_kill_rate").html("擊殺率 : " + kill[1] * 100 / (kill[1] + kill[2]) + "%");
        $("#player1_move_num").html("移動步數 : " + move[1]);
        $("#player1_score_num").html("格子數 : " + score_1P);
        
        //P2
        $("#player2_die_num").html("死亡次數 : " + kill[1]);
        $("#player2_kill_num").html("擊殺次數 : " + kill[2]);
        if ((kill[1] + kill[2]) == 0)
            $("#player2_kill_rate").html("擊殺率 : " + 0.0 + "%");
        else
            $("#player2_kill_rate").html("擊殺率 : " + kill[2] * 100 / (kill[1] + kill[2]) + "%");
        $("#player2_move_num").html("移動步數 : " + move[2]);
        $("#player2_score_num").html("格子數 : " + score_2P);
        return;
    }
    time = time - 1;
    //time canvas
    timeCTX.clearRect(0, 0, $("#TimeCanvas").width(), $("#TimeCanvas").height());
    timeCTX.fillText(time, $("#TimeCanvas").width() / 2, $("#TimeCanvas").height() / 2 + 20);
    tipCTX.font="80px Comic Sans MS";
    tipCTX.fillStyle = "red";
    tipCTX.textAlign = "center";
    if (time == 0){
        if (score_1P > score_2P){
            win = 1;
        }
        else if (score_1P < score_2P){
            win = 2;
        }
        else{
            win = 3;
            topAnimationParameter[6] = 2200;
        }
        clearInterval(topAnimationParameter[2]);
        topAnimationParameter[2] = null;
        topAnimationParameter[2] = setInterval("topAnimation()", 2);
        tipCTX.fillText("TIME'S UP", $("#TipCanvas").width() / 2, $("#TipCanvas").height() / 2);
        start_time = false;
     }
    else if (time == 1){
        tipCTX.fillText("1", $("#TipCanvas").width() / 2, $("#TipCanvas").height() / 2);
        setTimeout(cleanTipCanvas, 990)
     }
    else if (time == 2){
        tipCTX.fillText("2", $("#TipCanvas").width() / 2, $("#TipCanvas").height() / 2);
        setTimeout(cleanTipCanvas, 800);
     }
    else if (time == 3){
        tipCTX.fillText("3", $("#TipCanvas").width() / 2, $("#TipCanvas").height() / 2);
        setTimeout(cleanTipCanvas, 650);
     }
    else if (time == 4){
        tipCTX.fillText("4", $("#TipCanvas").width() / 2, $("#TipCanvas").height() / 2);
        setTimeout(cleanTipCanvas, 550);
     }
    else if (time == 5){
        tipCTX.fillText("5", $("#TipCanvas").width() / 2, $("#TipCanvas").height() / 2);
        setTimeout(cleanTipCanvas, 500);
     }
}

function cleanTipCanvas(){
    tipCTX.clearRect(0, 0, $("#TipCanvas").width(), $("#TipCanvas").height());
}

//calculate score----------------------------------------------------------------------------------------------------------------------------------------------------

function calculateScore(y, x, change){
    switch(change){
        case scoretable[y][x]:
            return;
            break;
        case 1:
            if (scoretable[y][x] == 2)
                score_2P = score_2P - 1;
            score_1P = score_1P + 1;
            break;
        case 2:
            if (scoretable[y][x] == 1)
                score_1P = score_1P - 1;
            score_2P = score_2P + 1;
            break;
}
}

//generate transfer door---------------------------------------------------------------------------------------------------------------------------------------------
function generateTransferDoor(){
    var x, y;
    if (time == 0){
        clearInterval(transfer_door_interval);
        transfer_door_interval = null;
        return;
    }
    //gererate_transfer_door_times = gererate_transfer_door_times - 1;
    while (true){
        x = Math.floor(Math.random() * const_colume);
        y = Math.floor(Math.random() * const_row);
        if (x == 0 || y == 0 || x == const_colume - 1 || y == const_row - 1){}
        else if ( !((start_point_1P[0] == y && start_point_1P[1] == x) || (start_point_2P[0] == y && start_point_2P[1] == x) || (map_item_data[y][x] == 1) ||                       (map_item_data[y][x] == 2) || (map_item_data[y][x] == 5)) )
        {
            ctx.drawImage(all_images[5],0,0,300,300, 5+35*x, 5+y*35, 30, 30);
            map_item_data[y][x] = 5;
            return;
        }
    }
}

//restart------------------------------------------------------------------------------------------------------------------------------------------------------------
function restart(){
    if (!end){
        return;
    }
    ctx.clearRect(0, 0, $("#myCanvas").width(), $("#myCanvas").height());
    Player1CTX.clearRect(0, 0, $("#Player1Canvas").width(), $("#Player1Canvas").height());
    P1ScoreCTX.clearRect(0, 0, $("#P1ScoreCanvas").width(), $("#P1ScoreCanvas").height());
    Player2CTX.clearRect(0, 0, $("#Player2Canvas").width(), $("#Player2Canvas").height());
    P2ScoreCTX.clearRect(0, 0, $("#P2ScoreCanvas").width(), $("#P2ScoreCanvas").height());
    timeHeadCTX.clearRect(0, 0, $("#TimeHeadCanvas").width(), $("#TimeHeadCanvas").height());
    timeCTX.clearRect(0, 0, $("#TimeCanvas").width(), $("#TimeCanvas").height());
    topCTX.clearRect(0, 0, $("#TopCanvas").width(), $("#TopCanvas").height());
    tipCTX.clearRect(0, 0, $("#TipCanvas").width(), $("#TipCanvas").height());
    ctx = null;
    Player1CTX = null;
    P1ScoreCTX = null;
    Player2CTX = null;
    P2ScoreCTX = null;
    timeHeadCTX = null;
    timeCTX = null;
    topCTX = null;
    tipCTX = null;
    start = false;
    end = false;
    start_time = false;
    score_1P = 1;
    score_2P = 1;
    ready();
}

//top run
function topAnimation(){
    
    if (time == 0 && ( (win == 1 && topAnimationParameter[0] == 0 && topAnimationParameter[1] == 330 && topAnimationParameter[4] == 130)
                        || (win == 2 && topAnimationParameter[0] == 130 && topAnimationParameter[1] == 710 && topAnimationParameter[4] == 0) 
                        || (win == 3))){
        clearInterval(topAnimationParameter[2]);
        topAnimationParameter[2] = null;
        topAnimationParameter[3] = setInterval("finishAnimation()", 0.01);
        return;
    }
    
    if (topAnimationParameter[0] == 0 && topAnimationParameter[1] < 1040){
            topAnimationParameter[1]++;
        }
    else if (topAnimationParameter[0] == 130 && topAnimationParameter[1] > 0){
            topAnimationParameter[1]--;
        }
    else if (topAnimationParameter[0] < 130 && topAnimationParameter[1] == 1040){
            topAnimationParameter[0]++;
        }
    else if (topAnimationParameter[0] > 0 && topAnimationParameter[1] == 0){
            topAnimationParameter[0]--;
        }
    
    drawRect(topCTX, topAnimationParameter[1], topAnimationParameter[0], topAnimationParameter[1] + 5, topAnimationParameter[0] + 5, 4, "white");
    
    if (topAnimationParameter[4] == 0 && topAnimationParameter[5] < 1040){
            topAnimationParameter[5]++;
        }
    else if (topAnimationParameter[4] == 130 && topAnimationParameter[5] > 0){
            topAnimationParameter[5]--;
        }
    else if (topAnimationParameter[4] < 130 && topAnimationParameter[5] == 1040){
            topAnimationParameter[4]++;
        }
    else if (topAnimationParameter[4] > 0 && topAnimationParameter[5] == 0){
            topAnimationParameter[4]--;
        }
    
    drawRect(topCTX, topAnimationParameter[5], topAnimationParameter[4], topAnimationParameter[5] + 5, topAnimationParameter[4] + 5, 4, "black");
}

function finishAnimation(){
    end = true
    if (win == 1){
        if (topAnimationParameter[0] < 130){
            topAnimationParameter[0]++;
            drawRect(topCTX, topAnimationParameter[1], topAnimationParameter[0], topAnimationParameter[1] + 5, topAnimationParameter[0] + 5, 4, "white");
        }
        if (topAnimationParameter[5] > 335){
            topAnimationParameter[5]--;
            drawRect(topCTX, topAnimationParameter[5], topAnimationParameter[4], topAnimationParameter[5] + 5, topAnimationParameter[4] + 5, 4, "black");
        }
        else{
            P1ScoreCTX.clearRect(0, 0, $("#P1ScoreCanvas").width(), $("#P1ScoreCanvas").height());
            P1ScoreCTX.font="40px Comic Sans MS";
            P1ScoreCTX.fillText("W i n !", $("#P1ScoreCanvas").width() / 2, $("#P1ScoreCanvas").height() / 2+5);
            win = 0;
        }
    }   
    else if(win == 2){
        if (topAnimationParameter[0] > 0){
            topAnimationParameter[0]--;
            drawRect(topCTX, topAnimationParameter[1], topAnimationParameter[0], topAnimationParameter[1] + 5, topAnimationParameter[0] + 5, 4, "white");
        }
        if (topAnimationParameter[5] < 705){
            topAnimationParameter[5]++;
            drawRect(topCTX, topAnimationParameter[5], topAnimationParameter[4], topAnimationParameter[5] + 5, topAnimationParameter[4] + 5, 4, "black");
        }
        else{
            P2ScoreCTX.clearRect(0, 0, $("#P2ScoreCanvas").width(), $("#P2ScoreCanvas").height());
            P2ScoreCTX.font="40px Comic Sans MS";
            P2ScoreCTX.fillText("W i n !", $("#P2ScoreCanvas").width() / 2, $("#P2ScoreCanvas").height() / 2+5);
            win = 0;
        }
    }
    else if(win == 3){
        //alert(topAnimationParameter[6]);
        if (topAnimationParameter[0] == 0 && topAnimationParameter[1] < 1040){
            topAnimationParameter[1]++;
        }
        else if (topAnimationParameter[0] == 130 && topAnimationParameter[1] > 0){
            topAnimationParameter[1]--;
        }
        else if (topAnimationParameter[0] < 130 && topAnimationParameter[1] == 1040){
            topAnimationParameter[0]++;
        }
        else if (topAnimationParameter[0] > 0 && topAnimationParameter[1] == 0){
            topAnimationParameter[0]--;
        }
        drawRect(topCTX, topAnimationParameter[1], topAnimationParameter[0], topAnimationParameter[1] + 5, topAnimationParameter[0] + 5, 4, "white");
        if (topAnimationParameter[6]-- == 0){
            timeHeadCTX.clearRect(0, 0, $("#TimeHeadCanvas").width(), $("#TimeHeadCanvas").height());
            timeCTX.clearRect(0, 0, $("#TimeCanvas").width(), $("#TimeCanvas").height());
            timeCTX.font="40px Comic Sans MS";
            timeCTX.fillText("FLAT!", $("#TimeCanvas").width() / 2, $("#TimeCanvas").height() / 2 + 20);
            win = 0;
        }
    }
    else{
        clearInterval(topAnimationParameter[3]);
        topAnimationParameter[3] = null;
    }
}

//KeyDown------------------------------------------------------------------------------------------------------------------------------------------------------------

$(document).keydown(function(event) {
    
    if (!start || time == 0 || changeTime)
        return;
    else if (!start_time){
        start_time = true;
        timingInterval = setInterval("timing()", 1000);
        drawRect(topCTX, topAnimationParameter[1], topAnimationParameter[0], topAnimationParameter[1] + 5, topAnimationParameter[0] + 5, 4, "white");
        drawRect(topCTX, topAnimationParameter[5], topAnimationParameter[4], topAnimationParameter[5] + 5, topAnimationParameter[4] + 5, 4, "black");
        topAnimationParameter[2] = setInterval("topAnimation()", 20);
        gererate_transfer_door_times = 5;
        transfer_door_interval = setInterval(generateTransferDoor, time * 1000 / 5);
    }
    
    switch(event.which){
        case 65://left
            if (map_connect_data[current_position[0]][current_position[1]][2]){
                move[1]++;
                map_item_data[current_position[0]][current_position[1]] = 0;
                drawRect(ctx, 0+35*current_position[1], 5+current_position[0]*35, 35+current_position[1]*35, 35+current_position[0]*35, 4, "skyblue");
                ////drawCircle(20+35*current_position[1], 20+current_position[0]*35, 5, "white");
                if (current_position_player2[0] == current_position[0] && current_position_player2[1] == current_position[1]){
                    drawRect(ctx, 5+35*current_position_player2[1], 5+current_position_player2[0]*35, 35+current_position_player2[1]*35, 35+current_position_player2[0]*35, 4, "blue");
                }
                forwardPosition(current_position, 2);
                if (current_position[0] == current_position_player2[0] && current_position[1] == current_position_player2[1]){
                    kill[1]++;
                    current_position_player2[0] = start_point_2P[0];
                    current_position_player2[1] = start_point_2P[1];
                    drawRect(ctx, 5+35*current_position_player2[1], 5+current_position_player2[0]*35, 35+current_position_player2[1]*35, 35+current_position_player2[0]*35, 4, "blue");
                }
                drawRect(ctx, 5+35*current_position[1], 5+current_position[0]*35, 35+current_position[1]*35, 35+current_position[0]*35, 4, "red");
            }
            else
                return;
            break;
        case 87://up
            if (map_connect_data[current_position[0]][current_position[1]][0]){
                move[1]++;
                map_item_data[current_position[0]][current_position[1]] = 0;
                drawRect(ctx, 5+35*current_position[1], 0+current_position[0]*35, 35+current_position[1]*35, 35+current_position[0]*35, 4, "skyblue");
                //drawCircle(20+35*current_position[1], 20+current_position[0]*35, 5, "white");
                if (current_position_player2[0] == current_position[0] && current_position_player2[1] == current_position[1]){
                    drawRect(ctx, 5+35*current_position_player2[1], 5+current_position_player2[0]*35, 35+current_position_player2[1]*35, 35+current_position_player2[0]*35, 4, "blue");
                }
                forwardPosition(current_position, 0);
                if (current_position[0] == current_position_player2[0] && current_position[1] == current_position_player2[1]){
                    kill[1]++;
                    current_position_player2[0] = start_point_2P[0];
                    current_position_player2[1] = start_point_2P[1];
                    drawRect(ctx, 5+35*current_position_player2[1], 5+current_position_player2[0]*35, 35+current_position_player2[1]*35, 35+current_position_player2[0]*35, 4, "blue");
                }
                drawRect(ctx, 5+35*current_position[1], 5+current_position[0]*35, 35+current_position[1]*35, 35+current_position[0]*35, 4, "red");
            }
            break;
        case 68://right
            if (map_connect_data[current_position[0]][current_position[1]][3]){
                move[1]++;
                map_item_data[current_position[0]][current_position[1]] = 0;
                drawRect(ctx, 5+35*current_position[1], 5+current_position[0]*35, 40+current_position[1]*35, 35+current_position[0]*35, 4, "skyblue");
                //drawCircle(20+35*current_position[1], 20+current_position[0]*35, 5, "white");
                if (current_position_player2[0] == current_position[0] && current_position_player2[1] == current_position[1]){
                    drawRect(ctx, 5+35*current_position_player2[1], 5+current_position_player2[0]*35, 35+current_position_player2[1]*35, 35+current_position_player2[0]*35, 4, "blue");
                }
                forwardPosition(current_position, 3);
                if (current_position[0] == current_position_player2[0] && current_position[1] == current_position_player2[1]){
                    kill[1]++;
                    current_position_player2[0] = start_point_2P[0];
                    current_position_player2[1] = start_point_2P[1];
                    drawRect(ctx, 5+35*current_position_player2[1], 5+current_position_player2[0]*35, 35+current_position_player2[1]*35, 35+current_position_player2[0]*35, 4, "blue");
                }
                drawRect(ctx, 5+35*current_position[1], 5+current_position[0]*35, 35+current_position[1]*35, 35+current_position[0]*35, 4, "red");
            }
            else
                return;
            break;
        case 83://down
            if (map_connect_data[current_position[0]][current_position[1]][1]){
                move[1]++;
                map_item_data[current_position[0]][current_position[1]] = 0;
                drawRect(ctx, 5+35*current_position[1], 5+current_position[0]*35, 35+current_position[1]*35, 40+current_position[0]*35, 4, "skyblue");
                //drawCircle(20+35*current_position[1], 20+current_position[0]*35, 5, "white");
                if (current_position_player2[0] == current_position[0] && current_position_player2[1] == current_position[1]){
                    drawRect(ctx, 5+35*current_position_player2[1], 5+current_position_player2[0]*35, 35+current_position_player2[1]*35, 35+current_position_player2[0]*35, 4, "blue");
                }
                forwardPosition(current_position, 1);
                if (current_position[0] == current_position_player2[0] && current_position[1] == current_position_player2[1]){
                    kill[1]++;
                    current_position_player2[0] = start_point_2P[0];
                    current_position_player2[1] = start_point_2P[1];
                    drawRect(ctx, 5+35*current_position_player2[1], 5+current_position_player2[0]*35, 35+current_position_player2[1]*35, 35+current_position_player2[0]*35, 4, "blue");
                }
                drawRect(ctx, 5+35*current_position[1], 5+current_position[0]*35, 35+current_position[1]*35, 35+current_position[0]*35, 4, "red");
            }
            else
                return;
            break;
            
            
        case 74://left
            if (map_connect_data[current_position_player2[0]][current_position_player2[1]][2]){
                move[2]++;
                map_item_data[current_position_player2[0]][current_position_player2[1]] = 0;
                drawRect(ctx, 0+35*current_position_player2[1], 5+current_position_player2[0]*35, 35+current_position_player2[1]*35, 35+current_position_player2[0]*35, 4, "pink");
                //drawCircle(20+35*current_position_player2[1], 20+current_position_player2[0]*35, 5, "white");
                if (current_position[0] == current_position_player2[0] && current_position[1] == current_position_player2[1]){
                    drawRect(ctx, 5+35*current_position[1], 5+current_position[0]*35, 35+current_position[1]*35, 35+current_position[0]*35, 4, "red");
                }
                forwardPosition(current_position_player2, 2);
                if (current_position[0] == current_position_player2[0] && current_position[1] == current_position_player2[1]){
                    kill[2]++;
                    current_position[0] = start_point_1P[0];
                    current_position[1] = start_point_1P[1];
                    drawRect(ctx, 5+35*current_position[1], 5+current_position[0]*35, 35+current_position[1]*35, 35+current_position[0]*35, 4, "red");
                }
                drawRect(ctx, 5+35*current_position_player2[1], 5+current_position_player2[0]*35, 35+current_position_player2[1]*35, 35+current_position_player2[0]*35, 4, "blue");
            }
            else
                return;
            break;
        case 73://up
            if (map_connect_data[current_position_player2[0]][current_position_player2[1]][0]){
                move[2]++;
                map_item_data[current_position_player2[0]][current_position_player2[1]] = 0;
                drawRect(ctx, 5+35*current_position_player2[1], 0+current_position_player2[0]*35, 35+current_position_player2[1]*35, 35+current_position_player2[0]*35, 4, "pink");
                //drawCircle(20+35*current_position_player2[1], 20+current_position_player2[0]*35, 5, "white");
                if (current_position[0] == current_position_player2[0] && current_position[1] == current_position_player2[1]){
                    drawRect(ctx, 5+35*current_position[1], 5+current_position[0]*35, 35+current_position[1]*35, 35+current_position[0]*35, 4, "red");
                }
                forwardPosition(current_position_player2, 0);
                if (current_position[0] == current_position_player2[0] && current_position[1] == current_position_player2[1]){
                    kill[2]++;
                    current_position[0] = start_point_1P[0];
                    current_position[1] = start_point_1P[1];
                    drawRect(ctx, 5+35*current_position[1], 5+current_position[0]*35, 35+current_position[1]*35, 35+current_position[0]*35, 4, "red");
                }
                drawRect(ctx, 5+35*current_position_player2[1], 5+current_position_player2[0]*35, 35+current_position_player2[1]*35, 35+current_position_player2[0]*35, 4, "blue");
            }
            else
                return;
            break;
        case 76://right
            if (map_connect_data[current_position_player2[0]][current_position_player2[1]][3]){
                move[2]++;
                map_item_data[current_position_player2[0]][current_position_player2[1]] = 0;
                drawRect(ctx, 5+35*current_position_player2[1], 5+current_position_player2[0]*35, 40+current_position_player2[1]*35, 35+current_position_player2[0]*35, 4, "pink");
                //drawCircle(20+35*current_position_player2[1], 20+current_position_player2[0]*35, 5, "white");
                if (current_position[0] == current_position_player2[0] && current_position[1] == current_position_player2[1]){
                    drawRect(ctx, 5+35*current_position[1], 5+current_position[0]*35, 35+current_position[1]*35, 35+current_position[0]*35, 4, "red");
                }
                forwardPosition(current_position_player2, 3);
                if (current_position[0] == current_position_player2[0] && current_position[1] == current_position_player2[1]){
                    kill[2]++;
                    current_position[0] = start_point_1P[0];
                    current_position[1] = start_point_1P[1];
                    drawRect(ctx, 5+35*current_position[1], 5+current_position[0]*35, 35+current_position[1]*35, 35+current_position[0]*35, 4, "red");
                }
                drawRect(ctx, 5+35*current_position_player2[1], 5+current_position_player2[0]*35, 35+current_position_player2[1]*35, 35+current_position_player2[0]*35, 4, "blue");
            }
            else
                return;
            break;
        case 75://down
            if (map_connect_data[current_position_player2[0]][current_position_player2[1]][1]){
                move[2]++;
                map_item_data[current_position_player2[0]][current_position_player2[1]] = 0;
                drawRect(ctx, 5+35*current_position_player2[1], 5+current_position_player2[0]*35, 35+current_position_player2[1]*35, 40+current_position_player2[0]*35, 4, "pink");
                //drawCircle(20+35*current_position_player2[1], 20+current_position_player2[0]*35, 5, "white");
                if (current_position[0] == current_position_player2[0] && current_position[1] == current_position_player2[1]){
                    drawRect(ctx, 5+35*current_position[1], 5+current_position[0]*35, 35+current_position[1]*35, 35+current_position[0]*35, 4, "red");
                }
                forwardPosition(current_position_player2, 1);
                if (current_position[0] == current_position_player2[0] && current_position[1] == current_position_player2[1]){
                    kill[2]++;
                    current_position[0] = start_point_1P[0];
                    current_position[1] = start_point_1P[1];
                    drawRect(ctx, 5+35*current_position[1], 5+current_position[0]*35, 35+current_position[1]*35, 35+current_position[0]*35, 4, "red");
                }
                drawRect(ctx, 5+35*current_position_player2[1], 5+current_position_player2[0]*35, 35+current_position_player2[1]*35, 35+current_position_player2[0]*35, 4, "blue");
            }
            else
                return;
            break;
        default:
            return;
    }
    
    var x, y;
    if (map_item_data[current_position[0]][current_position[1]] == 5){
        map_item_data[current_position[0]][current_position[1]] = 0;
        drawRect(ctx, 5+35*current_position[1], 5+current_position[0]*35, 35+current_position[1]*35, 35+current_position[0]*35, 4, "skyblue");
        while (true){
            y = Math.floor(Math.random() * const_row);
            x = Math.floor(Math.random() * const_colume);
            if ( !((start_point_1P[0] == y && start_point_1P[1] == x) || (start_point_2P[0] == y && start_point_2P[1] == x) || (map_item_data[y][x] == 1) ||                       (map_item_data[y][x] == 2) || (map_item_data[y][x] == 5)) ){
                current_position[0] = y;
                current_position[1] = x;
                break;
            }
        }
        drawRect(ctx, 5+35*current_position[1], 5+current_position[0]*35, 35+current_position[1]*35, 35+current_position[0]*35, 4, "red");
    }
    
    else if (map_item_data[current_position_player2[0]][current_position_player2[1]] == 5){
        map_item_data[current_position_player2[0]][current_position_player2[1]] = 0;
        drawRect(ctx, 5+35*current_position_player2[1], 5+current_position_player2[0]*35, 35+current_position_player2[1]*35, 35+current_position_player2[0]*35, 4, "pink");
        while (true){
            y = Math.floor(Math.random() * const_row);
            x = Math.floor(Math.random() * const_colume);
            if ( !((start_point_1P[0] == y && start_point_1P[1] == x) || (start_point_2P[0] == y && start_point_2P[1] == x) || (map_item_data[y][x] == 1) ||                       (map_item_data[y][x] == 2) || (map_item_data[y][x] == 5)) ){
                current_position_player2[0] = y;
                current_position_player2[1] = x;
                break;
            }
        }
        drawRect(ctx, 5+35*current_position_player2[1], 5+current_position_player2[0]*35, 35+current_position_player2[1]*35, 35+current_position_player2[0]*35, 4, "blue");
    }
    
    
    map_item_data[current_position[0]][current_position[1]] = 1;
    map_item_data[current_position_player2[0]][current_position_player2[1]] = 2;
    calculateScore(current_position[0], current_position[1], 1);
    calculateScore(current_position_player2[0], current_position_player2[1], 2);
    scoretable[current_position[0]][current_position[1]] = 1;
    scoretable[current_position_player2[0]][current_position_player2[1]] = 2;
    
    //score canvas
    P1ScoreCTX.clearRect(0, 0, $("#P1ScoreCanvas").width(), $("#P1ScoreCanvas").height());
    P1ScoreCTX.fillText(score_1P, $("#P1ScoreCanvas").width() / 2, $("#P1ScoreCanvas").height() / 2+5);
    P2ScoreCTX.clearRect(0, 0, $("#P2ScoreCanvas").width(), $("#P2ScoreCanvas").height());
    P2ScoreCTX.fillText(score_2P, $("#P2ScoreCanvas").width() / 2, $("#P2ScoreCanvas").height() / 2+5);
})

$(document).keydown(function(event) {
    switch(event.which){
        case 65://left
            p1KeyCTX.fillStyle = "#003C9D";
            p1KeyCTX.fillRect(60,90,60, 60);
            
            p1KeyCTX.fillStyle = "white";
            p1KeyCTX.fillText("A", $("#P1KeyCanvas").width() / 2 - 60, $("#P1KeyCanvas").height() / 2 + 40);
            break;
        case 87://up
            p1KeyCTX.fillStyle = "#003C9D";
            p1KeyCTX.fillRect(120,30,60, 60);

            p1KeyCTX.fillStyle = "white";
            p1KeyCTX.fillText("W", $("#P1KeyCanvas").width() / 2, $("#P1KeyCanvas").height() / 2 - 20);
            break;
        case 68://right
            p1KeyCTX.fillStyle = "#003C9D";
            p1KeyCTX.fillRect(180,90,60, 60);

            p1KeyCTX.fillStyle = "white";
            p1KeyCTX.fillText("D", $("#P1KeyCanvas").width() / 2 + 60, $("#P1KeyCanvas").height() / 2 + 40);
            break;
        case 83://down
            p1KeyCTX.fillStyle = "#003C9D";
            p1KeyCTX.fillRect(120,90,60, 60);

            p1KeyCTX.fillStyle = "white";
            p1KeyCTX.fillText("S", $("#P1KeyCanvas").width() / 2, $("#P1KeyCanvas").height() / 2 + 40);
            break;
            
            
        case 74://left
            p2KeyCTX.fillStyle = "#003C9D";
            p2KeyCTX.fillRect(60,90,60, 60);
            
            p2KeyCTX.fillStyle = "white";
            p2KeyCTX.fillText("J", $("#P2KeyCanvas").width() / 2 - 60, $("#P2KeyCanvas").height() / 2 + 40);
            break;
        case 73://up
            p2KeyCTX.fillStyle = "#003C9D";
            p2KeyCTX.fillRect(120,30,60, 60);

            p2KeyCTX.fillStyle = "white";
            p2KeyCTX.fillText("I", $("#P2KeyCanvas").width() / 2, $("#P2KeyCanvas").height() / 2 - 20);
            break;
        case 76://right
            p2KeyCTX.fillStyle = "#003C9D";
            p2KeyCTX.fillRect(180,90,60, 60);

            p2KeyCTX.fillStyle = "white";
            p2KeyCTX.fillText("L", $("#P2KeyCanvas").width() / 2 + 60, $("#P2KeyCanvas").height() / 2 + 40);
            break;
        case 75://down
            p2KeyCTX.fillStyle = "#003C9D";
            p2KeyCTX.fillRect(120,90,60, 60);

            p2KeyCTX.fillStyle = "white";
            p2KeyCTX.fillText("K", $("#P2KeyCanvas").width() / 2, $("#P2KeyCanvas").height() / 2 + 40);
            break;
        default:
            return;
    }
})

$(document).keyup(function(event) {
    switch(event.which){
        case 65://left
            p1KeyCTX.fillStyle = "white";
            p1KeyCTX.fillRect(60,90,60, 60);
            
            p1KeyCTX.fillStyle = "#003C9D";
            p1KeyCTX.fillText("A", $("#P1KeyCanvas").width() / 2 - 60, $("#P1KeyCanvas").height() / 2 + 40);
            break;
        case 87://up
            p1KeyCTX.fillStyle = "white";
            p1KeyCTX.fillRect(120,30,60, 60);

            p1KeyCTX.fillStyle = "#003C9D";
            p1KeyCTX.fillText("W", $("#P1KeyCanvas").width() / 2, $("#P1KeyCanvas").height() / 2 - 20);
            break;
        case 68://right
            p1KeyCTX.fillStyle = "white";
            p1KeyCTX.fillRect(180,90,60, 60);

            p1KeyCTX.fillStyle = "#003C9D";
            p1KeyCTX.fillText("D", $("#P1KeyCanvas").width() / 2 + 60, $("#P1KeyCanvas").height() / 2 + 40);
            break;
        case 83://down
            p1KeyCTX.fillStyle = "white";
            p1KeyCTX.fillRect(120,90,60, 60);

            p1KeyCTX.fillStyle = "#003C9D";
            p1KeyCTX.fillText("S", $("#P1KeyCanvas").width() / 2, $("#P1KeyCanvas").height() / 2 + 40);
            break;
            
            
        case 74://left
            p2KeyCTX.fillStyle = "white";
            p2KeyCTX.fillRect(60,90,60, 60);
            
            p2KeyCTX.fillStyle = "#003C9D";
            p2KeyCTX.fillText("J", $("#P2KeyCanvas").width() / 2 - 60, $("#P2KeyCanvas").height() / 2 + 40);
            break;
        case 73://up
            p2KeyCTX.fillStyle = "white";
            p2KeyCTX.fillRect(120,30,60, 60);

            p2KeyCTX.fillStyle = "#003C9D";
            p2KeyCTX.fillText("I", $("#P2KeyCanvas").width() / 2, $("#P2KeyCanvas").height() / 2 - 20);
            break;
        case 76://right
            p2KeyCTX.fillStyle = "white";
            p2KeyCTX.fillRect(180,90,60, 60);

            p2KeyCTX.fillStyle = "#003C9D";
            p2KeyCTX.fillText("L", $("#P2KeyCanvas").width() / 2 + 60, $("#P2KeyCanvas").height() / 2 + 40);
            break;
        case 75://down
            p2KeyCTX.fillStyle = "white";
            p2KeyCTX.fillRect(120,90,60, 60);

            p2KeyCTX.fillStyle = "#003C9D";
            p2KeyCTX.fillText("K", $("#P2KeyCanvas").width() / 2, $("#P2KeyCanvas").height() / 2 + 40);
            break;
        default:
            return;
    }
})

$(document).keydown(function(event) {
    if (!changeTime)
        return;
    switch(event.which){
        case 37://left
            if(time > 10){
                time -= 10;
                timeCTX.fillStyle="black";
                timeCTX.fillRect(0,0,150, 70);
                timeCTX.fillStyle = "#D549EE";
                timeCTX.fillText(time, $("#TimeCanvas").width() / 2, $("#TimeCanvas").height() / 2 + 20);
            }
            break;
        case 39://right
            if(time < 120){
                time += 10;
                timeCTX.fillStyle="black";
                timeCTX.fillRect(0,0,150, 70);
                timeCTX.fillStyle = "#D549EE";
                timeCTX.fillText(time, $("#TimeCanvas").width() / 2, $("#TimeCanvas").height() / 2 + 20);
            }
            break;
        default:
            return;
    }
})
