(function(){
	var data = {
		problems :['вид&nbsp;напитка', 'внешний&nbsp;вид продукта', 'ожидание&nbsp;заказа', 'тесто', 'дружелюбность', 'ингредиенты','ингредиенты не&nbsp;по&nbsp;стандарту'],
		pizzerias : ['Анива','Апатиты','Апрелевка','Апшеронск','Аргаяш','Ардон','Арзамас','Армавир','Арсеньев','Артем','Верхний Тагил','Верхний Уфалей','Верхотурье','Верхоянск','Видное','Вилюйск','Витим','Владивосток','Владикавказ','Карпинск','Карталы','Касимов','Каспийск','Катав-Ивановск','Катайск','Качканар','Кашира','Плесецк','Подольск','Поронайск','Поярково','Приморско-Ахтарск','Приозерск','Прохладный','Ростов-на-Дону','Рубцовск','Руза','Рыбинск','Салават','Салехард','Сальск','Самара','Санкт-Петербург','Саранск','Сарапул','Саратов','Хабаровск','Ханты-Мансийск','Хасавюрт','Челябинск','Черемхово','Череповец','Черкесск','Чермоз'],
		get pills() {
			var arr = [];
			for (var i = 12; i > 0; i--) {
				arr[i] = _.random(40,100);
			}
			return arr
		}
	}
	var dodoRow = function(i, isHideTheRow) {
		i++;
		function averageRatingDelta() {
			return _.random(1.1,1.9)
		}
		return {
			rank: i,
			quality: _.random(Math.floor(13+25/i),40),
			service: _.random(Math.floor(15+25/i),40),
			cleanliness: _.random(Math.floor(10+9/i),20),
			get ratingIntegerPart() {
				return Math.floor(this.averageRating);
			},
			get ratingDecimalPart() {
				return (100*(-this.ratingIntegerPart+this.averageRating)).toFixed()
			},
			get rating() {
				var qualiServiClean = this.quality+this.service+this.cleanliness
				var hasBeenRounded = _.random(0,1);
				return hasBeenRounded ? qualiServiClean+0.5 : qualiServiClean
			},
			averageRating: 100-i*averageRatingDelta(),
			delta: _.random(-5,5),
			isHideTheRow: isHideTheRow,
			isMakeAGap: i == 20,
			pills: data.pills,
			pizzeriaName: _.sample(data.pizzerias),
			problems: _.sampleSize(data.problems,_.random(1,3)),
			url: _.random(0.1,0.9) > 0.7 ? null : '//ya.ru?='+_.random(1,9),
		}
	};
	window.dodoCollection = function(){
		var result = [];
		var k = 0;
		for (var i in data.pizzerias) {
			var isHideTheRow = i == 2 || i > 4 && i < 8 ||  i > 22 && i < 22;
			if (isHideTheRow) {
				k++;
			} 
			result.push(dodoRow(+i-k, isHideTheRow));
		}
		return result;
	};
}())

var DodoApp = Marionette.Application.extend({
	region: '#dodo-app',
	initialize: function(options) {
		console.log('kek')
	},
	onStart: function() {
		console.log('kek')
		this.getRegion().show(new Root.View());
	},
});
$(function(){
	new DodoApp().start()
});
var Root = Root || {};

Root.View = Marionette.View.extend({
	template: '#t-root',
	regions: {
		'header' : {
			el: '.header',
			replaceElement: true,
		},
		'table' : {
			el: '.table',
			replaceElement: true,
		},
		'footer' : {
			el: '.footer',
			replaceElement: true,
		},
	},
	onRender: function() {
		this.getRegion('table').show(new Table.View());
		this.getRegion('header').show(new Root.Header());
		this.getRegion('footer').show(new Root.Footer());
	},
	onChildviewShuffle : function() {
		this.getRegion('table').show(new Table.View());
	}
});

Root.Header = Marionette.View.extend({
	template: '#t-header',
	className: 'wrapper',
	tagName: 'header',
	ui: {
		'shuffleBtn' : '.shuffleBtn',
		'imageBtn' : '.toggleImage'
	},
	events: {
		'click @ui.imageBtn' : 'toggleImage'
	},
	triggers: {
		'click @ui.shuffleBtn' : 'shuffle',
	},
	toggleImage: function(e){
		$('body').toggleClass('show-image');
		$btn = this.getUI('imageBtn');
		var oldText = $btn.text();
		var newText = $btn.attr('data-temp');
		$btn.text(newText);
		$btn.attr('data-temp',oldText)
	},
});
Root.Footer = Marionette.View.extend({
	template: '#t-footer',
	tagName: 'tagName',
	className: 'wrapper',
});

var Table = Table || {};

Table.View = Marionette.View.extend({
	template: '#t-table',
	className: 'wrapper table',
	regions: {
		'header' : {
			el: 'header',
			replaceElement: true,
		},
		'body'	: {
			el:	'main',
			replaceElement: true
		}
	},
	initialize: function() {
		this.render();
	},
	ui: {
		'problem' : '[data-problem-id]'
	},
	events: {
		'click @ui.problem' : 'onClick',
		'mouseenter @ui.problem' : 'onHighlight',
		'mouseleave @ui.problem' : 'onHighlightOff',
	},
	onHighlight: function(e) {
		var problemId = e.currentTarget.dataset.problemId;
		var $problems = this.$el.find('span[data-problem-id="'+problemId+'"]');
			$problems.css('border-color','hsla('+ 50*problemId+', 100%, 30%, 0.3)');
			$problems.first().is('[title]') || $problems.attr('title','Всего таких нарушений: ' + $problems.length)
	},
	onHighlightOff: function(e) {
		var problemId = e.currentTarget.dataset.problemId;
		this.$el.find('span[data-problem-id="'+problemId+'"]').removeAttr('style');
	},
	onRender: function(view) {
		this.getRegion('header').show(new Table.Header());
		this.getRegion('body').show(new Table.Body());
	}
});

Table.Header = Marionette.View.extend({
	tagName: 'header',
	className: 'table-header',
	template: '#t-table-header',
});

Table.Row = Marionette.View.extend({
	className: 'row',
	template: '#t-table-row',
	onBeforeRender: function(view) {
		if (this.model.get('isMakeAGap')) {
			this.$el.addClass('row-gap')
		}
	}

});

Table.Body = Marionette.CollectionView.extend({
	childView: Table.Row,
	tagName: 'main',
	className: 'table-body',
	initialize: function(){
		this.collection = new Backbone.Collection(dodoCollection());
	},
});
