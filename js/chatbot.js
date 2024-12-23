'use strict';

/*
【補足】
- チャットの画面にある「ul」にJavaScriptで「li」を追加していく仕組みです。
- ロボットが返信する度に、「robotCount」を1ずつ足していきます。この値がロボットが話す内容をまとめた「chatList」オブジェクトの数値に対応します。自分がテキストを入力し、送信ボタンを押した瞬間の「robotCount」の値に応じて、配列から次のメッセージを選び返信させます。
- 今回作った関数は、ロボットの投稿をする「robotOutput()」と、自分が送信ボタンを押したときの関数（無名関数）です。

【開発状況】
[✓] ロボットからの投稿 20190918完成
[✓] 自分の投稿 20190918完成
[✓] option.normal 処理
[✓] option.random 処理
[✓] option.select 処理 利用 20210524完成
[✓] continue 処理
[✓] save 処理，chatDataList 利用 20210524完成
[×] さらなる会話の分岐 
[✓] ロボットからのリンクの送信
[×] 正解なし質問に応じた返答
[×] テキストマイニング
[✓] ロボットの考え中のアニメーション
[×] ロボットのアイコン
[×] 「他に知りたいことはありますか？」というようなループ
[×] 「」というようなループ
[×] ロボットの質問番号の自動化

【開発捕捉】
■ chatList のoptionの種類
- chatList[n].option = ['normal', 'random', 'select'];

■ chatList のプロパティの種類
- text -> ロボットが表示する文字
- continue -> 次もロボットが連続で投稿するときは true を指定する
- option -> normal は普通，random は配列状態の text をランダムで一つ投稿する，select は選択肢（個数に制限なし）を提示する
- link: trueでリンク化
*/

// ロボットからの投稿一覧のオブジェクト
const chatList = {
    1: {text: 'ようこそ「AI chatbot」へ！', continue: true, option: 'normal'},
    2: {text: '会話内容は管理者へ送信されませんので、ご安心ください。', continue: true, option: 'normal'},
    3: {text: {title: 'Q1', question: '何を知りたいですか？', choices: ['開発者について', '参考にしたチャットボット', 'Flutter デモアプリ', '島根県美郷町 HP']}, continue: false, option: 'choices', questionNextSupport: true},
    4: {text: ['https://mf3px.sakura.ne.jp/', 'https://www.hubspot.jp/', 'https://gallery.flutter.dev/', 'https://www.town.shimane-misato.lg.jp/misatoto/'], continue: true, option: 'normal', link: true},
    5: {text: 'こちらの文字をクリックしてください。', continue: true, option: 'normal'},
    6: {text: 'あなたのお名前は何ですか？', continue: false, option: 'normal'},
    7: {text: '', continue: true, option: 'normal'},
    8: {text: '今日の体調はいかがですか？', continue: false, option: 'normal'},
    9: {text: ['そうですか！', 'わかりました！', '承知致しました！'], continue: true, option: 'random'},
    10: {text: 'ここで問題です！', continue: true, option: 'normal'},
    11: {text: {title: 'Q2', question: 'どの山が世界一高いでしょう？', choices: ['エベレスト', 'K2', '富士山'], answer: '0'}, continue: false, option: 'choices'},
    12: {text: {qTrue: '', qFalse: '残念！正解は「エベレスト」でした。'}, continue: true, option: 'normal'},
    13: {text: '', continue: true, option: 'normal'},
    14: {text: {title: '満足度調査', question: 'このAIチャットボットの満足度を5段階で教えてください（数字が大きいほど満足度が高いものとします。）。', choices: ['5', '4', '3', '2', '1']}, continue: false, option: 'choices'},
    15: {text: 'ありがとうございます。最後に、ご感想をお聞かせください。', continue: false, option: 'normal'},
    16: {text: '', continue: false, option: 'normal'}
};

// ユーザーデータを挿入する関数
function textSpecial() {
    chatList[7].text = `こんにちは！${userData[1]}さん！`;
    chatList[12].text.qTrue = `正解！${userData[1]}さん、すごいですね！`;
    chatList[13].text = `${userData[1]}さん、ありがとうございました。今日はここで終了とさせていただきます。`; 
    chatList[16].text = `${userData[1]}さんの満足度は「${userData[4]}」，ご感想は「${userData[5]}」ですね！ありがとうございました。`;
}

// カウント管理とユーザーデータの初期化
let userCount = 0;
let userData = [];

// チャットを一番下にスクロールする関数
function chatToBottom() {
    const chatField = document.getElementById('chatbot-body');
    chatField.scrollTop = chatField.scrollHeight;
}

const userText = document.getElementById('chatbot-text');
const chatSubmitBtn = document.getElementById('chatbot-submit');

