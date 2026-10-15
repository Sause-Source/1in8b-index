// 1in8b.life の人生地図に、幸福度の平均値を表示する content script
//
// manifest.json で "world": "MAIN" を指定しているので、このファイルはページ自身の
// JavaScript と同じ環境で動きます。そのためページ内の変数 S を直接読めます。
//
// S.years は「生きた各年」の記録の配列です。1要素はこんな形をしています:
//   { a: 年齢, h: 幸福(0〜100), hl: 健康, so: 人間関係, sm: 知識, nw: 純資産, mk: その年の出来事 }
// 亡くなった年の要素は mk が 'death' になります。
const parameters = ['h', 'hl', 'so', 'sm', 'nw'];
const parameters_to_names = {
    'h': '幸福度',
    'hl': '健康度',
    'so': '人間関係',
    'sm': '知識',
    'nw': '純資産'
};
var is_checked = false;
function calcIndex(parameter) {
    var sum = 0;
    var exception = 0;
    if (S.years.length === 0) {
        return 0;
    }
    for (let i = 0; i < S.years.length; i++) {
        if (S.years[i].mk === 'death') {
            exception ++;
            continue;
        }
        else {
            sum += S.years[i][parameter];
        }
    }
    return sum / (S.years.length - exception);
} 
function createAverageElement(container) {
    let headingElement = document.createElement('h3');
    headingElement.innerText = '各パラメータの平均指数';
    container.appendChild(headingElement);
    let term_text = "";
    let termElements = [];
    let detailElements = [];
    let ListElement = document.createElement('dl');
    for (let i = 0; i < parameters.length; i++) {
        termElements.push(document.createElement('dt'));
        term_text = parameters_to_names[parameters[i]] + '指数: ';
        let detail_text = calcIndex(parameters[i]).toFixed(1);
        detailElements.push(document.createElement('dd'));
        detailElements[detailElements.length - 1].innerText = detail_text;
        termElements[i].innerText = term_text;
        ListElement.appendChild(termElements[i]);
        ListElement.appendChild(detailElements[i]);
    }
    container.appendChild(ListElement);
}
function updateElements(referenceNode) {
    if (document.getElementsByClassName('index-container').length > 0) {
        document.getElementsByClassName('index-container')[0].remove();
    }
    let container = document.createElement('div');
    container.className = 'index-container';
    createAverageElement(container);
    referenceNode.after(container);
}
function checkSection() {
    if (UI.view == 'dead'&& !is_checked) {
        is_checked = true;
        updateElements(document.getElementById('dead').querySelector('.gridkey'));
    }else if (UI.view != 'dead') {
        is_checked = false;
    }
}
setInterval(checkSection, 100);