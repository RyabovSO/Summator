main();
function main(){
  let timerCount = 10; //таймер
  document.getElementById("item-time").innerHTML = timerCount;
  let countItems = 36; //кол-во ячеек

  let minItemSum = 11; //диапазон суммы
  let maxItemSum = 19;

  let maxItem = 0; //1
  let minItem = 10; //9

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
  document.addEventListener('DOMContentLoaded', function() { // когда весь HTML загружен
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
          if (itemsSumArr[countSum] !== undefined){
            animateNumberValue("item-sum", 0, itemsSumArr[countSum], 50);
          } else {
            document.getElementById("item-sum").innerHTML = "WIN";
            clearInterval(timerId);   //останавливаем таймер
          }
        } else if (temp > itemsSumArr[countSum]){
          gameOver(timerId, score)
          //window.location.reload();
        }
      };
    };
  });
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
  set_cookie("score", score, 2021, 02, 15, "", "https://ryabovso.github.io/Summator/", "secure");

  document.getElementById("score").innerHTML = score;

  clearInterval(timerId); //останавливаем таймер
  document.querySelector(".header").classList.add("blur");
  document.querySelector(".fields").classList.add("blur");
  document.querySelector(".game-menu").classList.remove("hide");
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
  console.log("cookie_string = "+cookie_string);
  document.cookie = cookie_string;
  console.log("document.cookie = "+document.cookie);
}
