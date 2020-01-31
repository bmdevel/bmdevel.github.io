const start = document.getElementById('start');
const list = document.getElementById('list');
const dummy = document.getElementById('dummy');

const decelleration = settings.decelleration;
const total = settings.totalItems;
const items = settings.items;

let spinning = false;

let clickBegin;
let clickEnded;
let clickY;
let winIndex;

let childs = [];
items.forEach(item => {
  let e = document.createElement('link');
  e.rel = 'preload';
  e.href = item.image_url;
  document.head.appendChild(e);
});

function shuffle() {
  let a = 0;
  items.forEach(item => {
    let amount = Math.floor(item.chance / 100.0 * total);
    for(let i = 0; i<amount; i++) {
      childs[a+i] = item.image_url;
    }
    a+=amount;
  });

  for(let i = childs.length-1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i+1));
    [childs[i], childs[j]] = [childs[j],childs[i]];
  }
}

function newSpin() {
  list.style.top = '0';
  while(list.lastChild) list.removeChild(list.lastChild);
  
  shuffle();

  for(let i = 0; i<childs.length; i++) {
    let e = dummy.cloneNode(true);
    e.style.display = '';
    e.children[0].src = childs[i];
    list.appendChild(e);
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

    let v = diffY/diffTime*70;

    if(diffY<100) {
      clickBegin = undefined;
      clickEnded = undefined;

    } else {
      let i = 0;

      const move = () => {
        let i1 = Math.floor(i-(v-=decelleration)*8);

        let p = list.animate([
          {
            top: `${i}px`,
          },
          {
            top: `${i1}px`,
          }
        ], 800);
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

                setTimeout(() => {
                  spinning = false;
                }, 1000);
              }, 1000);
            };

            clickEnded = false;
            clickBegin = false;
          }
        };
      };
      move();
    }
  }
});
