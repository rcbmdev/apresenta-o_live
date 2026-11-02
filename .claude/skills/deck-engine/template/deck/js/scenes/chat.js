// Cena: chat — bolhas com "digitando"
Deck.scene('chat', function (el, api) {
  var R = api.recipes;
  var tl = api.timeline({ repeat: -1, repeatDelay: 2.5 });
  R.reveal(tl, el.querySelector('.phone'), { y: 60 });
  R.chat(tl, el.querySelector('.phone-body')); // bolhas escritas no index.html
  tl.addLabel('final');
  return { tl: tl };
});
