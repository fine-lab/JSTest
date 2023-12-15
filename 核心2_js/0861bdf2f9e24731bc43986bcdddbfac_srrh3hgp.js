viewModel.get("button7oc") &&
  viewModel.get("button7oc").on("click", function (data) {
    //采购订单
    let result = cb.rest.invokeFunction("AT19FD8ECC08680005.backOpenApiFunction.getPurchase", { pageIndex: 1, pageSize: 3 }, function (err, res) {}, viewModel, { async: false });
    let code = result.result.code;
    if (code == "200") {
    } else {
      cb.utils.alert("采购订单接口加载失败!");
    }
    let cgddList = result.result.data.recordList;
    console.log("###cgddList采购订单#####", cgddList);
    //到货订单
    let resultDHD = cb.rest.invokeFunction("AT19FD8ECC08680005.backOpenApiFunction.getDeliveryNote", { pageIndex: 1, pageSize: 3 }, function (err, res) {}, viewModel, { async: false });
    let codedhd = resultDHD.result.code;
    if (codedhd == "200") {
    } else {
      cb.utils.alert("到货单接口加载失败!");
    }
    let dhdList = resultDHD.result.data.recordList;
    console.log("####dhdList到货订单####", dhdList);
    //入库订单
    let resultRKD = cb.rest.invokeFunction("AT19FD8ECC08680005.backOpenApiFunction.getWarehousing", { pageIndex: 1, pageSize: 3 }, function (err, res) {}, viewModel, { async: false });
    let coderkd = resultRKD.result.code;
    if (coderkd == "200") {
    } else {
      cb.utils.alert("入库单接口加载失败!");
    }
    let rkdList = resultRKD.result.data.recordList;
    console.log("####rkdList入库订单####", rkdList);
  });
viewModel.on("customInit", function (data) {});