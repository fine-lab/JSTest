//动态引入js-xlsx库
var secScript = document.createElement("script");
secScript.setAttribute("type", "text/javascript");
//传入文件地址 subId:应用ID
secScript.setAttribute("src", `/iuap-yonbuilder-runtime/opencomponentsystem/public/ST/xlsx.common.extend.js?domainKey=developplatform`);
document.body.insertBefore(secScript, document.body.lastChild);
var secScript1 = document.createElement("script");
secScript1.setAttribute("type", "text/javascript");
//传入文件地址 subId:应用ID
secScript1.setAttribute("src", `/iuap-yonbuilder-runtime/opencomponentsystem/public/ST/xlsx.core.min.js?domainKey=developplatform`);
document.body.insertBefore(secScript1, document.body.lastChild);
viewModel.get("button197yb") &&
  viewModel.get("button197yb").on("click", function (data) {
    //导出--单击
    let detailList = viewModel.getGridModel("purInRecords").getData();
    let arr1 = [];
    for (let i in detailList) {
      let lists = detailList[i * 1];
      arr1 = arr1.concat(lists.StorageSnMessageList || []);
    }
    if (!arr1.length) {
      cb.utils.alert("没有SN信息！", "warning");
      return;
    }
    let sheetData1 = arr1.map((item, i) => {
      return {
        序号: i + 1,
        序列号自由项特征组: item.snCharacter || "",
        物料: item.extendProduct || "",
        物料名称: item.extendProductName || "",
        SN: item.sn,
        箱号: item.extendBoxNumber || "",
        箱数: item.extendBoxCount || "",
        生产日期: item.extendProductDate || "",
        保质期: item.extendShelfLife || "",
        DC日期: item.dc_Data || "",
        出厂时间: item.dateOfProduction || "",
        到期日期: item.maturity_Date || "",
        体积: item.volume || "",
        毛重: item.rough_Weight || ""
      };
    });
    // 调用公共函数导出方法
    exportFile(sheetData1, "SN信息", `采购入库单SN信息.xlsx`);
    cb.utils.alert("导出完成！", "success");
  });
// 到货单下推到入库单时，代入SN数据
var snList = [];
// 来源到货单ID
var srcBill = "";
viewModel.on("afterLoadData", function (args) {
  //到货单下推入库单时带入SN信息
  let modeStatus = viewModel.getParams().mode;
  let srcBill = args.srcBill;
  setTimeout(() => {
    if (srcBill && modeStatus == "add") {
      // 查询到货单信息
      cb.rest.invokeFunction(
        "ST.backFun.queryArrivalSn",
        { srcBill },
        function (err, res) {
          if (res.res) {
            if (modeStatus == "add" && srcBill && (viewModel.get("bustype_name").getValue() == "服务器囤货" || viewModel.get("bustype_name").getValue() == "备件囤货")) {
              snList = res.res;
              viewModel.get("StorageSnMessageList").setData(res.res);
            } else {
              snList = res.res;
            }
          }
        },
        viewModel,
        { async: false }
      );
    }
  }, 5000);
  let details = args.purInRecords;
  if (details) {
    //查询数据库当前数据条数
    let sum = 0;
    for (let j = 0; j < details.length; j++) {
      let extendReceiptBatchNo = details[j].extendReceiptBatchNo;
      if (!extendReceiptBatchNo) {
        sum = sum + 1;
      }
    }
    let result = cb.rest.invokeFunction("ST.backOpenApiFunction.generateBatchNum", { len: sum }, function (err, res) {}, viewModel, { async: false });
    let len = result.result.codeNum;
    let codeStart = result.result.codeStart;
    for (let i = 0; i < details.length; i++) {
      let extendReceiptBatchNo = details[i].extendReceiptBatchNo;
      if (!extendReceiptBatchNo) {
        let codeEnd = len + i;
        let codeEndStr = codeEnd + "";
        codeEndStr = codeEndStr.padStart(4, "0");
        details[i].extendReceiptBatchNo = codeStart + codeEndStr;
      }
    }
  }
});
// 页面状态切换时
viewModel.on("modeChange", function (args) {
  // 交易类型是服务器囤货、备件囤货，显示SN导出、明细
  if (viewModel.get("bustype_name").getValue() == "服务器囤货" || viewModel.get("bustype_name").getValue() == "备件囤货") {
    viewModel.execute("updateViewMeta", { code: "linetabs41qg", visible: true });
    viewModel.get("button197yb").setVisible(true);
  } else {
    viewModel.get("button197yb").setVisible(false);
    viewModel.execute("updateViewMeta", { code: "linetabs41qg", visible: false });
  }
});
viewModel.get("bustype_name") &&
  viewModel.get("bustype_name").on("afterValueChange", function (data) {
    //交易类型--值改变后
    // 交易类型是服务器囤货、备件囤货，显示SN导出、明细
    if (viewModel.get("bustype_name").getValue() == "服务器囤货" || viewModel.get("bustype_name").getValue() == "备件囤货") {
      viewModel.execute("updateViewMeta", { code: "linetabs41qg", visible: true });
      viewModel.get("button197yb").setVisible(true);
      // 是新增的下推单据，代入SN
      if (srcBill) {
        viewModel.get("StorageSnMessageList").setData(snList);
      }
    } else {
      viewModel.get("button197yb").setVisible(false);
      //如果是其他交易类型，则清空SN信息，隐藏SN组件
      viewModel.get("StorageSnMessageList").setData([]);
      viewModel.execute("updateViewMeta", { code: "linetabs41qg", visible: false });
    }
  });