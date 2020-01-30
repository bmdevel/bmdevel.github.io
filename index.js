const start = document.getElementById('start');
const list = document.getElementById('list');
const dummy = document.getElementById('dummy');

const decelleration = settings.decelleration;
const total = settings.totalItems;
const items = settings.items;

let spinning = false;
let chances = [];

let clickBegin;
let clickEnded;
let clickY;
let winIndex;

for(let i = 0; i<items.length; i++) {
  for(let a = 0; a<items[i].chance; a++) chances[chances.length] = items[i];
}

function newSpin() {
  list.style.top = '0';
  while(list.lastChild) list.removeChild(list.lastChild);

  for(let i = 0; i<total; i++) {
    let e = dummy.cloneNode(true);
    e.style.display = '';
    e.children[0].src = chances[Math.floor(Math.random() * chances.length)].image_url;
    list.append(e);
  }
}

start.onmouseup = () => {
  if(!spinning) {
    spinning = true;
    newSpin();

    start.style.animation = 'fadeout 1s';
    start.style.animationFillMode = 'forwards';

    list.style.animation = 'fadein 1s';
    list.style.animationFillMode = 'forwards';
  }
};

document.addEventListener('touchstart', e => {
  if(spinning) {
    clickBegin = Date.now();
    clickY = e.touches[0].screenY;
  }
});

document.addEventListener('touchend', e => {
  if(clickBegin && !clickEnded) {
    clickEnded = Date.now();

    let diffTime = clickEnded - clickBegin;
    let diffY = clickY - e.changedTouches[0].screenY;

    let v = diffY/diffTime*30;
    let i = 0;

    const move = () => {
      let i1 = Math.floor(i-(v-=decelleration/10));

      let p = list.animate([
        {
          top: `${i}px`,
        },
        {
          top: `${i1}px`,
        }
      ], 1);
      p.onfinish = () => {
        i = i1;
        if(v>=0) {
          move();
        } else {
          list.style.top = `${i1}px`;

          winIndex = -Math.round(i1/256)+1;

          for(let i = 0; i<total; i++) {
            if(i!==winIndex) {
              let e = list.children[i];
              e.style.animation = 'fadeout 1s';
              e.style.animationFillMode = 'forwards';
            }
          }

          list.animate([
            {
              top: `${i1}px`,
            },
            {
              top: `-${(winIndex-1)*256}px`,
            },
          ], 1000).onfinish = () => {
            list.style.top = `-${(winIndex-1)*256}px`;

            setTimeout(() => {
              list.style.animation = 'fadeout 1s';
              list.style.animationFillMode = 'forwards';

              start.style.animation = 'fadein 1s';
              start.style.animationFillMode = 'forwards';

              spinning = false;
            }, 1000);
          };

          clickEnded = false;
          clickBegin = false;
        }
      };
    };
    move();
  }
});
