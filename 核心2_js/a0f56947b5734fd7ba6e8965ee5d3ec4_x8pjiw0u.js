viewModel.get("btnAutoPick").on("click", function () {
  debugger;
  if (
    viewModel.getParams().parentParams.billNo == "po_production_order_list" || //生产订单列表
    viewModel.getParams().parentParams.billNo == "po_production_order"
  ) {
    //生产订单详情
    getAmountData(viewModel, 0);
  }
});
viewModel.on("afterBuildCode", function (args) {
  debugger;
  if (
    viewModel.getParams().parentParams.billNo == "po_production_order_list" || //生产订单列表
    viewModel.getParams().parentParams.billNo == "po_production_order"
  ) {
    //生产订单详情
    getAmountData(viewModel, 0);
  }
});
function getAmountData(viewModel, type) {
  debugger;
  let createDate = getDateBeforeMonthOne();
  let gridDataList = viewModel.get("materOuts").getData();
  for (var f in gridDataList) {
    let oldPrice = gridDataList[f].natUnitPrice;
    let oldAmount = gridDataList[f].natMoney;
    let productId = gridDataList[f].product;
    var cprkApiResult = cb.rest.invokeFunction("ST.clck.getCprkDateByPro", { productId: productId, createDate: createDate + " 23:59:59" }, function (err, res) {}, viewModel, { async: false });
    if (cprkApiResult.result.res.length < 1) {
      cprkApiResult = cb.rest.invokeFunction("ST.clck.getCprkDateByPro", { productId: productId, createDate: "" }, function (err, res) {}, viewModel, { async: false });
    }
    if (cprkApiResult.result.res.length < 1) {
      throw new Error("没有找到物料对应产品入库单的成本金额，成本单价！！！");
    }
    let natUnitPrice = cprkApiResult.result.res[0].natUnitPrice; //产品入库的成本单价
    let natMoney = cprkApiResult.result.res[0].natMoney; //产品入库的成本金额
    let natUnitPriceFu = cprkApiResult.result.res[0].define1; //产品入库的成本单价(辅计量)
    let natMoneyFu = cprkApiResult.result.res[0].define2; //产品入库的成本金额(辅计量)
    let codeCprk = cprkApiResult.result.res[0].code;
    let number = gridDataList[f].qty;
    let numberPrice = gridDataList[f].subQty;
    if (oldPrice == "" || oldPrice == undefined || oldPrice == null || oldAmount == "" || oldAmount == undefined || oldAmount == null || oldPrice == natUnitPrice) {
      setTimeout(function () {
        viewModel.get("materOuts").setCellValue(f, "natMoney", Math.round(natUnitPrice * number * 100) / 100); //给成本金额进行赋值
        viewModel.get("materOuts").setCellValue(f, "natUnitPrice", Math.round(natUnitPrice * 1000000) / 1000000); //给成本单价进行赋值
        viewModel.get("materOuts").setCellValue(f, "defines!define1", Math.round(natUnitPrice * number * 100) / 100); //给成本金额（辅计量）进行赋值
        viewModel.get("materOuts").setCellValue(f, "defines!define2", Math.round(((natUnitPrice * number) / numberPrice) * 1000000) / 1000000); //给成本单价（辅计量）进行赋值
        viewModel.get("materOuts").setCellValue(f, "defines!define3", codeCprk); //产品入库单号
      }, 300);
    }
  }
}
function getDateBeforeMonthOne() {
  //获取上个月最后一天
  let date = new Date();
  console.log(date);
  date.setDate(0);
  console.log(date);
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  month = month > 9 ? month : "0" + month;
  var day = date.getDate();
  day = day > 9 ? day : "0" + day;
  return year + "-" + month + "-" + day;
}
viewModel.get("button83of") &&
  viewModel.get("button83of").on("click", function (data) {
    //加载内转价格--单击
    debugger;
    var cprkApiResult = cb.rest.invokeFunction("ST.clck.getScddId", { id: viewModel.originalParams.id }, function (err, res) {}, viewModel, { async: false });
    if (cprkApiResult.result.res[0].srcBill != null && cprkApiResult.result.res[0].srcBill != "" && cprkApiResult.result.res[0].srcBill != undefined) {
      var cprkApiRes = cb.rest.invokeFunction("PO.scdd.getClckData", { id: cprkApiResult.result.res[0].srcBill }, function (err, res) {}, viewModel, { async: false });
      if (
        cprkApiRes.result != null &&
        cprkApiRes.result != "" &&
        cprkApiRes.result != undefined &&
        cprkApiRes.result.res != null &&
        cprkApiRes.result.res != "" &&
        cprkApiRes.result.res != undefined
      ) {
        cb.utils.alert("成功计算内转价格", "success");
      } else {
        cb.utils.alert("加载内转价格出错，请联系管理员", "error");
      }
    } else {
      cb.utils.alert("未找到上游单据，上游单据不是生产订单故不自动计算内转金额", "info");
    }
    viewModel.execute("refresh");
  });