viewModel.get("invitation_code") &&
  viewModel.get("invitation_code").on("afterValueChange", function (data) {
    // 邀请码--值改变后
    function GetQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return "";
    }
  });
viewModel.get("user_id") &&
  viewModel.get("user_id").on("afterValueChange", function (data) {
    // 用户ID--值改变后
    cb.rest.invokeFunction("GuestSystemV4.frontCustomFunction.getCurUser", {}, function (err, res) {
      var uid = res.currentUser.id;
      viewModel.get("user_id").setValue(String(uid));
    });
  });