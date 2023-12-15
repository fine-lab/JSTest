viewModel.on("customInit", function (data) {
  // 访客填写预约--页面初始化
  cb.rest.invokeFunction("GuestSystemV4.frontCustomFunction.getCurUser", {}, function (err, res) {
    var uid = res.currentUser.id;
    if (uid != undefined) {
      // 获取查询区模型
      const filtervm = viewModel.getCache("FilterViewModel");
      filtervm.on("afterInit", function () {
        // 进行查询区相关扩展
        filtervm.get("user_id").getFromModel().setValue(uid);
      });
    }
  });
});