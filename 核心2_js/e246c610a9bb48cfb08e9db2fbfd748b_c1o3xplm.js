viewModel.get("parentPartCode_code") &&
  viewModel.get("parentPartCode_code").on("afterValueChange", function (data) {
    // 母件编码--值改变后
    // 改变后清除所有行
    var gridModel = viewModel.getGridModel();
    var value = data.value;
    var old = data.oldValue;
    if (value == null || value != old) {
      viewModel.get("amountSummary").setValue(viewModel.get("inmoney").getValue());
      gridModel.deleteAllRows();
    }
    if (data.value.hasOwnProperty("id")) {
      var grid = viewModel.getGridModel("BOMCalculationDetailsList");
      var id = data.value.id;
      var useType_id = viewModel.get("useType").getValue();
      var tt = cb.rest.invokeFunction("AT1650E48C08780009.API.queryMaterils", { id: id, useType: useType_id }, function (err, res) {}, viewModel, { async: false });
      if (tt.result.queryData.arrays != undefined) {
        for (var i = 0; i < tt.result.queryData.arrays.length; i++) {
          grid.appendRow(tt.result.queryData.arrays[i]);
        }
      }
      let childmoney = tt.result.queryData.totalMoney == null ? 0 : tt.result.queryData.totalMoney;
      viewModel.get("childmoney").setValue(tt.result.queryData.totalMoney);
      setTotalvalue(viewModel);
    }
  });
viewModel.get("useType_name") &&
  viewModel.get("useType_name").on("afterValueChange", function (data) {
    var gridModel = viewModel.getGridModel();
    var value = data.value;
    var old = data.oldValue;
    if (value == old) return;
    if (value == null) {
      viewModel.get("parentPartCode_code").setState("bCanModify", false);
      viewModel.get("parentPartCode_code").setState("readOnly", true);
    } else {
      viewModel.get("parentPartCode_code").setState("bCanModify", true);
      viewModel.get("parentPartCode_code").setState("readOnly", false);
    }
    viewModel.get("childmoney").setValue(null);
    viewModel.get("parentPartCode_code").setValue(null);
    gridModel.deleteAllRows();
    setTotalvalue(viewModel);
  });
viewModel.get("inmoney") &&
  viewModel.get("inmoney").on("afterValueChange", function (data) {
    let inmoney = data.value == null ? 0 : data.value;
    let childmoney = viewModel.get("childmoney").getValue();
    let totalmoney = childmoney + inmoney;
    viewModel.get("amountSummary").setValue(totalmoney);
  });
viewModel.get("BOMCalculationDetailsList") &&
  viewModel.get("BOMCalculationDetailsList").getEditRowModel() &&
  viewModel.get("BOMCalculationDetailsList").getEditRowModel().get("subPartCode_code") &&
  viewModel
    .get("BOMCalculationDetailsList")
    .getEditRowModel()
    .get("subPartCode_code")
    .on("afterValueChange", function (data) {
      // 子件编码--值改变
      debugger;
      var id = data.value[0].id;
      var list = cb.rest.invokeFunction("AT1650E48C08780009.API.addData", { id: id }, function (err, res) {}, viewModel, { async: false });
      var amount = list.result.number;
      var quantity = 0;
      var grid = viewModel.getGridModel("BOMCalculationDetailsList");
      var Row = grid.__data.focusedRowIndex;
      grid.setCellValue(Row, "unitPrice", amount);
      grid.setCellValue(Row, "numberSubParts", quantity);
    });
viewModel.get("org_id_name") &&
  viewModel.get("org_id_name").on("afterValueChange", function (data) {
    // 组织--值改变后
    viewModel.get("parentPartCode_code").setValue(null);
    viewModel.get("parentPartCode_code").setState("bCanModify", false);
    viewModel.get("parentPartCode_code").setState("readOnly", true);
  });
