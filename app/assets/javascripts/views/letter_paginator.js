App.LetterPaginatorView = Ember.View.extend({
  templateName: 'views/vendorLetterBar',

  tagName: 'span',
  content: 'All',
  classNames: ['letter'],
  classNameBindings: ['isCurrentLetter:active'],

  isCurrentLetter: function() {
    var current = this.get('controller.currentLetter'),
        letter = this.get('content');

    if (letter == 'All') {
      if (this.get('controller.metadata.search'))
        return false;
      return current == letter || current == null || current == '';

    } else {
      return current == letter;
    }
  }.property('content', 'controller.currentLetter'),

  click: function() {
    this.get('controller').send('letterClick', this.get('content'));
  }
})