// ロボットの投稿カウントと選択肢のポイント管理
let robotCount = 0;
let qPoint = 0;

// 選択肢ボタンを押したときの次の選択肢
let nextTextOption = '';

// 選択肢ボタンを押したときの処理
function pushChoice(e) {
    userCount++;
    console.log(`userCount: ${userCount}`);

    const choicedId = e.getAttribute('id');
    userData.push(document.getElementById(choicedId).textContent);

    if (chatList[robotCount].text.answer !== undefined) {
        const trueChoice = `q-${robotCount}-${chatList[robotCount].text.answer}`;
        if (choicedId === trueChoice) {
            nextTextOption = 'qTrue';
            qPoint++;
        } else {
            nextTextOption = 'qFalse';
        }
    } else {
        if(chatList[robotCount].questionNextSupport) {
            nextTextOption = choicedId.split('-').pop();
        }
    }

    chatList[robotCount].text.choices.forEach((choice, i) => {
        const buttonId = `q-${robotCount}-${i}`;
        const button = document.getElementById(buttonId);
        button.disabled = true;
        button.classList.add('choice-button-disabled');
    });

    document.getElementById(choicedId).classList.remove('choice-button-disabled');

    robotOutput();

    console.log(userData);
}

// 拡大ボタンの初期状態
let chatbotZoomState = 'none';
const chatbot = document.getElementById('chatbot');
const chatbotBody = document.getElementById('chatbot-body');
const chatbotFooter = document.getElementById('chatbot-footer');
const chatbotZoomIcon = document.getElementById('chatbot-zoom-icon');

// ロボットの投稿機能
function robotOutput() {
    robotCount++;
    console.log('robotCount：' + robotCount);

    chatSubmitBtn.disabled = true;

    const ul = document.getElementById('chatbot-ul');
    const li = document.createElement('li');
    li.classList.add('left');
    ul.appendChild(li);

    const robotLoadingDiv = document.createElement('div');

    setTimeout(() => {
        li.appendChild(robotLoadingDiv);
        robotLoadingDiv.classList.add('chatbot-left');
        robotLoadingDiv.innerHTML = `
            <div id="robot-loading-field">
                <span id="robot-loading-circle1" class="material-icons">circle</span>
                <span id="robot-loading-circle2" class="material-icons">circle</span>
                <span id="robot-loading-circle3" class="material-icons">circle</span>
            </div>`;
        console.log('考え中');
        chatToBottom();
    }, 800);

    setTimeout(() => {
        robotLoadingDiv.remove();

        if (chatList[robotCount].option === 'choices') {
            const choiceField = document.createElement('div');
            choiceField.id = `q-${robotCount}`;
            choiceField.classList.add('chatbot-left-rounded');
            li.appendChild(choiceField);

            const choiceTitle = document.createElement('div');
            choiceTitle.classList.add('choice-title');
            choiceTitle.textContent = chatList[robotCount].text.title;
            choiceField.appendChild(choiceTitle);

            const choiceQ = document.createElement('div');
            choiceQ.textContent = chatList[robotCount].text.question;
            choiceQ.classList.add('choice-q');
            choiceField.appendChild(choiceQ);

            chatList[robotCount].text.choices.forEach((choice, i) => {
                const choiceButton = document.createElement('button');
                choiceButton.id = `q-${robotCount}-${i}`;
                choiceButton.setAttribute('onclick', 'pushChoice(this)');
                choiceButton.classList.add('choice-button');
                choiceButton.textContent = choice;
                choiceField.appendChild(choiceButton);
            });
        } else {
            const div = document.createElement('div');
            li.appendChild(div);
            div.classList.add('chatbot-left');
            
            textSpecial();  

            if (chatList[robotCount].text.qTrue) {
                if(chatList[robotCount].link) {
                    div.innerHTML = `<a href="${chatList[robotCount].text[nextTextOption]}" onclick="chatbotLinkClick()">${chatList[robotCount].text[nextTextOption]}</a>`;
                } else {
                    div.textContent = chatList[robotCount].text[nextTextOption];
                }
            } else if (robotCount > 1 && chatList[robotCount - 1].questionNextSupport) {
                console.log('次の回答の選択肢は' + nextTextOption);
                if(chatList[robotCount].link) {
                    div.innerHTML = `<a href="${chatList[robotCount].text[nextTextOption]}" onclick="chatbotLinkClick()">${chatList[robotCount].text[nextTextOption]}</a>`;
                } else {
                    div.textContent = chatList[robotCount].text[nextTextOption];
                }
            } else {
                if(chatList[robotCount].link) {
                    div.innerHTML = `<a href="${chatList[robotCount].text}" onclick="chatbotLinkClick()">${chatList[robotCount].text}</a>`;
                } else {
                    div.textContent = chatList[robotCount].text;
                }
            }
        }

        chatSubmitBtn.disabled = false;
        chatToBottom();

        if (chatList[robotCount].continue) {
            robotOutput();
        }
    }, 2000);

    if(chatbotZoomState === 'large' && window.matchMedia('(min-width:700px)').matches) {
        document.querySelectorAll('.chatbot-left, .chatbot-right, .chatbot-left-rounded').forEach((el) => {
            el.style.maxWidth = '52vw';
        });
    }
}

