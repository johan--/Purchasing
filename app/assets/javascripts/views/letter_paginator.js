App.LetterPaginatorView = Ember.View.extend({
  templateName: 'vendorLetterBar',

  tagName: 'span',
  content: 'All',
  classNames: ['letter'],
  classNameBindings: ['isCurrentLetter:active'],


  isCurrentLetter: function() {
    letter = this.get('content');
    curLetter = this.get('controller').get('metadata').letter;
    return letter == curLetter;
  }.property('content', 'controller.metadata.letter'),

  isNoLetter: function () {
    return this.get('controller').get('metadata') == null;
  }.property('controller.metadata.letter'),

  click: function() {
    this.get('controller').send('letterClick', this.get('content'));
  }
})
