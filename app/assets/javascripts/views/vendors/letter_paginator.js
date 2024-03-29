
App.LetterPaginatorView = Ember.View.extend({

  template: Ember.Handlebars.compile('{{view.content}}'),

  tagName: 'span',
  content: 'All',
  classNames: ['letter'],
  classNameBindings: ['isCurrentLetter:active'],


  isCurrentLetter: function() {
    var current = this.get('controller.currentLetter'),
        letter = this.get('content');

    if (letter === 'All') {
      if (this.get('controller.metadata.search'))
        return false;
      return current === letter || isEmpty(current);

    } else {
      return current === letter;
    }
  }.property('content', 'controller.currentLetter'),


  click: function() {
    this.get('controller').send('letterClick', this.get('content'));
  }
});
