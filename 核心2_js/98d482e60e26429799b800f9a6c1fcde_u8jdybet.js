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
viewModel.getGridModel().setState("dataSourceMode", "local");
let result = window.KPextend.invokeFunc("AT16F632B808C80005.API.getOrg", {});
let kecodes = "";
let len = result.length;
result.forEach((v, i) => {
  kecodes += "'" + v.code + "'" + (i == len - 1 ? "" : ",");
});
kecodes = "2B23";
viewModel.on("afterMount", function (data) {});
viewModel.get("merchant3_1763806634681303043") &&
  viewModel.get("merchant3_1763806634681303043").on("beforeSetDataSource", function (data) {
    //表格--设置数据源前
    var sql = "select * from  AT16F632B808C80005.AT16F632B808C80005.Merchant3 where type=0 and disableTime is not null";
    var gmData = window.KPextend.invokeFunc("AT16F632B808C80005.API.getData", { sql: sql });
    gmData.forEach((it, i) => {
      data[i] = it;
    });
  });
viewModel.on("customInit", function (data) {
  //客户档案3参照--页面初始化
});