viewModel.on("customInit", function (args) {
  console.log("1.初始化财务列表");
  let url = "AT17AF88F609C00004.operatingincome.getApiForIncome";
  cb.rest.invokeFunction(url, {}, function (err, res) {
    let dataList = [
      {
        zhibiaomingchen: "盈利收入",
        zhibiaozhi: "100万",
        tongbizengchang: "20%",
        huanbizengchang: "30%",
        zonghepingji: "C",
        zonghepingfen: "10",
        zhenduanshijian: "2023-04-23"
      }
    ];
    let rowDatas = [];
    dataList.forEach((row) => {
      let rowData = {
        zhibiaomingchen: row.zhibiaomingchen,
        zhibiaozhi: row.zhibiaozhi,
        tongbizengchang: row.tongbizengchang,
        huanbizengchang: row.huanbizengchang,
        zonghepingji: row.zonghepingji,
        zonghepingfen: row.zonghepingfen,
        zhenduanshijian: row.zhenduanshijian
      };
      rowDatas.push(rowData);
      viewModel.get("incomestatementList").insertRow(1, rowData);
    });
  });
});
viewModel.get("incomestatementList").on("cellJointQuery", function (args) {
  cb.loader.runCommandLine(
    "bill",
    {
      billtype: "VoucherList",
      billno: "ybf77226b8",
      params: {
        perData: "测试父页面数据传递"
        //指标名称
      }
    },
    viewModel
  );
});
//列表页组件挂载完成
viewModel.on("afterMount", function (args) {
  console.log("1.初始化财务列表");
  let url = "AT17AF88F609C00004.operatingincome.getApiForIncome";
  cb.rest.invokeFunction(url, {}, function (err, res) {
    let dataList = [
      {
        zhibiaomingchen: "盈利收入",
        zhibiaozhi: "100万",
        tongbizengchang: "20%",
        huanbizengchang: "30%",
        zonghepingji: "C",
        zonghepingfen: "10",
        zhenduanshijian: "2023-04-23"
      }
    ];
    let rowDatas = [];
    dataList.forEach((row) => {
      let rowData = {
        zhibiaomingchen: row.zhibiaomingchen,
        zhibiaozhi: row.zhibiaozhi,
        tongbizengchang: row.tongbizengchang,
        huanbizengchang: row.huanbizengchang,
        zonghepingji: row.zonghepingji,
        zonghepingfen: row.zonghepingfen,
        zhenduanshijian: row.zhenduanshijian
      };
      rowDatas.push(rowData);
      viewModel.get("CashFlowStatementList").insertRow(1, rowData);
    });
  });
});
//单据的UI元数据已经返回
viewModel.on("afterLoadMeta", function (args) {
  console.log("1.初始化财务列表");
  let url = "AT17AF88F609C00004.operatingincome.getApiForIncome";
  cb.rest.invokeFunction(url, {}, function (err, res) {
    let dataList = [
      {
        zhibiaomingchen: "盈利收入",
        zhibiaozhi: "100万",
        tongbizengchang: "20%",
        huanbizengchang: "30%",
        zonghepingji: "C",
        zonghepingfen: "10",
        zhenduanshijian: "2023-04-23"
      }
    ];
    let rowDatas = [];
    dataList.forEach((row) => {
      let rowData = {
        zhibiaomingchen: row.zhibiaomingchen,
        zhibiaozhi: row.zhibiaozhi,
        tongbizengchang: row.tongbizengchang,
        huanbizengchang: row.huanbizengchang,
        zonghepingji: row.zonghepingji,
        zonghepingfen: row.zonghepingfen,
        zhenduanshijian: row.zhenduanshijian
      };
      rowDatas.push(rowData);
      viewModel.get("CashFlowStatementList").insertRow(1, rowData);
    });
  });
});