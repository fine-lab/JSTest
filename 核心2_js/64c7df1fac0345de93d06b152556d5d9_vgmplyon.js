function loadScript(src, attrs) {
  return new Promise((resolve, reject) => {
    try {
      let scriptEle = document.createElement("script");
      scriptEle.type = "text/javascript";
      scriptEle.src = src;
      for (let key in attrs) {
        scriptEle.setAttribute(key, attrs[key]);
      }
      scriptEle.addEventListener("load", function () {
        resolve("成功");
      });
      document.body.appendChild(scriptEle);
    } catch (err) {
      reject(err);
    }
  });
}
loadScript("https://www.example.com/", { async: false }).then((res) => {
  console.log(res, "加载js完成");
  loadCss();
});
function loadCss() {
  $(".dq-table .wui-tabs .wui-tabs-content .wui-tabs-tabpane ").css({ backgroundColor: "#fff" });
}