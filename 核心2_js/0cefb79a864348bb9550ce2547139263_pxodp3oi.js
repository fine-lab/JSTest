viewModel.get("ower_name") &&
  viewModel.get("ower_name").on("beforeBrowse", function (data) {
    let mainOrgId = viewModel.get("org").getValue(); //河南国立控股有限公司
    debugger;
    let condition = { isExtend: true, simpleVOs: [] };
    let op = "eq";
    let org = "1573823489411383310";
    condition.simpleVOs.push({
      logicOp: "and",
      conditions: [
        {
          field: "mainJobList.org_id",
          op: "in",
          value1: [mainOrgId]
        }
      ]
    });
    if (mainOrgId != org) {
      condition.simpleVOs[0].conditions.push({
        field: "mainJobList.org_id",
        op: "neq",
        value1: org
      });
    }
    this.setFilter(condition);
  });
viewModel.get("cellPhone") &&
  viewModel.get("cellPhone").on("afterValueChange", function (data) {
    // 手机--值改变后
    var telStr = viewModel.get("cellPhone").getValue();
    if (telStr == null || telStr.trim() == "") {
      return;
    }
    cb.rest.invokeFunction("SFA.serviceFunc.checkTelExisted", { reqEmail: telStr }, function (err, res) {
      var rst = res.rst;
      if (rst) {
        var clueInfo = res.data[0];
        cb.utils.alert("温馨提示，手机号有重复数据，请查询确认", "error");
      } else {
        cb.utils.alert("温馨提示，没有重复数据，请放心录入！！！", "info");
      }
    });
  });
viewModel.get("extendxqcpnew") &&
  viewModel.get("extendxqcpnew").on("afterValueChange", function (data) {
    // 客户需求产品--值改变后
    updateTitle();
  });
viewModel.get("headDef!define2") &&
  viewModel.get("headDef!define2").on("afterValueChange", function (data) {
    updateTitle();
  });
viewModel.on("afterLoadData", function (data) {
  let xunpan = viewModel.get("headDef!define1_name").getValue();
  if (xunpan != undefined && xunpan != "") {
    return;
  }
  let rest = cb.rest.invokeFunction("GT3734AT5.APIFunc.getUsrRoleApi", {}, function (err, res) {}, viewModel, { async: false });
  let staffId = rest.result.data.currentUser.staffId;
  let staffName = rest.result.data.currentUser.name;
  viewModel.get("headDef!define1_name").setValue(staffName);
  viewModel.get("headDef!define1").setValue(staffId);
});
function updateTitle() {
  var shijian = viewModel.get("headDef!define2").getValue();
  if (shijian == undefined || shijian == null || shijian == "") {
    shijian = "";
  } else {
    let hh = shijian.substring(11, 13);
    shijian = shijian.substring(0, 10);
    shijian = shijian.replaceAll("-", "");
    viewModel.get("extendxpsd").setValue(hh);
  }
  var xpry = viewModel.get("headDef!define1_name").getValue();
  if (xpry == undefined || xpry == null) {
    xpry = "";
  }
  var xqcp = getTextFromEnumObj(viewModel.get("extendxqcpnew"));
  viewModel.get("name").setValue(shijian + xpry + xqcp);
}
function getTextFromEnumObj(enumObj, val) {
  if (val == undefined || val == null) {
    val = enumObj.getValue();
  }
  let dataArray = enumObj.__data.keyMap;
  for (var idx in dataArray) {
    let itemData = dataArray[idx];
    if (itemData.value == val) {
      return itemData.text;
    }
  }
  return "";
}