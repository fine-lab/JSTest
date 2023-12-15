//物料积分回写需求
viewModel.getGridModel().on("beforeSetDataSource", function (data) {
  debugger;
  var ids = [];
  for (var i = 0; i < data.length; i++) {
    ids[i] = data[i]["productId"];
  }
  let res = cb.rest.invokeFunction("SCMSA.salereturnGroup.getProductBatch", { ids: ids }, function (err, res) {}, viewModel, { async: false });
  if ((res.result.result.res.code = "200")) {
    var productDetails = res.result.result.res.data.recordList;
    var map = new Map();
    for (var i = 0; i < productDetails.length; i++) {
      var defines = [productDetails[i].define.define2, productDetails[i].define.define3];
      map.set(productDetails[i].id, defines);
    }
    for (var i = 0; i < data.length; i++) {
      if (map.get(data[i]["productId"]) != undefined) {
        var define12 = map.get(data[i]["productId"])[0];
        var define14 = map.get(data[i]["productId"])[1];
        data[i]["bodyItem!define12"] = define12;
        data[i]["bodyItem!define14"] = define14 / 500;
        if (data[i].bodyItem != undefined) {
          data[i].bodyItem.define12 = define12;
          data[i].bodyItem.define14 = define14 / 500;
        }
      }
      if (data[i]["subQty"] != 0) {
        data[i]["bodyItem!define13"] = Number(data[i]["bodyItem!define12"]) * data[i]["subQty"];
        data[i]["bodyItem!define15"] = Number(data[i]["bodyItem!define14"]) * data[i]["subQty"];
        if (data[i].bodyItem != undefined) {
          data[i].bodyItem.define13 = data[i]["bodyItem!define13"];
          data[i].bodyItem.define15 = data[i]["bodyItem!define15"];
        }
      }
    }
  }
  //限流
});
viewModel.on("afterDeleteRow", function (data) {
  //删除时计算表头
  //入参里没有能区分行属于哪个表的信息,所以用productId区分,有物料积分才进行操作
  if ((data[0]["bodyItem!define12"] || data[0]["bodyItem!define14"]) && data[0].productId) {
    //删除行后同步表头数据
    let totalPoing = viewModel.get("headItem!define55").getData();
    let totalVl = viewModel.get("headItem!define56").getData();
    for (var row of data) {
      let linePointSum = Number(row["bodyItem!define13"]);
      let lineVlSum = Number(row["bodyItem!define15"]);
      linePointSum && (totalPoing -= linePointSum);
      lineVlSum && (totalVl -= lineVlSum);
    }
    viewModel.get("headItem!define55").setValue(totalPoing);
    viewModel.get("headItem!define56").setValue(totalVl);
  }
});
viewModel.on("afterCopyrow", function (data) {
  //复制行时计算表头
  debugger;
  //入参里没有能区分行属于哪个表的信息,所以用productId区分,有物料积分才进行操作
  data = data.data.rowData.row;
  if ((data["bodyItem!define12"] || data["bodyItem!define14"]) && data.productId) {
    //复制行后同步表头数据
    let totalPoing = viewModel.get("headItem!define55").getData();
    let totalVl = viewModel.get("headItem!define56").getData();
    let linePointSum = Number(data["bodyItem!define13"]);
    let lineVlSum = Number(data["bodyItem!define15"]);
    linePointSum && (totalPoing += linePointSum);
    lineVlSum && (totalVl += lineVlSum);
    viewModel.get("headItem!define55").setValue(totalPoing);
    viewModel.get("headItem!define56").setValue(totalVl);
  }
});