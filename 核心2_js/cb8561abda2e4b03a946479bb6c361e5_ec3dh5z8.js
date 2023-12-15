viewModel.get("headFreeItem!define4_fapiaoshuihao") &&
  viewModel.get("headFreeItem!define4_fapiaoshuihao").on("beforeBrowse", function (data) {
    var orgId = viewModel.get("orgId").getValue(); //开票组织
    var billDate = viewModel.get("vouchdate").getValue();
    // 实现发票税号的过滤
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "org_id",
      op: "eq",
      value1: orgId
    });
    condition.simpleVOs.push({
      field: "fpzt",
      op: "eq",
      value1: "10" //未用
    });
    condition.simpleVOs.push({
      field: "yearValue",
      op: "eq",
      value1: billDate.substr(0, 4) //未用
    });
    this.setFilter(condition);
  });
viewModel.on("customInit", function (data) {
  // 销售发票--页面初始化
});
viewModel.on("modeChange", function (data) {
  if (data == "add") {
    var orgId = viewModel.get("orgId").getValue();
    //查询开票组织对应的国家区域
    var countryRes = cb.rest.invokeFunction("SCMSA.backDesignerFunction.queryCountryData", { orgId: orgId }, function (err, res) {}, viewModel, { async: false });
    if (countryRes.error) {
      cb.utils.alert("查询开票组织对应国家地区出错，" + countryRes.error.message, "error");
      return false;
    } else {
      var countryData = countryRes.result.code;
      if (countryData == "ID") {
        //印尼：新增时默认设置客开发票税号
        var billDate = viewModel.get("vouchdate").getValue();
        var defValue = cb.rest.invokeFunction("SCMSA.backDesignerFunction.defaultTaxId", { orgId: orgId, billDate: billDate }, function (err, res) {}, viewModel, { async: false });
        if (defValue.error) {
          cb.utils.alert("设置默认发票税号出错，" + defValue.error.message, "error");
          return false;
        } else {
          var defData = defValue.result.returnData;
          if (defData == null) {
            cb.utils.alert("设置默认发票税号失败，该组织下单据日期年份已无空余发票税号", "error");
            return false;
          } else {
          }
        }
      }
    }
  }
});
viewModel.get("vouchdate") &&
  viewModel.get("vouchdate").on("afterValueChange", function (data) {
    // 单据日期--值改变后
    viewModel.get("headFreeItem!define4").setValue(null);
    viewModel.get("headFreeItem!define4_fapiaoshuihao").setValue(null);
  });