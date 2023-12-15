cb.defineInner([], function () {
  var MyExternal = {
    fuc1: function (s) {
      let res = "验证的结果为：" + s;
      cb.utils.alert(res); //将传入的值toast提示，页面上检查提示内容
    }
  };
  return MyExternal;
});