// 初期ロボットメッセージの表示
robotOutput();

// 自分の投稿処理
chatSubmitBtn.addEventListener('click', () => {
    if (!userText.value || !userText.value.trim()) return false;

    userCount++;
    console.log(`userCount: ${userCount}`);

    userData.push(userText.value);
    console.log(userData);

    const ul = document.getElementById('chatbot-ul');
    const li = document.createElement('li');
    const div = document.createElement('div');

    li.classList.add('right');
    ul.appendChild(li);
    li.appendChild(div);
    div.classList.add('chatbot-right');
    div.textContent = userText.value;

    if(robotCount < Object.keys(chatList).length) {
        robotOutput();
    } else {
        repeatRobotOutput();
    }

    chatToBottom();
    userText.value = '';
});

// 最後のやまびこ処理
function repeatRobotOutput() {
    robotCount++;
    console.log(robotCount);

    chatSubmitBtn.disabled = true;
                   
    const ul = document.getElementById('chatbot-ul');
    const li = document.createElement('li');
    li.classList.add('left');
    ul.appendChild(li);

    const robotLoadingDiv = document.createElement('div');

    setTimeout(() => {
        li.appendChild(robotLoadingDiv);
        robotLoadingDiv.classList.add('chatbot-left');
        robotLoadingDiv.innerHTML = `
            <div id="robot-loading-field">
                <span id="robot-loading-circle1" class="material-icons">circle</span>
                <span id="robot-loading-circle2" class="material-icons">circle</span>
                <span id="robot-loading-circle3" class="material-icons">circle</span>
            </div>`;
        console.log('考え中');
        chatToBottom();
    }, 800);
    
    setTimeout(() => {
        robotLoadingDiv.remove();

        const div = document.createElement('div');
        li.appendChild(div);
        div.classList.add('chatbot-left');

        div.textContent = userData[userCount - 1];
        chatToBottom();
        chatSubmitBtn.disabled = false;

    }, 2000);

    if(chatbotZoomState === 'large') {
        document.querySelectorAll('.chatbot-left, .chatbot-right, .chatbot-left-rounded').forEach((el) => {
            el.style.maxWidth = '52vw';
        });
    }
}

// PC用の拡大縮小機能
function chatbotZoomShape() {
    chatbotZoomState = 'large';
    console.log(chatbotZoomState);
    
    chatbot.classList.add('chatbot-zoom');
    chatbotBody.classList.add('chatbot-body-zoom');
    chatbotFooter.classList.add('chatbot-footer-zoom');

    chatbotZoomIcon.textContent = 'fullscreen_exit';
    chatbotZoomIcon.setAttribute('onclick', 'chatbotZoomOff()');

    if (window.matchMedia('(min-width:700px)').matches) {
        document.querySelectorAll('.chatbot-left, .chatbot-right, .chatbot-left-rounded').forEach((el) => {
            el.style.maxWidth = '52vw';
        });
    }
}

function chatbotZoom() {
    chatbotZoomShape();
    window.location.href = '#chatbot';
}

function chatbotZoomOffShape() {
    chatbotZoomState = 'middle';
    console.log(chatbotZoomState);

    chatbot.classList.remove('chatbot-zoom');
    chatbotBody.classList.remove('chatbot-body-zoom');
    chatbotFooter.classList.remove('chatbot-footer-zoom');

    chatbotZoomIcon.textContent = 'fullscreen';
    chatbotZoomIcon.setAttribute('onclick', 'chatbotZoom()');

    document.querySelectorAll('.chatbot-left, .chatbot-right, .chatbot-left-rounded').forEach((el) => {
        el.style.maxWidth = '70%';
    });
}

function chatbotZoomOff() {
    chatbotZoomOffShape();
    window.history.back();
}

function chatbotLinkClick() {
    chatbotZoomOffShape();
    document.getElementById('chatbot').classList.add('chatbot-none');
    document.getElementById('chatbot-back').classList.add('none');
    document.getElementById('chatbot-start-button-icon').textContent = 'question_answer';
} 