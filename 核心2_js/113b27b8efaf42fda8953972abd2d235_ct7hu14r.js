viewModel.on("customInit", function (data) {
  // 测试kw详情--页面初始化
  // 网络请求
  var token = cb.rest.invokeFunction("a8fc138b854642cda878665ddead4819", {}, function (err, res) {}, viewModel, { async: false });
  var yht_access_token = token.result.token;
  var tenantID = viewModel.getAppContext().tenant.tenantId;
  var params = viewModel.getParams();
  var options = {
    domainKey: params.domainKey,
    tenant_id: tenantID
  };
  let header = {
    yht_access_token: yht_access_token
  };
  let body = {};
  let responseObj = postman("get", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
  var proxy = cb.rest.DynamicProxy.create({
    GetCheckDiffList: {
      url: "/apidxq/isv2/checkstock/GetCheckDiffList",
      method: "GET",
      options: options
    }
  });
  console.log(responseObj);
  var proxy1 = viewModel.setProxy({
    GetCheckDiffList: {
      url: "/checkstock/GetCheckDiffList",
      method: "get"
    }
  });
  proxy.GetCheckDiffList(options, function (err, res) {
    console.log(res);
    console.log("网络请求" + err + res);
  });
  proxy1.GetCheckDiffList(options, function (err, res) {
    console.log("网络请求1" + err + res);
  });
});