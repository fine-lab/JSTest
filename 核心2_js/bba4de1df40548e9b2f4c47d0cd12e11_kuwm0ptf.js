viewModel.on("customInit", function (args) {});
var org = "";
var accbook = "";
var start = "";
var end = "";
viewModel.get("item101bi") &&
  viewModel.get("item101bi").on("afterValueChange", function (data) {
    // 组织--值改变后
    console.log("组织--值改变后" + JSON.stringify(data));
    org = data.value.value;
  });
viewModel.get("item201mj") &&
  viewModel.get("item201mj").on("afterValueChange", function (data) {
    // 账簿--值改变后
    console.log("账簿--值改变后" + JSON.stringify(data));
    accbook = data.value.value;
  });
viewModel.get("item302kd") &&
  viewModel.get("item302kd").on("afterValueChange", function (data) {
    // 期间开始--值改变后
    console.log("期间开始--值改变后" + JSON.stringify(data));
    start = data.value.substring(0, 7);
  });
viewModel.get("button4dc") &&
  viewModel.get("button4dc").on("click", function (data) {
    // 重置--单击
    viewModel.get("item101bi").setValue("");
    viewModel.get("item201mj").setValue("");
    viewModel.get("item302kd").setValue("");
  });
//组件挂载后
viewModel.on("afterMount", function (args) {
  console.log("0.获取组织信息以及账簿");
  let orgUrl = "AT17AF88F609C00004.common.getOrgFromDb";
  cb.rest.invokeFunction(orgUrl, {}, function (err, res) {
    if (res.res === undefined || res.res === null) return;
    console.log(orgUrl + "接口返回数据：" + JSON.stringify(res.res));
    cb.cache.set("orgInfo", res.res);
    var options = [];
    res.res.forEach((row) => {
      let option = {};
      option["value"] = row.orgId;
      option["text"] = row.orgName;
      option["nameType"] = "string";
      options.push(option);
    });
    viewModel.get("item101bi").setDataSource(options);
  });
  console.log("1.收入指标信息采集");
  let incomeUrl = "AT17AF88F609C00004.operatingincome.getApiForIncome";
  let incomeParam = {
    org: "2293903580617728", //会计主体ID,必填
    accbook: "1E0644D3-1237-464E-AB1D-0972D3C0B4E3", // 账簿
    period1: "2022-01", //起始期间,必填
    period2: "2022-01", //结束期间,必填
    codes: "6001"
  };
  cb.rest.invokeFunction(incomeUrl, incomeParam, function (err, res) {
    console.log(err);
    console.log(res);
    if (res.res === undefined || res.res === null) return;
    console.log(incomeUrl + "接口返回数据：" + JSON.stringify(res.res));
  });
});
viewModel.get("item101bi") &&
  viewModel.get("item101bi").on("afterSelect", function (data) {
    // 组织--选择后
    var result = cb.cache.get("orgInfo");
    if (result != undefined && result != null && result != "") {
      result.forEach((row) => {
        if (data.value == row.orgId) {
          var accountList = row.accountList;
          var options = [];
          if (accountList != undefined && accountList != null && accountList != "") {
            accountList.forEach((item) => {
              let option = {};
              option["value"] = item.accountId;
              option["text"] = item.accountName;
              option["nameType"] = "string";
              options.push(option);
            });
            viewModel.get("item201mj").setDataSource(options);
          }
        }
      });
    }
  });
viewModel.get("button1hj") &&
  viewModel.get("button1hj").on("click", function (data) {
    // 查询--单击
    try {
      console.log("1.收入指标信息采集");
      let incomeUrl = "AT17AF88F609C00004.operatingincome.getApiForIncome";
      let incomeParam = {
        org: org, //会计主体ID,必填
        accbook: accbook, // 账簿
        period1: start, //起始期间,必填
        period2: end, //结束期间,必填
        codes: "6001"
      };
      cb.rest.invokeFunction(incomeUrl, incomeParam, function (err, res) {
        console.log(err);
        console.log(res);
        if (res.res === undefined || res.res === null) return;
        console.log(incomeUrl + "接口返回数据：" + JSON.stringify(res.res));
      });
      console.log("2.利润指标信息采集");
      let profitUrl = "AT17AF88F609C00004.operatingprofit.getApiForProfit";
      let profitParam = {
        org: org, //会计主体ID,必填
        accbook: accbook, // 账簿
        period1: start, //起始期间,必填
        period2: end, //结束期间,必填
        codes: "6001"
      };
      cb.rest.invokeFunction(profitUrl, profitParam, function (err, res) {
        console.log(err);
        console.log(res);
        if (res.res === undefined || res.res === null) return;
        console.log(profitUrl + "接口返回数据：" + JSON.stringify(res.res));
      });
    } catch (e) {
      throw new Error("执行页面初始化customInit报错：" + e);
    }
  });