viewModel.on("customInit", function (data) {
  // 销售结算新增中间页面--页面初始化
  //动态引入js-xlsx库
  let secScript = document.createElement("script");
  //保存传入的viewModel对象
  window.viewModelInfo = viewModel;
  secScript.setAttribute("type", "text/javascript");
  //传入文件地址 subId:应用ID
  secScript.onload = function () {
    loadJsXlsx(viewModel);
  };
  secScript.setAttribute("src", `/iuap-yonbuilder-runtime/opencomponentsystem/public/PU/xlsx.common.extend.js?domainKey=developplatform`);
  document.body.insertBefore(secScript, document.body.lastChild);
  var secScript1 = document.createElement("script");
  secScript1.setAttribute("type", "text/javascript");
  //传入文件地址 subId:应用ID
  secScript1.setAttribute("src", `/iuap-yonbuilder-runtime/opencomponentsystem/public/PU/xlsx.core.min.js?domainKey=developplatform`);
  document.body.insertBefore(secScript1, document.body.lastChild);
});
//查询条件设置默认值
viewModel.on("afterMount", function (data) {
  let filterViewModelInfo = viewModel.getCache("FilterViewModel");
  //查询区afterInit事件，必须放在页面模型的afterMount事件中才生效
  filterViewModelInfo.on("afterInit", function (data) {
    debugger;
    let datePick = document.getElementsByClassName("Test-time-two")[1];
    datePick.children[1].hidden = true; // 隐藏-字符
    datePick.children[2].hidden = true; // 隐藏第二个选择框
    datePick.children[0].style.width = "100%"; // 设置第一个选择框的长度
    let filterModelInfo = filterViewModelInfo.get("opDate");
    let realModelInfo = filterModelInfo.getFromModel();
    if (!realModelInfo.getValue()) {
      realModelInfo.setValue(viewModel.getParams().opDate); //默认值赋值
    }
  });
});
// 替换默认的查询数据，查询待计费的资产
viewModel.getGridModel().on("beforeSetDataSource", function (data) {
  debugger;
  // 调用API函数查询资产数据并替换data
  let opDate = viewModel.getCache("FilterViewModel").get("opDate").getFromModel().getValue();
  // 获取当前年monthNum月份的第一天和最后一天，用于查询资产
  let year = opDate.substring(0, 4);
  let monthNum = Number(opDate.substring(5, 7));
  let month = monthNum - 1;
  let opDateFirst = opDate + "-01";
  let firstNextDate = new Date(year, month + 1, 1);
  let lastDate = new Date(firstNextDate - 86400000).format("yyyy-MM-dd");
  let fiveYear = new Date(Number(year - 5), month, 1).format("yyyy-MM-dd"); // 5年前的资产不再计费
  let secondYear = new Date(Number(year - 2), month, 1).format("yyyy-MM-dd"); // 2年内的资产计费为价格1
  let result = cb.rest.invokeFunction(
    "AT160194EA17D00009.apiFun.replaceQueryData",
    { monthNum: monthNum, lastDate: lastDate, fiveYear: fiveYear, secondYear: secondYear },
    function (err, res) {},
    viewModel,
    { async: false }
  );
  if (result.error != undefined) {
    cb.utils.alert("系统错误！请联系管理员！");
    return;
  }
  if (!result || result.length <= 0 || !result.result || !result.result.fixedassetData || result.result.fixedassetData.length <= 0) {
    return true;
  }
  // 设置数据源
  viewModel.getGridModel().setState("dataSourceMode", "local");
  data.splice(0, data.length);
  for (let k = 0; k < result.result.fixedassetData.length; k++) {
    data.push(result.result.fixedassetData[k]);
  }
  return true;
});
viewModel.get("button34lb") &&
  viewModel.get("button34lb").on("click", function (data) {
    viewModel.communication({ type: "return" });
  });
