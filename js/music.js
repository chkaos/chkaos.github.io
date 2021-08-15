var ap = null;
var isPlay = false

Object.defineProperty(document.querySelector("meting-js"), "aplayer", {
  set: function (aplayer) {
    ap = aplayer;
    ready();
  },
});

function ready() {
  ap.list.switch(0);
  toggleMusic()
}

function toggleMusic() {
  isPlay ? ap.pause() : ap.play();
  isPlay = !isPlay
}

