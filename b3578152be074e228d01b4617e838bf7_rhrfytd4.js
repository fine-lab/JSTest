let billId = ""; //来源单据id
let billType = ""; //来源单据类型
let billCode = ""; //来源单据号
let maxUdiNum = 0; //来源单据物料数量
let batchno = ""; //来源单据物料批次号
let invaliddate = ""; //来源单据物料有效期至
let producedate = ""; //来源单据物料生产日期
let unitName = ""; //来源单据物料主计量名称
let spec = ""; //规格型号
let serialList = ""; //来源单据物料序列号
let initNum = 0;
viewModel.on("customInit", function (data) {
  billType = viewModel.getParams().billType;
  let billData = viewModel.getParams().billData;
  billCode = billData.billCode;
  let params = { billType: billType, billData: billData };
  //根据不同来源单据初始化商品列表
  initMaterialList(params);
});
viewModel.get("button21sj") &&
  viewModel.get("button21sj").on("click", function (data) {
    viewModel.un("back");
    // 生成UDI--单击
    let row = viewModel.get("sy01_udi_product_configureList").getRow(data.index);
    let isMinPacking = false;
    if (row.bzcpbs == row.bznhxyjbzcpbs) {
      //最小包装时
      isMinPacking = true;
    }
    if (invaliddate != null && invaliddate != "") {
      invaliddate = invaliddate.substr(0, 10);
    }
    if (producedate != null && producedate != "") {
      producedate = producedate.substr(0, 10);
    }
    let page = {
      billtype: "Voucher", // 单据类型
      billno: "99f8f957", // 单据号
      params: {
        mode: "add", // (编辑态、新增态、浏览态)
        configId: row.id,
        sonNum: row.bznhxyjbzcpbssl,
        maxUdiNum: maxUdiNum,
        batchno: batchno,
        invaliddate: invaliddate,
        producedate: producedate,
        billCode: billCode,
        billType: billType,
        unitName: unitName,
        spec: spec,
        serialList: serialList,
        isMinPacking: isMinPacking
      }
    };
    cb.loader.runCommandLine("bill", page, viewModel);
  });
viewModel.get("sy01_udi_product_infoList") &&
  viewModel.get("sy01_udi_product_infoList").on("afterSelect", function (data) {
    // 表格--选择后
    let row = viewModel.get("sy01_udi_product_infoList").getRow(data[data.length - 1]);
    maxUdiNum = row.maxUdiNum;
    batchno = row.batchno;
    invaliddate = row.invaliddate;
    producedate = row.producedate;
    unitName = row.unitName;
    serialList = row.serialList;
    spec = row.productSpecifications;
    loadSonList(row.id);
  });
//加载子表格数据
function loadSonList(udiProductId) {
  return new Promise((resolve) => {
    cb.rest.invokeFunction("I0P_UDI.publicFunction.getMaterialPg", { udiProductId: udiProductId }, function (err, res) {
      if (typeof res != "undefined") {
        let result = res.result;
        if (result != null && result.length > 0) {
          viewModel.get("sy01_udi_product_configureList").setDataSource(result);
        }
      } else if (typeof err != "undefined") {
        cb.utils.alert(err, "error");
      }
    });
  });
}
function initMaterialList(params) {
  return new Promise((resolve) => {
    cb.rest.invokeFunction("I0P_UDI.publicFunction.getVarietyOrder", params, function (err, res) {
      if (typeof res != "undefined") {
        let result = res.result;
        if (result == null || result.length == 0) {
          cb.utils.alert("来源单据物料信息没有配置对应包装产品标识！", "error");
        } else {
          viewModel.getGridModel("sy01_udi_product_infoList").setDataSource(result);
        }
      } else if (typeof err != "undefined") {
        cb.utils.alert(err, "error");
      }
    });
  });
}