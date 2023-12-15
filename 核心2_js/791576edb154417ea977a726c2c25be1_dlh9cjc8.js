cb.defineInner([], function () {
  var MyExternal = {
    //注册扩展公共函数
    loadStyle(params) {
      var headobj = document.getElementsByTagName("head")[0];
      var style = document.createElement("style");
      style.type = "text/css";
      headobj.appendChild(style);
      style.sheet.insertRule(params, 0);
    }
  };
  return MyExternal;
});