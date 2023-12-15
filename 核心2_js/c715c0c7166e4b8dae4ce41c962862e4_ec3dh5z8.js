viewModel.get("button79ig") &&
  viewModel.get("button79ig").on("click", function (data) {
    // 存货--单击
    var rows = viewModel.getGridModel().getSelectedRows();
    if (rows.length == 0) {
      cb.utils.alert("请先选择数据!");
      return false;
    }
    var ids = new Set();
    for (var i = 0; i < rows.length; i++) {
      ids.add(rows[i].id);
    }
    var queryBodyRes = cb.rest.invokeFunction("SCMSA.backDesignerFunction.queryBodyMater", { ids: Array.from(ids) }, function (err, res) {}, viewModel, { async: false });
    if (queryBodyRes.error) {
      cb.utils.alert("存货导出失败:组装数据异常," + queryBodyRes.error.message, "error");
      return false;
    } else {
      arrayToCsv(queryBodyRes.result.returnData, "Inventory");
    }
  });
viewModel.get("button92vj") &&
  viewModel.get("button92vj").on("click", function (data) {
    // 发票--单击
    var rows = viewModel.getGridModel().getSelectedRows();
    if (rows.length == 0) {
      cb.utils.alert("请先选择数据!");
      return false;
    }
    var ids = new Set();
    for (var i = 0; i < rows.length; i++) {
      ids.add(rows[i].id);
    }
    var queryInvoiceRes = cb.rest.invokeFunction("SCMSA.backDesignerFunction.queryInvoice", { ids: Array.from(ids) }, function (err, res) {}, viewModel, { async: false });
    if (queryInvoiceRes.error) {
      cb.utils.alert("发票导出失败:组装数据异常," + queryInvoiceRes.error.message, "error");
      return false;
    } else {
      arrayToCsv(queryInvoiceRes.result.returnData, "Invoice");
    }
  });
viewModel.get("button106eh") &&
  viewModel.get("button106eh").on("click", function (data) {
    // 客户--单击
    var rows = viewModel.getGridModel().getSelectedRows();
    if (rows.length == 0) {
      cb.utils.alert("请先选择数据!");
      return false;
    }
    var ids = new Set();
    for (var i = 0; i < rows.length; i++) {
      ids.add(rows[i].id);
    }
    var headMerRes = cb.rest.invokeFunction("SCMSA.backDesignerFunction.queryHeadMer", { ids: Array.from(ids) }, function (err, res) {}, viewModel, { async: false });
    if (headMerRes.error) {
      cb.utils.alert("客户导出失败:组装数据异常," + headMerRes.error.message, "error");
      return false;
    } else {
      arrayToCsv(headMerRes.result.returnData, "Customer");
    }
  });
function arrayToCsv(bodyResData, title) {
  let str = "";
  for (let i = 0; i < bodyResData.length; i++) {
    let bodyData = bodyResData[i];
    for (let j = 0; j < bodyData.length; j++) {
      let data = bodyData[j];
      if (data == null) {
        data = "";
      }
      str += data;
      if (j != bodyData.length - 1) {
        str += ",";
      } else {
        str += "\n";
      }
    }
  }
  let uri = "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(str);
  //通过创建a标签实现
  let link = document.createElement("a");
  link.href = uri;
  //对下载的文件命名
  link.download = title + ".csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
viewModel.get("dropdownbutton34xi").setState("visible", false);