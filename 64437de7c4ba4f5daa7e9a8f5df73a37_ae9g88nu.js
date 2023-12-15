let billId = ""; //来源单据id
let billType = ""; //来源单据类型
let billCode = ""; //来源单据号
let udiProductList = []; //商品关联包装标识数据
viewModel.on("customInit", function (data) {
  billCode = viewModel.getParams().billCode;
  billType = viewModel.getParams().billType;
  billId = viewModel.getParams().billId;
  let params = { billType: billType, billCode: billCode, billId: billId };
  //根据不同来源单据初始化商品列表
  initMaterialList(params);
});
viewModel.get("button12oi") &&
  viewModel.get("button12oi").on("click", function (data) {
    let row = viewModel.getGridModel("sy01_udi_product_configure2List").getSelectedRows();
    if (row == null || row.length == 0) {
      cb.utils.alert("请选择一条包装产品标识！");
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
viewModel.get("sy01_udi_product_info_1515105170296406019") &&
  viewModel.get("sy01_udi_product_info_1515105170296406019").on("afterSelect", function (data) {
    // 表格--选择后
    console.log(data);
    let row = viewModel.get("sy01_udi_product_info_1515105170296406019").getRow(data[data.length - 1]);
    loadSonList(row.id);
  });
viewModel.get("sy01_udi_product_info_1515105170296406019") &&
  viewModel.get("sy01_udi_product_info_1515105170296406019").on("afterUnselect", function (data) {
    // 表格--取消选中后
    console.log(data);
    let row = viewModel.get("sy01_udi_product_info_1515105170296406019").getRow(data[data.length - 1]);
    loadSonList(row.id);
  });
//加载子表格数据
function loadSonList(udiProductId) {
  return new Promise((resolve) => {
    cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.getMaterialPg", { udiProductId: udiProductId }, function (err, res) {
      if (typeof res != "undefined") {
        let result = res.result;
        if (result != null && result.length > 0) {
          viewModel.getGridModel("sy01_udi_product_configure2List").setDataSource(result);
        }
      } else if (typeof err != "undefined") {
        cb.utils.alert(err);
        reject(err);
      }
    });
  });
}
function initMaterialList(params) {
  return new Promise((resolve) => {
    cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.getVarietyOrder", params, function (err, res) {
      if (typeof res != "undefined") {
        let result = res.result;
        if (result == null || result.length == 0) {
          cb.utils.alert("本来源单据物料信息没有配置对应包装产品标识！");
        } else {
          udiProductList = result;
        }
      } else if (typeof err != "undefined") {
        cb.utils.alert(err);
        reject(err);
      }
    });
  });
}
viewModel.get("sy01_udi_product_info_1515105170296406019") &&
  viewModel.get("sy01_udi_product_info_1515105170296406019").on("beforeSetDataSource", function (data) {
    // 表格--设置数据源前
    console.log(data);
  });