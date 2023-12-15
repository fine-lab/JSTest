var green = function (event) {
  debugger;
  var viewModel = this;
  var telephone = event.params.value;
  var serviceUrl = viewModel.getAppContext().serviceUrl;
  //手机号不为空时,调用开放接口 若存在即带出姓名
  if (telephone.trim() != "") {
    var telParams = telephone.substring(4);
    cb.rest.invokeFunction(
      "GT103422AT170.open.getUserName",
      {
        telephone: telParams,
        envUrl: serviceUrl
      },
      function (err, res) {
        if (err != null) {
          cb.utils.alert("手机号联动查询异常");
        } else {
          viewModel.get("name").setValue("");
          var resContent = JSON.parse(res.apiResponse).data.content;
          if (res != "") {
            var userName = JSON.parse(res.apiResponse).data.content[0].userName;
            viewModel.get("name").setValue(userName);
          }
        }
      }
    );
  } else {
    viewModel.get("name").setValue("");
  }
};
viewModel.get("telephone") &&
  viewModel.get("telephone").on("afterValueChange", function (data) {
    // 电话--值改变后
  });