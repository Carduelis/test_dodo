data = {
	problems :['вид напитка', 'внешний вид продукта', 'ожидание заказа', 'тесто', 'ожидание заказа', 'дружелюбность', 'ингредиенты','ингредиенты не по стандарту'],
	pizzerias : ['Анива','Апатиты','Апрелевка','Апшеронск','Аргаяш','Ардон','Арзамас','Армавир','Арсеньев','Артем','Верхний Тагил','Верхний Уфалей','Верхотурье','Верхоянск','Видное','Вилюйск','Витим','Владивосток','Владикавказ','Карпинск','Карталы','Касимов','Каспийск','Катав-Ивановск','Катайск','Качканар','Кашира','Плесецк','Подольск','Поронайск','Поярково','Приморско-Ахтарск','Приозерск','Прохладный','Ростов-на-Дону','Рубцовск','Руза','Рыбинск','Салават','Салехард','Сальск','Самара','Санкт-Петербург','Саранск','Сарапул','Саратов','Хабаровск','Ханты-Мансийск','Хасавюрт','Челябинск','Черемхово','Череповец','Черкесск','Чермоз'],
}

var App = Marionette.Application.extend({
	region: '#dodo-app',
	initialize: function(options) {
		console.log('My options:', options);
	},
	onStart: function() {
		console.log(this.getRegion());
		this.getRegion().show(new RootView());
		// this.showView(new RootView()); // are the same
	},

});
app = new App();



$(document).ready(function () {
	app.start();
});


function kek(height, width, left, top) {
	var height = _.random(200,400);
	var width = _.random(200,400);
	var left = _.random(20,70);
	var top = _.random(20,70);
	_.delay(function() {
		// if (_.random(228, 420) === 420) {
		$('body').append('<div class="kek'+height+'"></div>');
		$el = $('body').children('.kek'+height);
		var url = 'http://placecage.com/'+width+'/'+height;
		$el.append('<img src="'+url+'">')
		var css = function() {return{
			position: 'fixed',
			width: width+'px',
			height: height+'px',
			left: left+'%',
			'margin-left': '-'+width/2+'px',
			'margin-top': '-'+height/2+'px',
			top: top+'%',
			'z-index': 999
		}}
		$el.find('img').css(css());
		_.delay(function(){
			$el.remove();
		}, 2000);
		kek();
	}, 3000);
};

// kek();