var $ = require('jquery');

$(document).ready(function () {

  var utils = {
    getURLParameter: function (name) {
      return decodeURI(
        ( RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [,null] )[1]
      );
    }
  }

  var Application = function () {
    this.initialize.apply(this, arguments);
  }

  Application.defaults = {
    index: 0,
    data: [],
    correct: [],
    incorrect: [],
    skipped: []
  }

  Application.prototype.initialize = function (options) {
    var defaults = this.constructor.defaults;

    options = options || {};

    for (var key in defaults) {
      this[key] = options[key] || defaults[key];
    }

    return this;
  }

  Application.prototype.reset = function () {
    this.index = 0;
    this.correct = [];
    this.incorrect = [];
    this.skipped = [];
  }

  Application.prototype.numCorrect = function () {
    return this.correct.length;
  }

  Application.prototype.numIncorrect = function () {
    return this.incorrect.length;
  }

  Application.prototype.numSkipped = function () {
    return this.skipped.length;
  }

  Application.prototype.load = function (data) {
    this.data = [];

    var tag = utils.getURLParameter('tag');

    for (var key in data) {
      var item = data[key];

      if (tag && tag !== 'null') {
        if (item.tags.indexOf(tag) !== -1) {
          this.data.push(item)
        };
      } else {
        this.data.push(item);
      }
    }

    $('#num-total').text( this.data.length );

    for (var i = 0; i < this.data.length; i++) {
      $('#question-list').append($('<li>'+this.data[i].key+'</li>'));
    }

    this.render();
  }

  Application.prototype.nextQuestion = function () {
    this.hideAnswer();

    if (this.index < this.data.length) {
      this.index += 1;
    } else {
      this.reset();
    }

    this.render();
  }

  Application.prototype.render = function () {
    var current = this.data[this.index];

    if (typeof current == 'undefined') { return false; }

    $('#question').text('Term: ' + current.key);

    this.hideAnswer();

    $('#answer').html(
      $("<video controls autoplay loop><source src='"+current.value+"' type='video/mp4'></video>")
    );

    $('#num-correct').text( this.numCorrect() );
    $('#num-incorrect').text( this.numIncorrect() );
    $('#num-skipped').text( this.numSkipped() );
  }

  Application.prototype.hideAnswer = function () {
    $('#answer').hide();
    $('.show-answer').show();
    $('.question-correct').hide();
    $('.question-incorrect').hide();
    $('.question-skipped').show();
  }

  Application.prototype.showAnswer = function () {
    $('#answer').show();
    $('.show-answer').hide();
    $('.question-correct').show();
    $('.question-incorrect').show();
    $('.question-skipped').hide();
  }

  Application.prototype.questionCorrect = function () {
    this.correct.push( this.data[this.index] );
    this.nextQuestion();
  }

  Application.prototype.questionIncorrect = function () {
    this.incorrect.push( this.data[this.index] );
    this.nextQuestion();
  }

  Application.prototype.questionSkipped = function () {
    this.skipped.push( this.data[this.index] );
    this.nextQuestion();
  }

  window.app = new Application();

  $.ajax({
    url: 'data/terms.json',
    dataType: 'json',
    success: function (data) {
      app.load(data);
    },
    error: function (error) {
      console.log(error);
    }
  });

  $('a.show-answer').on('click', function () {
    app.showAnswer();
  });

  $('.question-correct').on('click', function () {
    app.questionCorrect();
  });

  $('.question-incorrect').on('click', function () {
    app.questionIncorrect();
  });

  $('.question-skipped').on('click', function () {
    app.questionSkipped();
  });

});