viewModel.get("xiaoshoudanjia") &&
  viewModel.get("xiaoshoudanjia").on("afterValueChange", function (data) {
    //销售单价--值改变后
    let value = getDataVlaue(data) - getItemkeyValue(viewModel, "chengbenjia");
    setItemKeyValue(viewModel, "yongjin", value);
    setTotalvalue(viewModel);
  });
viewModel.get("chengbenjia") &&
  viewModel.get("chengbenjia").on("afterValueChange", function (data) {
    //成交价--值改变后
    let value = getItemkeyValue(viewModel, "xiaoshoudanjia") - getDataVlaue(data);
    setItemKeyValue(viewModel, "yongjin", value);
    setTotalvalue(viewModel);
  });
viewModel.get("shuilv") &&
  viewModel.get("shuilv").on("afterValueChange", function (data) {
    //税率--值改变后
    setTotalvalue(viewModel);
  });
viewModel.get("yongjin") &&
  viewModel.get("yongjin").on("afterValueChange", function (data) {
    //佣金(金额)--值改变后
    setTotalvalue(viewModel);
  });
viewModel.get("yongjinbaifenbi") &&
  viewModel.get("yongjinbaifenbi").on("afterValueChange", function (data) {
    //佣金(百分比)--值改变后
    setTotalvalue(viewModel);
  });
viewModel.get("guanlifei") &&
  viewModel.get("guanlifei").on("afterValueChange", function (data) {
    //管理费%--值改变后
    setTotalvalue(viewModel);
  });
viewModel.get("ziduan15") &&
  viewModel.get("ziduan15").on("afterValueChange", function (data) {
    //运费--值改变后
    setTotalvalue(viewModel);
  });
viewModel.get("lirun") &&
  viewModel.get("lirun").on("afterValueChange", function (data) {
    //利润%--值改变后
    setTotalvalue(viewModel);
  });
viewModel.get("sunhaofei") &&
  viewModel.get("sunhaofei").on("afterValueChange", function (data) {
    //损耗费%--值改变后
    setTotalvalue(viewModel);
  });
viewModel.get("qita") &&
  viewModel.get("qita").on("afterValueChange", function (data) {
    //其他--值改变后
    setTotalvalue(viewModel);
  });
function getDataVlaue(data) {
  let value = data.value;
  if (value == null) {
    value = 0;
  }
  return value;
}
function setItemKeyValue(viewModel, key, value) {
  viewModel.get(key).setValue(value);
}
function getItemkeyValue(viewModel, key) {
  let keyitem = viewModel.get(key);
  let value = 0;
  if (undefined != keyitem && null != viewModel.get(key).getValue()) {
    value = viewModel.get(key).getValue();
  }
  return value;
}
function setTotalvalue(viewModel) {
  let value = getTotalmoneyvalue(viewModel);
  setItemKeyValue(viewModel, "amountSummary", value);
}
function getTotalmoneyvalue(viewModel) {
  let vale = 0;
  let childmoney = getItemkeyValue(viewModel, "childmoney");
  let shuilv = getItemkeyValue(viewModel, "shuilv") / 100;
  let yongjin = getItemkeyValue(viewModel, "yongjin");
  let yongjinbaifenbi = getItemkeyValue(viewModel, "yongjinbaifenbi") / 100;
  let guanlifei = getItemkeyValue(viewModel, "guanlifei") / 100;
  let ziduan15 = getItemkeyValue(viewModel, "ziduan15");
  let lirun = getItemkeyValue(viewModel, "lirun") / 100;
  let sunhaofei = getItemkeyValue(viewModel, "sunhaofei") / 100;
  let xiaoshoudanjia = getItemkeyValue(viewModel, "xiaoshoudanjia");
  let chengbenjia = getItemkeyValue(viewModel, "chengbenjia");
  let qita = getItemkeyValue(viewModel, "qita");
  value = ((childmoney * (1 + sunhaofei) + ziduan15 + qita) * (1 + guanlifei) + xiaoshoudanjia * yongjinbaifenbi + yongjin) * (1 + lirun) * (1 + shuilv);
  return value;
}