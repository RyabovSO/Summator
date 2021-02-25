//main();

//Хочу выразить огромную благодарность Вам, что уделили время данной игре. Это самое ценное что вы могли дать мне.
//Надеюсь из игры вы почерпнули что-то новое, а значит мои старания были не напрасны.


//startGame();
function startGame(){
  //document.querySelector(".header").classList.add("blur");
  //document.querySelector(".fields").classList.add("blur");
  let lvl = 1;
  initLvL(lvl);
}

//инициализация
function initLvL(lvl){
  document.getElementById("item-lvl").innerHTML = lvl+" LvL";
  document.querySelector(".header").classList.remove("blur");
  document.querySelector(".fields").classList.remove("blur");
  document.querySelector(".game-menu").classList.add("hide");
  document.querySelector(".game-menu-start").classList.add("hide");
  document.querySelector(".game-menu-end").classList.add("hide");
  document.getElementById("fields").innerHTML = "";
  let maxLvL = 10; //максимальный уровень
  let countItems = (lvl+5)*(lvl+5); //кол-во ячеек
  initItems(lvl, countItems); // инициализация ячеек
  let timerCount = 10; //таймер
  let minItemSum = 11; //диапазон суммы
  let maxItemSum = 19;

  let maxItem = 0; //диапазон в ячейке
  let minItem = 10; //

  let itemsArr = getItemsArr(minItem, maxItem, countItems);
  console.log("itemsArr="+ itemsArr);
  let sum = summElementsArr(itemsArr);

  let itemsSumArr = getItemsSumArr(sum,minItemSum,maxItemSum)
  console.log("itemsSumArr="+itemsSumArr);

  let index = 0;
  let items = document.querySelectorAll('.cell');
  for (let j in items){
    //console.log(items[j].innerHTML = item);
    items[j].innerHTML = itemsArr[index];
    index++;
  }
  var item_sum = document.getElementById("item-sum").innerHTML = itemsSumArr[0];
  //document.addEventListener('click', function() { // когда весь HTML загружен
    document.getElementById("item-time").innerHTML = timerCount;

    let score = 0;
    let timerId = printTimer(timerCount, score);
    var elements = document.querySelectorAll(".cell"); // вызвать клик на кнопку
    let temp = 0;
    let countSum = 0;
    for (i = 0; i < elements.length; ++i) {
      elements[i].onclick = function(){
        temp = temp + parseInt(this.innerHTML, 10);
        this.innerHTML = "";        //очищаем элемент
        this.classList.add("hide"); //скрываем элемент

        if(temp == itemsSumArr[countSum]){
          score = score + itemsSumArr[countSum];
          clearInterval(timerId);   //останавливаем таймер
          animateNumberValue("item-time", 0, timerCount, 50);
          countSum++;
          temp = 0;
          timerId = printTimer(timerCount, score); //запускаем таймер
          //уровень еще не пройден
          if (itemsSumArr[countSum] !== undefined){
            animateNumberValue("item-sum", 0, itemsSumArr[countSum], 50);
          //уровень пройден
          } else {
            //если уровень меньше maxLvL
            if (lvl < maxLvL){
              lvlUp(timerId, lvl);
            //если конец игры
            } else if (lvl == maxLvL){
              document.getElementById("item-sum").innerHTML = "WIN";
              clearInterval(timerId);   //останавливаем таймер
              let marginTop = -300;
              let titles_interval = setInterval(function() {
                if (document.getElementById("titles-text").style.marginTop == scrollHeight+"px"){
                  clearInterval(titles_interval);
                }
                ++marginTop;
                document.getElementById("titles-text").style.marginTop = marginTop+"px";
              }, 10);
            }
          }
        } else if (temp > itemsSumArr[countSum]){
          gameOver(timerId, score)
          //window.location.reload();
        }
      };
    };
  //});
}
//увеличиваем уровень
function lvlUp(timerId, lvl) {
  clearInterval(timerId);
  lvl++;//увеличиваем уровень
  initLvL(lvl);
}
//инициализация ячеек
function initItems(lvl, countItems){
  let fontsize = (-lvl*0.7+10.7).toFixed(2);
  console.log(fontsize);
  let width_heigh = (78/(lvl+5)-1)+"vmin";
  for (var i = 0; i < countItems; i++) {
    document.getElementById("fields").innerHTML += '<div class="cell" style="width:'+width_heigh+';height:'+width_heigh+'; font-size:'+fontsize+'vmin"></div>';
  }
}
//получить ячейки
function getItemsArr(minItem, maxItem, countItems) {
  let result = [];
  let item = 0;
  let itemSum = 0;
  for (let i = 0; i < countItems; i++){
    item = getRandomIntInclusive(minItem, maxItem);
    result.push(item);
  }
  return result;
}

//получить суммы ячеек
function getItemsSumArr(sum, minItemSum, maxItemSum) {
  let result = [];
  let item = 0;
  let itemSum = 0;
  for (let i = 0; itemSum !== sum; i++){
    item = getRandomIntInclusive(minItemSum, maxItemSum);
    itemSum = summElementsArr(result);
    let tempSum = itemSum+item;
    if ((itemSum < sum) && (tempSum <= sum)){
      result.push(item);
    } else if ((itemSum < sum) && (tempSum > sum)){
      result.push(sum - itemSum);
    }
  }
  return result;
}

//Сумма всех элементов массива
function summElementsArr(arr){
  let result = 0;
  for(let i = 0; i <= arr.length-1; i++){
     result = arr[i] + result;
  }
  return result;
}

//Получение случайного целого числа в заданном интервале, включительно
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}

//Вывод таймера
function printTimer(timerCount, score) {
  let timerId = setInterval(function() {
    document.getElementById("item-time").innerHTML = --timerCount;
    if (timerCount == 0) {
      gameOver(timerId, score);
    }
  }, 1000);
  return timerId;
}

//Анимация появления числа
function animateNumberValue(id,from,to,duration) {
  //document.getElementById(id).innerHTML = timerCount;
  var element = document.getElementById(id);
  var start = new Date().getTime();
  setTimeout(function() {
    var now = (new Date().getTime()) - start;
    var progress = now / duration;
    var result = Math.floor((to - from) * progress + from);
    element.innerHTML = progress < 1 ? result : to;
    if (progress < 1) setTimeout(arguments.callee, 10);
  }, 10);
}

//Функция вызывается когда игрок проиграл
function gameOver(timerId, score) {
  //alert("Вы проиграли");
  //set_cookie("score", score, 2021, 02, 15, "", "https://ryabovso.github.io/Summator/", "secure");

  document.getElementById("score").innerHTML = score;
  clearInterval(timerId); //останавливаем таймер
  document.querySelector(".header").classList.add("blur");
  document.querySelector(".fields").classList.add("blur");
  document.querySelector(".game-menu").classList.remove("hide");
  document.querySelector(".game-menu-end").classList.remove("hide");
}

//Функция для установки куки
function set_cookie(name, value, exp_y, exp_m, exp_d, path, domain, secure){
  var cookie_string = name + "=" + escape ( value );
  if (exp_y){
    var expires = new Date (exp_y, exp_m, exp_d);
    cookie_string += "; expires=" + expires.toGMTString();
  }
  if (path){
    cookie_string += "; path=" + escape (path);
  }
  if (domain){
    cookie_string += "; domain=" + escape (domain);
  }
  if (secure){
    cookie_string += "; secure";
  }
}
var scrollHeight = Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
  );
