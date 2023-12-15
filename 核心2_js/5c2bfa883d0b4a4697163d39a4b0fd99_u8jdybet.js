window.KPextend = {
  invokeFunc: function (
    funcName,
    swhere = {},
    ayc = false //异步时回调函数才有用
  ) {
    var d = cb.rest.invokeFunction(
      funcName,
      swhere,
      function (err, res) {
        alert(funcName + "调用错误:" + res);
      },
      viewModel,
      { async: ayc }
    );
    if (d.hasOwnProperty("error")) {
      alert(funcName + "函数调用错误!");
      console.log("invokeFunc=-------------------------");
      console.log(d);
    }
    return d.result.result;
  }
};
viewModel.get("button15zf") &&
  viewModel.get("button15zf").on("click", function (data) {
    console.log("Save------------------");
    var ups = viewModel.getDirtyData()?.merchant3_1670936342082093058;
    for (var up in ups) {
      var res = window.KPextend.invokeFunc("AT16F632B808C80005.API.updateData", { data: ups[up] });
      if (!res || !res.id) {
        alert("更新失败！id:" + ups[up].id);
        return false;
      }
    }
    alert("更新成功!");
  });