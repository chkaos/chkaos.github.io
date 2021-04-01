/**
 * 复制時加上版權信息
 */

document.body.oncopy = function (event) {
  event.preventDefault();
  let textFont;
  const copyFont = window.getSelection(0).toString();
  if (copyFont.length > 45) {
    textFont =
      copyFont +
      "\n" +
      "\n" +
      "\n" +
      "作者: chkaos" +
      "\n" +
      "链接: " +
      window.location.href +
      "\n" +
      "来源: chkaos.top" +
      "\n" +
      "著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。";
  } else {
    textFont = copyFont;
  }
  if (event.clipboardData) {
    return event.clipboardData.setData("text", textFont);
  } else {
    // 兼容IE
    return window.clipboardData.setData("text", textFont);
  }
};
