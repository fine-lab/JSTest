viewModel.get("telephone") &&
  viewModel.get("telephone").on("afterValueChange", function (data) {
    if (true) {
      cb.rest.invokeFunction("ST.backOpenApiFunction.STOAPI", {}, function (err, res) {
        if (err != null) {
          cb.utils.alert("手机号联动查询用户名异常");
        } else {
          var resContent = JSON.parse(res.apiResponse).data.content;
          if (resContent != "") {
            var userName = JSON.parse(res.apiResponse).data.content[0].userName;
            viewModel.get("name").setValue(userName);
          }
        }
      });
    } else {
      viewModel.get("name").setValue("");
    }
  });
viewModel.get("telephone") &&
  viewModel.get("telephone").on("afterValueChange", function (data) {
    // 电话--值改变后
    var telephone = data.value;
    //电话号不为空时,掉开放平台接口,若存在即带出名字
    if (telephone.trim != "") {
      var telParams = telephone.substring(4);
      cb.rest.invokeFunction(
        "GT2841AT10.HouDuanHanShu.checkUserInfo",
        {
        },
        function (err, res) {
          if (err != null) {
            cb.utils.alert("手机号联动查询用户名异常");
          } else {
            viewModel.get("name").setValue("");
            var resContent = JSON.parse(res.apiResponse).data.content;
            if (resContent != "") {
              var userName = JSON.parse(res.apiResponse).data.content[0].userName;
              viewModel.get("name").setValue(userName);
            }
          }
        }
      );
    } else {
      viewModel.get("name").setValue("");
    }
  });