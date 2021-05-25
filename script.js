let tasks = []; // タスクの配列
let complete = []; // 完了したタスクの配列

// 主人公画像の表示
heroBlock.innerHTML = "<img src='image/hero/hero_" + Math.floor(Math.random()*19) + ".gif'>";

// 追加ボタンが押されたときの処理
const newTaskButton = document.getElementById("newTaskButton");
newTaskButton.addEventListener("click",function(){
    const name = document.getElementById("newTaskText").value; // タスクの名前
    const subject = checkRadioButton("Subject"); // 教科
    const unit = checkRadioButton("Unit"); // 時間単位か量単位かを示す
    const vol = checkVol(unit); // 具体的な時間または量
    const image = "image/monster/mon_" + Math.floor(Math.random()*42)+ ".png"; // 乱数を生成して画像番号を指定
    const angle = Math.floor(Math.random()*360); // 乱数を生成してcomplete画像の角度を指定
    const left = 0;

    const task = new Task(name, subject, unit, vol, image, angle, left);
    tasks.push(task);

    // テキストボックスを空にする
    document.getElementById("newTaskText").value = "";
    if(unit=="Time"){
        document.getElementById("hour").value = "";
        document.getElementById("min").value = "";
    }else if(unit=="Amount"){
        document.getElementById("page").value = "";
    }
    showTask();
    showMonster();
},false);

// 完了・削除ボタンが押されたときの処理
let number = 0; // 完了ボタンを何回押したかを表す
document.getElementById("taskListBlock").addEventListener("click",function(){
    for(let i=0; i<tasks.length; i++){
        // 完了ボタンが押されたときの処理
        document.getElementById("taskCheckButton"+i).onclick = function() {
            complete.push(tasks[i]); // 完了したタスクを追加
            tasks.splice(i, 1); // i番目から1つ削除
            if(number>9) number=0; // 大きすぎると枠から出るので初期化
            complete[complete.length-1].left = number * 10; // completeに追加された画像のleftの値を更新
            showTask();
            showMonster();
            showComplete();
            number++; // numberを更新
        };
        // 削除ボタンが押されたときの処理
        document.getElementById("taskDeleteButton"+i).onclick = function() {
            tasks.splice(i, 1); // i番目から1つ削除
            showTask();
            showMonster();
        };
    }
},true);

// ラジオボタンをチェックして値を返す関数
function checkRadioButton(name){
    const elements = document.getElementsByName(name);
    for(let i=0; i<elements.length; i++){
        if(elements[i].checked == true) return elements[i].value;
    }
    return "カテゴリなし"; // 教科未選択の場合
}

// 勉強時間入力欄を表示する関数
function inputTime(){
    unitText.innerHTML = "<input type='number' id='hour' min='0'> 時間 <input type='number' id='min' max='59' min='0'> 分";
}

// 勉強量（ページ）入力欄を表示する関数
function inputAmount(){
    unitText.innerHTML = "<input type='number' id='page' min='0'> ページ";
}

// 勉強時間または量を配列に入れて返す関数
function checkVol(unit){
    let vol = [];
    if(unit=="Time"){
        let hour = document.getElementById("hour").value;
        let min = document.getElementById("min").value;
        if(hour=="" || hour<0){
            hour = 0; // 未入力、マイナスの場合は0時間にする
        }
        if(min=="" || min<0){
            min = 0; // 未入力、マイナスの場合は0分にする
        }else if(min>=60){
            hour = parseInt(hour) + Math.floor(min/60); // 60分以上入力されたときはhourに変換する
            min = min%60;
        }
        vol.push(hour);
        vol.push(min);
    }else if(unit=="Amount"){
        let page = document.getElementById("page").value;
        if(page=="" || page<0){
            page=0; // 未入力、マイナスの場合は0ページにする
        }
        vol.push(page);
    }
    return vol;
}

// TaskListの位置にタスクを表示する関数
function showTask(){
    let html = "";
    for (let i=0; i<tasks.length; i++) {
        html += "<div class='taskFrame'> <div class='taskFlexBox'>";
        html += "<div class='imageFlex'> <div class='imageBlock'> <img src=" + tasks[i].image + "> </div></div>"; //image部分
        html += "<div class='textBlock'>" + tasks[i].subject + "<br>"; //textBlock始まり
        if(tasks[i].unit=="Time"){
            html += tasks[i].vol[0] + "時間" + tasks[i].vol[1] + "分";
        }else if(tasks[i].unit=="Amount"){
            html += tasks[i].vol + "ページ";
        }
        html += "<br>" + tasks[i].name + "</div>"; // textBlock終わり
        html += "<div class='buttonBlock'>"; //button始まり
        html += "<input type='button' id='taskCheckButton" + i + "' value='完了' class='button'>";
        html += "<input type='button' id='taskDeleteButton" + i + "' value='削除' class='button'> </div>"; //button終わり
        html += "</div>" + "</div>";
    }
    taskList.innerHTML = html; // タスクを表示
}

// fightBoxの位置に画像を表示する関数
function showMonster(){
    let html = "";
    for(let i=0; i<tasks.length; i++) {
        html += "<div class='monsterBlock'> <img src=" + tasks[i].image + "> </div>";
    }
    monsterFlexBox.innerHTML = html;
}

// completeMonsterBoxの位置に画像を表示する関数
function showComplete(){
    let html = "";
    for(let i=0; i<complete.length; i++) {
        html += "<img src=" + complete[i].image + " style='position:absolute; "; // 画像を重ねる
        html += "transform:rotateZ(" + complete[i].angle + "deg); "; // 画像を回転させる
        html += "top:30%; left:" + complete[i].left + "%;'>"; // 画像の位置を指定
    }
    completeMonsterBox.innerHTML = html;
}

class Task {
    constructor(name, subject, unit, vol, image, angle, left){
        this.name = name; // タスクの名前
        this.subject = subject; // 科目
        this.unit = unit; // 時間か量か
        this.vol = vol; // 具体的な時間または量
        this.image = image; // モンスター画像
        this.angle = angle; // COMPLETEになったときの回転角度
        this.left = left; // COMPLETEになったときの位置
    }
}