var chessBoard=[];
var me=true;
var over=false;//是否结束
//赢法
var wins=[];
//我方赢法
var myWins=[];
//电脑赢法
var computerWins=[];

for(var i=0;i<15;i++){
    chessBoard[i]=[];
    for(var j=0;j<15;j++)
    {
        chessBoard[i][j]=0;
    }
}
for(var i=0;i<15;i++){
    wins[i]=[];
    for(var j=0;j<15;j++){
        wins[i][j]=[];
    }
}
//赢法统计共572种
var count=0;
//横线
for(var i=0;i<15;i++){
    for(var j=0;j<11;j++){
        //wins[0][0][0]=true;
        //wins[0][1][0]=true;
        //wins[0][2][0]=true;
        //wins[0][3][0]=true;
        //wins[0][4][0]=true;

        //wins[0][1][1]=true;
        //wins[0][2][1]=true;
        //wins[0][3][1]=true;
        //wins[0][4][1]=true;
        //wins[0][5][1]=true;
        for(var k=0;k<5;k++){
            wins[i][j+k][count]=true;
        }
        count++;
    }
}
//竖线
for(var i=0;i<15;i++){
    for(var j=0;j<11;j++){
        for(var k=0;k<5;k++){
            wins[j+k][i][count]=true;
        }
        count++;
    }
}
//斜线
for(var i=0;i<11;i++){
    for(var j=0;j<11;j++){
        for(var k=0;k<5;k++){
            wins[i+k][j+k][count]=true;
        }
        count++;
    }
}
//反斜线
for(var i=0;i<11;i++){
    for(var j=14;j>3;j--){
        for(var k=0;k<5;k++){
            wins[i+k][j-k][count]=true;
        }
        count++;
    }
}
console.log(count);

for(var i=0;i<count;i++){
    myWins[i]=0;
    computerWins[i]=0;
}


var chess=document.getElementById('chess');
var context=chess.getContext('2d');
context.strokeStyle="#bfbfbf";
var logo=new Image();
logo.src="images/logo.png";
logo.onload=function(){
    context.drawImage(logo,0,0,450,450);
    drawChessBoard();
    //context.stroke();

}
var drawChessBoard=function()
{
    for(var i=0;i<15;i++)
    {
        context.moveTo(15+i*30,15);
        context.lineTo(15+i*30,435);
        context.stroke();
        context.moveTo(15,15+i*30);
        context.lineTo(435,15+i*30);
        context.stroke();
    }
}
/*封装棋子函数*/
var oneStep=function(i,j,me) {
    context.beginPath();
    /*中心坐标 半径*/
    context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
    context.closePath();
    var gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j * 30 - 2, 0);
    if (me) {
        gradient.addColorStop(0, "#0a0a0a");
        gradient.addColorStop(1, "#636766");
    }
    else {
        gradient.addColorStop(0, "#d1d1d1");
        gradient.addColorStop(1, "#f9f9f9");
    }
    context.fillStyle = gradient;
    context.fill();
}
chess.onclick=function(e){
    if(over){
        return;
    }
    if(!me){
        return;
    }
    var x= e.offsetX;
    var y= e.offsetY;
    var i=Math.floor(x/30);
    var j=Math.floor(y/30);
    if(chessBoard[i][j]==0){
        oneStep(i,j,me);
        chessBoard[i][j]=1;
        for(var k=0;k<count;k++){
            if(wins[i][j][k]){
                myWins[k]++;
                computerWins[k]=6;//异常情况，不统计。
                if(myWins[k]==5){
                    window.alert("you win");
                    over=true;
                }
            }
        }
        if(!over){
            me= !me;
            computerAI();
        }
    }
}
var computerAI=function(){
    var myScore=[];
    var computerScore=[];
    var max=0;
    var u= 0,v=0;

    for(var i=0;i<15;i++){
        myScore[i]=[];
        computerScore[i]=[];
        for(var j=0;j<15;j++){
            myScore[i][j]=0;
            computerScore[i][j]=0;
        }
    }
    for(var i=0;i<15;i++){
        for(var j=0;j<15;j++){
            if(chessBoard[i][j]==0){
                for(var k=0;k<count;k++){
                    if(wins[i][j][k]){//会累加
                        if(myWins[k]==1){
                            myScore[i][j]+=200;
                        }
                        else if(myWins[k]==2){
                            myScore[i][j]+=400;
                        }
                        else if(myWins[k]==3){
                            myScore[i][j]+=2000;
                        }
                        else if(myWins[k]==4){
                            myScore[i][j]+=10000;
                        }

                        if(computerWins[k]==1){
                            computerScore[i][j]+=220;
                        }
                        else if(computerWins[k]==2){
                            computerScore[i][j]+=420;
                        }
                        else if(computerWins[k]==3){
                            computerScore[i][j]+=2100;
                        }
                        else if(computerWins[k]==4){
                            computerScore[i][j]+=20000;
                        }
                    }
                }
                if(myScore[i][j]>max){
                    max=myScore[i][j];
                    u=i;
                    v=j;
                }
                else if(myScore[i][j]==max){
                    if(computerScore[i][j]>computerScore[u][v]){
                        u=i;
                        v=j;
                    }
                }
                if(computerScore[i][j]>max){
                    max=computerScore[i][j];
                    u=i;
                    v=j;
                }
                else if(computerScore[i][j]==max){
                    if(myScore[i][j]>myScore[u][v]){
                        u=i;
                        v=j;
                    }
                }
            }
        }
    }
    oneStep(u,v,false);
    chessBoard[u][v]=2;
    for(var k=0;k<count;k++){
        if(wins[u][v][k]){
            computerWins[k]++;
            myWins[k]=6;//异常情况，不统计。
            if(computerWins[k]==5){
                window.alert("computer win");
                over=true;
            }
        }
    }
    if(!over){
        me= !me;
    }
}

