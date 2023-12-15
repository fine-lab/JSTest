viewModel.on("customInit", function (args) {
  console.log("2.利润指标信息采集");
  let profitUrl = "AT17AF88F609C00004.operatingprofit.getApiForProfit";
  let profitParam = {
    org: "2293903580617728", //会计主体ID,必填
    accbook: "1E0644D3-1237-464E-AB1D-0972D3C0B4E3", // 账簿
    period1: "2022-06", //起始期间,必填
    period2: "2022-07", //结束期间,必填
    codes: "6001"
  };
  cb.rest.invokeFunction(profitUrl, profitParam, function (err, res) {
    console.log(err);
    console.log(res);
    if (res.res === undefined || res.res === null) return;
    console.log(profitUrl + "接口返回数据：" + JSON.stringify(res.res));
  });
});