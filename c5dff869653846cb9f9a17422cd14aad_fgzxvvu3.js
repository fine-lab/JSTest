viewModel.get("phone") &&
  viewModel.get("phone").on("afterValueChange", function (data) {
    // 电话--值改变后
    var telephone = data.value;
    var data = {
      email: "https://www.example.com/",
      phone: telephone
    };
    //入参：参数1为错误提示内容；  参数2 error 红色错误 waring 黄色警告 info 蓝色信息提示  success 绿色成功
    cb.utils.alert(telephone, "success");
    debugger;
    //调用api函数
    var telParams = telephone.substring(4);
    cb.rest.invokeFunction("AT1619118217600004.apiCode.checkUserInfo", { data }, function (err, res) {
      console.log(res);
    });
  });
viewModel.get("email") &&
  viewModel.get("email").on("afterValueChange", function (data) {
    // 邮箱--值改变后
  });