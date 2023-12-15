var highRiskMatters = [];
var gridModel = viewModel.getGridModel();
gridModel.on("afterSetDataSource", (data) => {
  const res = cb.rest.invokeFunction("511c5e6d576548ee8d6d9b2356fb9d1e", {}, null, gridModel, { async: false });
  if (res && res.result && res.result.request) {
    highRiskMatters = res.result.request;
  }
  let mode = viewModel.getParams().mode;
  // 卡片新增状态使用
  if (mode.toLocaleLowerCase() == "add") {
    //询价单默认标题
    viewModel.get("subject").setValue(data[0].productName);
  }
  //物料标识
  if (data.length > 0) {
    data.forEach((da, index) => {
      var productDescIndex = da.productDesc;
      var tag = 0;
      if (productDescIndex) {
        for (var i = 0; i < highRiskMatters.length; i++) {
          tag = productDescIndex.indexOf(highRiskMatters[i].name);
          if (tag > -1) {
            break;
          }
        }
        if (tag > -1) {
          gridModel.setCellValue(index, "item557xh", "🈲");
        }
      }
    });
  }
  if (data[0].status == "8") {
    data[0].statusName = "已生成合同";
    document.querySelector("span[class='wui-tag-text']").innerHTML = '<span class="separattag">已生成合同</span>';
  }
});
gridModel.on("afterInsertRows", (data) => {
  //物料标识
  if (data.rows.length > 0) {
    data.rows.forEach((da, index) => {
      var productDescIndex = da.productDesc;
      var tag = 0;
      if (productDescIndex) {
        for (var i = 0; i < highRiskMatters.length; i++) {
          tag = productDescIndex.indexOf(highRiskMatters[i].name);
          if (tag > -1) {
            break;
          }
        }
        if (tag > -1) {
          gridModel.setCellValue(index + 1, "item557ag", "🈲");
        }
      }
    });
  }
});