viewModel.get("button27lh") &&
  viewModel.get("button27lh").on("click", function (data) {
    if (viewModel.getGridModel().getSelectedRowIndexes().length == 0) {
      cb.utils.alert("请选择数据！");
      return false;
    }
    cb.loader.runCommandLine(
      "bill",
      {
        billtype: "voucher",
        params: {
          mode: "add",
          selectData: viewModel.getGridModel().getSelectedRows(),
          yearNum: viewModel.getCache("FilterViewModel").get("opDate").getFromModel().getValue().substring(0, 4),
          monthNum: Number(viewModel.getCache("FilterViewModel").get("opDate").getFromModel().getValue().substring(5, 7)),
          opDate: viewModel.getCache("FilterViewModel").get("opDate").getFromModel().getValue()
        },
        billno: "yb82c07fbc"
      },
      viewModel
    );
  });
viewModel.getGridModel().on("afterSetDataSource", function (data) {
  viewModel.getGridModel().selectAll();
});
viewModel.on("afterBatchoutput", (args) => {
  debugger;
});
viewModel.get("button35ii") &&
  viewModel.get("button35ii").on("click", function (data) {
    if (viewModel.getGridModel().getSelectedRowIndexes().length == 0) {
      cb.utils.alert("请选择数据！");
      return false;
    }
    window.viewModelInfo = viewModel;
    // 调用API函数查询资产数据并替换data
    let opDate = viewModel.getCache("FilterViewModel").get("opDate").getFromModel().getValue();
    // 获取当前年monthNum月份的第一天和最后一天，用于查询资产
    let year = opDate.substring(0, 4);
    let monthNum = Number(opDate.substring(5, 7));
    let month = monthNum - 1;
    let opDateFirst = opDate + "-01";
    let firstNextDate = new Date(year, month + 1, 1);
    let lastDate = new Date(firstNextDate - 86400000).format("yyyy-MM-dd");
    let fiveYear = new Date(Number(year - 5), month, 1).format("yyyy-MM-dd"); // 5年前的资产不再计费
    let secondYear = new Date(Number(year - 2), month, 1).format("yyyy-MM-dd"); // 2年内的资产计费为价格1
    let ids = []; // 拼接id到后台查询
    let selectData = viewModel.getGridModel().getSelectedRows();
    for (let i = 0; i < selectData.length; i++) {
      ids.push(selectData[i].id + "");
    }
    cb.rest.invokeFunction(
      "AT160194EA17D00009.apiFun.replaceQueryData",
      { monthNum: monthNum, lastDate: lastDate, fiveYear: fiveYear, secondYear: secondYear, isExport: true, searchIds: ids },
      function (err, res) {
        debugger;
        if (err) {
          cb.utils.alert("系统错误！请联系管理员！");
          return;
        }
        let fixedassetData = res.fixedassetData;
        let rowData = [];
        for (let i = 0; i < fixedassetData.length; i++) {
          let item = {};
          item["采购订单编码"] = fixedassetData[i].purchaseCode;
          item["SN编码"] = fixedassetData[i].sn;
          item["算力服务产品类型"] = fixedassetData[i].suanliTypeName;
          item["实物物料"] = fixedassetData[i].materialName;
          item["购买单价(含税)"] = fixedassetData[i].unitPriceTax;
          item["购买单价(不含税)"] = fixedassetData[i].unitPrice;
          item["实物基准价"] = fixedassetData[i].materialPrice;
          item["价格1"] = fixedassetData[i].priceOne;
          item["价格2"] = fixedassetData[i].priceTwo;
          item["算力服务费金额"] = fixedassetData[i].suanliPrice;
          item["发货时间"] = fixedassetData[i].shipmentDate;
          item["到货时间"] = fixedassetData[i].arriveDate;
          item["资产开始使用时间"] = fixedassetData[i].useDate;
          item["供应商"] = fixedassetData[i].supplierName;
          item["存放地点"] = fixedassetData[i].location;
          item["合同号"] = fixedassetData[i].contractNum;
          rowData.push(item);
        }
        // 导出
        exportExcelFile(rowData, "销售结算-" + new Date().format("yyyy-MM-dd-hh-mm-ss"));
      }
    );
  });