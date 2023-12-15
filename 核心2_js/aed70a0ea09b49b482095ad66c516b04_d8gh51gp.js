viewModel.get("money") &&
  viewModel.get("money").on("afterValueChange", function (data) {
    // 含税金额--值改变后
    var moneyValue = viewModel.get("money").getValue() == null ? 0 : viewModel.get("money").getValue();
    var taxCode = viewModel.get("taxRate_code").getValue();
    var taxValue = 0;
    if (taxCode != null) {
      var taxRes = cb.rest.invokeFunction("AT15F164F008080007.backDesignerFunction.queryTaxValue", { code: taxCode }, function (err, res) {}, viewModel, { async: false });
      if (taxRes.error) {
        cb.utils.alert("计算错误：" + taxRes.error.message);
      } else {
        taxValue = taxRes.result.taxValue;
      }
    }
    //无税金额
    var wushuijineValue = moneyValue / (1 + taxValue);
    wushuijineValue = Math.round(wushuijineValue * 10000) / 10000;
    //税额
    var shuieValue = Math.round((moneyValue - wushuijineValue) * 100) / 100;
    //更改数值
    viewModel.get("wushuijine").setValue(wushuijineValue);
    viewModel.get("shuie").setValue(shuieValue);
  });
viewModel.get("taxRate_code") &&
  viewModel.get("taxRate_code").on("afterValueChange", function (data) {
    // 税率(%)--值改变后
    if (data.value == null) {
      viewModel.get("taxRate_ntaxRate").setValue(null);
      viewModel.get("wushuijine").setValue(0);
      viewModel.get("shuie").setValue(0);
    } else {
      viewModel.get("taxRate_ntaxRate").setValue(data.value.ntaxRate);
      var moneyValue = viewModel.get("money").getValue() == null ? 0 : viewModel.get("money").getValue();
      var taxValue = viewModel.get("taxRate_code").getValue() == null ? 0 : data.value.ntaxRate / 100;
      //无税金额
      var wushuijineValue = moneyValue / (1 + taxValue);
      wushuijineValue = Math.round(wushuijineValue * 10000) / 10000;
      //税额
      var shuieValue = Math.round((moneyValue - wushuijineValue) * 100) / 100;
      //更改数值
      viewModel.get("wushuijine").setValue(wushuijineValue);
      viewModel.get("shuie").setValue(shuieValue);
    }
  });
viewModel.get("project_code") &&
  viewModel.get("project_code").on("afterValueChange", function (data) {
    // 检测项目编码--值改变后
    if (data.value == null) {
      viewModel.get("project_name").setValue(null);
    } else {
      viewModel.get("project_name").setValue(data.value.name);
    }
  });
viewModel.get("merchant_code") &&
  viewModel.get("merchant_code").on("afterValueChange", function (data) {
    // 送检单位编码--值改变后
    if (data.value == null) {
      viewModel.get("merchant_name").setValue(null);
    } else {
      viewModel.get("merchant_name").setValue(data.value.name);
    }
  });