let start = document.getElementById('start');
let list = document.getElementById('list');
let dummy = document.getElementById('dummy');

let total = settings.displaySettings.totalItems;
let index = settings.displaySettings.winnerItemIndex;
let items = settings.items;
let win = total-index-1;

let totalchance = 0.0;
let windata = null;

let spinning = false;
let chances = [];

for(let i = 0; i<items.length; i++) {
  for(let a = 0; a<items[i].chance; a++) chances[chances.length] = items[i];
}

async function newSpin() {
  for(let i = 0; i<total; i++) {
    if(i == win)
      windata = chances[Math.floor(Math.random() * chances.length)];
    else {
      let e = dummy.cloneNode(true);
      e.style.display = '';
      e.children[0].src = chances[Math.floor(Math.random() * chances.length)].image_url;
      list.append(e);
    }
  }
}


start.onclick = () => {
  if(!spinning) {
    spinning = true;
    newSpin();

    start.style.animation = 'fadeout 1s';
    start.style.animationFillMode = 'forwards';

    list.style.animation = 'fadein 1s';
    list.style.animationFillMode = 'forwards';

    setTimeout(() => {
      list.style.opacity = '1';
      list.style.animation = 'spin 8s ease';
      list.style.animationFillMode = 'forwards';
    }, 1000);

    setTimeout(() => {
      for(let i = 0; i<total-1; i++) if(i!=win) list.children[i].style.animation = "fadeout 1s forwards";
    }, 9000);

    setTimeout(() => {
      list.children[win].style.animation = "fadeout 1s forwards";
    }, 14000);
    
    setTimeout(() => {
      list.innerHTML = '';
      start.style.animation = "fadein 1s forwards";
      spinning = false;
    }, 15000)
  }
};
