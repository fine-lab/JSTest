let billCode = ""; //来源单据号
let billType = ""; //来源单据类型
viewModel.get("button3ma") &&
  viewModel.get("button3ma").on("click", function (data) {
    let row = viewModel.getGridModel("sy01_udi_product_configure2List").getSelectedRows();
    if (row == null || row.length == 0) {
      cb.utils.alert("请选择对应包装产品标识！");
      return;
    }
    let isMinPacking = false;
    if (row[0].cpbzjb == row[0].bznhxyjbzcpbs) {
      isMinPacking = true;
    }
    let page = {
      billtype: "Voucher", // 单据类型
      billno: "6e8b687a", // 单据号
      params: {
        mode: "edit", // (编辑态、新增态、浏览态)
        configId: row[0].id,
        sonNum: row[0].bznhxyjbzcpbssl,
        billCode: billCode,
        billType: billType,
        isMinPacking: isMinPacking
      }
    };
    cb.loader.runCommandLine("bill", page, viewModel);
  });
viewModel.on("customInit", function (data) {
  billCode = viewModel.getParams().billCode;
  billType = viewModel.getParams().billType;
  let params = { billType: billType, billCode: billCode };
  //根据不同来源单据初始化商品列表
});
function initMaterialList(params) {
  return new Promise((resolve) => {
    cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.getVarietyOrder", params, function (err, res) {
      if (typeof res != "undefined") {
        let result = res.result;
      } else if (typeof err != "undefined") {
        cb.utils.alert(err);
        reject(err);
      }
    });
  });
}
viewModel.get("sy01_udi_product_configure2List") &&
  viewModel.get("sy01_udi_product_configure2List").on("beforeSetDataSource", function (data) {
  });