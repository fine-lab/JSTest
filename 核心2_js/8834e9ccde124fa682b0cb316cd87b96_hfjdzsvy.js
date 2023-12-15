function defaultCreator(event) {
  var viewModel = this;
  //获取当前页面的单据状态
  var currentState = viewModel.getParams().mode;
  if ("add" == currentState) {
    debugger;
    //需要请求后台设置当前创建者的默认值
    cb.rest.invokeFunction(
      "9e24bb916a224ad587cdaeb57439639a",
      {},
      function (err, res) {
        if (err !== null) {
          cb.utils.alert("设置默认创建者异常");
        } else {
          //设置默认值
          viewModel.get("StaffNew_name").setValue(res.username);
          viewModel.get("StaffNew").setValue(res.userid);
        }
      }
    );
  }
}