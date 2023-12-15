viewModel.on("customInit", function (data) {
  // 实施项目用户授权--页面初始化
  let msg = "";
  let res = cb.rest.invokeFunction("AT16AD797616380008.API.getCustomerById", { Id: "yourIdHere" }, function (err, res) {}, viewModel, { async: false });
  debugger;
  if (!res.result.result.hasOwnProperty("industry")) msg += "客户行业、";
  if (!res.result.result.hasOwnProperty("ywgs")) msg += "客户归属分类、";
  if (!res.result.result.hasOwnProperty("hybm")) msg += "2023客户行业组织、";
  if (msg != "") {
    cb.utils.alert(msg.substring(0, msg.length - 1) + "不能为空！");
    return;
  }
  cb.rest.invokeFunction("AT16AD797616380008.API.getCustomerById", { Id: "yourIdHere" }, function (err, res) {
    if (!res.result.hasOwnProperty("industry")) msg += "客户行业、";
    if (!res.result.hasOwnProperty("ywgs")) msg += "客户归属分类、";
    if (!res.result.hasOwnProperty("hybm")) msg += "2023客户行业组织、";
    if (msg != "") {
      cb.utils.alert(msg.substring(1, msg.length - 2) + "不能为空！");
      return;
    }
    var ss;
  });
});