let eggTitle = `Pornhub.com - Free Porn Videos & Sex Movies - Porno, XXX, Porn Tube and Pussy Porn`
let titleInterval = 366
let defaultFavicon = '/img/favicon.ico'
let eggFavicon = '/img/favicon-egg.ico'
let reallyTitle 

// 滚动器
const setTitle = title => {
  document.title = title
}

const setFavicon = (src) => {
  const link = document.createElement('link')
  const oldLink = document.getElementById('favicon')

  link.id = 'favicon';
  link.rel = 'shortcut icon';
  link.type = 'image/x-icon'
  link.href = src;
  if (oldLink) {
    document.head.removeChild(oldLink);
  }
  document.head.appendChild(link);
}

// 彩蛋
const startTitleEgg = () => {
  reallyTitle = document.title
  setTitle(eggTitle)
  setFavicon(eggFavicon)
}

// 恢复默认
const resetTitle = () => {
  setFavicon(defaultFavicon)
  document.title = reallyTitle
}

document.addEventListener('visibilitychange', event => {
  event.target.hidden || event.target.webkitHidden
    ? startTitleEgg()
    : resetTitle()
}, false)