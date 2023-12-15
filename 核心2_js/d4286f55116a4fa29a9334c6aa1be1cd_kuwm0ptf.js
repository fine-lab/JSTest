viewModel.on("customInit", function (args) {});
var org = "";
var accbook = "";
var start = "";
var end = "";
// 查询--单击
viewModel.get("item108rb") &&
  viewModel.get("item108rb").on("afterValueChange", function (data) {
    // 组织--值改变后
    console.log("组织--值改变后" + JSON.stringify(data));
    org = data.value.value;
  });
viewModel.get("item151te") &&
  viewModel.get("item151te").on("afterValueChange", function (data) {
    // 账簿--值改变后
    console.log("账簿--值改变后" + JSON.stringify(data));
    accbook = data.value.value;
  });
viewModel.get("item195rf") &&
  viewModel.get("item195rf").on("afterValueChange", function (data) {
    // 期间开始--值改变后
    console.log("期间开始--值改变后" + JSON.stringify(data));
    start = data.value.substring(0, 7);
    end = data.value.substring(0, 4) + "-01";
  });
viewModel.get("button5cf") &&
  viewModel.get("button5cf").on("click", function (data) {
    try {
      console.log("1.清空数据库");
      let clearUrl = "AT17AF88F609C00004.common.clearPage";
      let clearResult = cb.rest.invokeFunction(clearUrl, {}, function (err, res) {}, viewModel, { async: false });
      console.log(clearUrl + "接口返回数据：" + JSON.stringify(clearResult));
      console.log("1.收入指标信息采集");
      let incomeUrl = "AT17AF88F609C00004.operatingincome.getApiForIncome";
      let incomeParam = {
        org: org, //会计主体ID,必填
        accbook: accbook, // 账簿
        period1: start, //起始期间,必填
        period2: end, //结束期间,必填
        codes: "6001"
      };
      let incomeResult = cb.rest.invokeFunction(incomeUrl, incomeParam, function (err, res) {}, viewModel, { async: false });
      console.log(incomeUrl + "接口返回数据：" + JSON.stringify(incomeResult));
      console.log("2.利润指标信息采集");
      let profitUrl = "AT17AF88F609C00004.operatingprofit.getApiForProfit";
      let profitParam = {
        org: org, //会计主体ID,必填
        accbook: accbook, // 账簿
        period1: start, //起始期间,必填
        period2: end, //结束期间,必填
        codes: "6001"
      };
      let profitResult = cb.rest.invokeFunction(profitUrl, profitParam, function (err, res) {}, viewModel, { async: false });
      console.log(profitUrl + "接口返回数据：" + JSON.stringify(profitResult));
    } catch (e) {
      throw new Error("执行页面初始化customInit报错：" + e);
    }
  });
viewModel.get("button12kj") &&
  viewModel.get("button12kj").on("click", function (data) {
    // 重置--单击
    viewModel.get("item108rb").setValue("");
    viewModel.get("item151te").setValue("");
    viewModel.get("item195rf").setValue("");
    viewModel.get("item240gb").setValue("");
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
    viewModel.get("item108rb").setDataSource(options);
  });
});
//数据加载后
viewModel.on("afterLoadData", function (args) {});
viewModel.get("item108rb") &&
  viewModel.get("item108rb").on("afterSelect", function (data) {
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
            viewModel.get("item151te").setDataSource(options);
          }
        }
      });
    }
  });