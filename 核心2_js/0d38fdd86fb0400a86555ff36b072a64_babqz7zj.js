viewModel.on("customInit", function (data) {
  // 学员端-课程学习详情--页面初始化
  viewModel.on("afterLoadData", function () {
    //卡片页面数据加载完成
    console.log("=======[afterLoadData]=======");
    var course_id = viewModel.getParams().perData;
    cb.rest.invokeFunction("9969de3b3fea4868a2e1a58767bce975", { course_id: course_id }, function (err, res) {
      if (res) {
        console.log(1111111111111111111111111111111111);
        console.log(res);
        console.log(1111111111111111111111111111111111);
        viewModel.get("title").setValue("测试");
        viewModel.get("type").setValue("mp3");
        var data1 = viewModel.getData();
        data1.title = "11111";
        data1.description = "描述XXXXXXXXXXX";
        viewModel.setData(data1);
      } else {
        console.log(err);
      }
    });
  });
});