cb.defineInner([], function () {
  var MyExternal = {
    fuc1: function (s) {
      cb.utils.alert(s); //将传入的值toast提示，页面上检查提示内容
    }
  };
  return MyExternal;
});