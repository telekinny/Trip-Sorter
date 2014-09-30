/*
Функция сортировки маршрутных карточек
Формат входных данных:
Массив объектов со следующими обязательными свойствами: from, to, transport означающими соотвественно пункт отправления, прибытия и код транспорта
Необязательных свойств может быть любое количество, они будут включены в вывод если будут описаны в структуре tranport.
Неописанные раннее свойства будут игнорироваться при выводе
Чтобы включить свойство в вывод необходимо в шаблоне сообщения заключить его в знаки "%" с обеих сторон. 
Знаками "[" и "]" обозначаются начало и конец отрывка сообщения связанного со свойством внутри этих скобок.
Если свойство не было передано, то не выводится весь связанный с ним отрезок сообщения.
Все необязательные свойства обязательно заключаются в индивидуальные квадратные скобки.

Формат выходных данных:
Сообщения, составленные по заданному шаблону, разделенные тегами <br>
Создано для решения тестового задания для прохождения стажировки специльно для Яндекса
Бабкин Иван 2014г.
*/
var transport = [
{ kind: "plane", message: "From %from%, take flight [%flight%] to %to%. [Gate %gate%. ][Seat %seat%.] [%comment%]" },
{ kind: "train", message: "Take train [%train%] from %from% to %to%. [Seat number %seat%.] [%comment%]" }
];
//Вывод неформатированного списка карточек
function printList(list) {
 while(list) {
    if (list)
        document.write(list.from + ' ==> ' + list.to + '<br>');
    list = list.next;
  }
}
//Функция создания сообщения для вывода
function createMessage(card)
{
    var message = transport[card.transport].message;
    var reg = /%(\w*)%/g;
    var result = message.match(reg); //Список выводимых свойств
    var property;
    for (i = 0; i < result.length; i++)
    {
        property = result[i].replace(/%/g, "");
        if (card[property])
            message = message.replace(result[i], card[property]); //Замена поля ввода на данные
        else
        {
            var index = message.indexOf(result[i]); //Поиск отрывка связанного с переданным свойством и его удаление
            var end = message.indexOf(']', index);
            var  start = message.lastIndexOf('[', index);
            message = message.substring(0, start) + message.substring(end + 1);
        }
    }
    message = message.replace(/\[|\]/g, ""); //Удаление всех квадратных скобок
    return message;
}
//Функция формирования итогового сообщения
function printFormattedList(list) {
    var returnMessage = "";
    while (list) {
        if (list) {
            var message = createMessage(list);
            returnMessage += message;
            returnMessage += '<BR>';
        }
        list = list.next;
    }
    return returnMessage;
}
//Функция сортировки
function sortList(list) {
var cur = list;
var tmp = list;
  while (cur.next){
    if(list.from == cur.next.to) //Поиск предшествующих участков маршрутаи
    {
      list = insert(list,cur);
      cur = tmp;
    }
    else if ((tmp.to == cur.next.from))//Поиск последующих участков маршрута
    {
        if (tmp != cur)
        tmp.next = insert(tmp.next, cur);
        tmp = tmp.next;
        cur = tmp;       
     }
    else
    cur = cur.next;
  }
return list;
}
//Функция вставки элемента, следующего за card, перед элементом list
function insert(list, card)
{
  var tmp = card.next;
  if (card.next)
  card.next = card.next.next;
  tmp.next = list;
  return tmp;
}
//Проверка корректности составленного маршрута
function checkList(list)
{
    for ( ; list.next ; list=list.next )
    if ( list.to != list.next.from ) return -1;
    return 0
}
//Вставка карточки
function addCard(list,props)
{
    var card = {};
    card.from = props.from;
    card.to = props.to;
    if (!card.from || !card.to) return list;
    card.next = list;
    return card;
}
//Формирование списка из массива карточек
function addCards(list, cards_array) {
    var i;
        for (i = 0; i < cards_array.length; i++) {
        if (!cards_array[i].from || !cards_array[i].to || cards_array[i].transport === undefined) continue;
        var card = {};
        for(var property in cards_array[i]) {
            card[property] = cards_array[i][property];
        }
        if (list.from) card.next = list;
        list = card;
    }
    return list;
}
//Основная функция
function tripSorter(cards_array) {
    var list = {};
    list = addCards(list, cards_array);
    list = sortList(list);
    if (checkList(list) < 0) return "Error. Unable to create trip"
    returnMessage = printFormattedList(list);
    return returnMessage;
}