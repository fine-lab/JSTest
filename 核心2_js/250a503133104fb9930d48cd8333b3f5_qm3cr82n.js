viewModel.get("name") &&
  viewModel.get("name").on("afterValueChange", function (data) {
    // 姓名--值改变后
    alert(JSON.stringify(data)); // {value:'xxx'}
    // 塞值
    viewModel.get("name").setValue("223333");
    // 获取当前登录用户信息---cb.rest.AppContext.user
    var userInfo = cb.rest.AppContext.user;
    console.log(userInfo);
    // 获取当前环境
    var serviceUrl = cb.utils.getServiceUrl();
    console.log(serviceUrl); // https://c2.yonyoucloud.com/mdf-node
    // 调用后端服务  应用code.接口目录code.接口name
    cb.rest.invokeFunction(
      "AT1606D42409D00002.api.getUserNameApi",
      {
        envUrl: serviceUrl
      },
      function (err, res) {
        debugger;
      }
    );
  });