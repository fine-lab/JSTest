viewModel.on("customInit", function (args) {
  console.log("qqqqqqqqqq");
  let allParam = {
    org: "2293903580617728", //会计主体ID,必填
    accbook: "1E0644D3-1237-464E-AB1D-0972D3C0B4E3", // 账簿
    period1: "2023-02", //起始期间,必填
    period2: "2023-02", //结束期间,必填
    codes: "6001",
    industryLevel1: "",
    industryLevel2: "",
    industryLevel3: "",
    industryLevel4: "",
    enterpriseSize: ""
  };
  let orgUrl = "AT17AF88F609C00004.operatingprofit.getProfitApiTest";
  cb.rest.invokeFunction(orgUrl, allParam, function (err, res) {
    console.log(orgUrl + "接口返回错误：" + JSON.stringify(err));
    console.log(orgUrl + "接口返回数据：" + JSON.stringify(res));
  });
});