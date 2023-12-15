viewModel.on("customInit", function (data) {
  // 用户保存详情--页面初始化
  var saveFlag = true;
  viewModel.on("beforeSave", function () {
    var currentState = viewModel.getParams().mode;
    // 事件发生之前,可以进行特色化处理,
    // 获取页面的邮件信息
    var email = viewModel.get("email").getValue();
    // 获取页面电话信息
    var telephone = viewModel.get("telephone").getValue();
    debugger;
    // 调用API函数数据封装
    var data = {
      email: email,
      telephone: telephone
    };
    if (currentState == "add") {
      if (email.trim() != "" && telephone.trim() != "") {
        //异步转换为同步处理
        var res = cb.rest.invokeFunction("GT100035AT154.GT100035AT154.uerinfo1", { data }, function (err, res) {}, viewModel, { async: false });
        if (res.error != null) {
          cb.utils.alert("用户是否存在校验异常");
          return false;
        } else {
          if (res.result.res[0].message != "") {
            cb.utils.alert(res.result.res[0].message);
            return false;
          }
        }
      }
    }
  });
});
viewModel.get("btnSave") &&
  viewModel.get("btnSave").on("click", function (data) {
    // 保存--单击
  });