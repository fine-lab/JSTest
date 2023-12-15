let billCode = ""; //来源单据号
let billType = ""; //来源单据类型
viewModel.get("button0fd") &&
  viewModel.get("button0fd").on("click", function (data) {
    let row = viewModel.getGridModel().getRow(data.index);
    let isMinPacking = false;
    if (row.cpbzjb == row.bznhxyjbzcpbs) {
      isMinPacking = true;
    }
    let page = {
      billtype: "Voucher", // 单据类型
      billno: "6e8b687a", // 单据号
      params: {
        mode: "edit", // (编辑态、新增态、浏览态)
        configId: row.id,
        sonNum: row.bznhxyjbzcpbssl,
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
  initMaterialList(params);
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