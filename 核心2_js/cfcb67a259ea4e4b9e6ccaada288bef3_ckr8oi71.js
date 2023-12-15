viewModel.on("afterSave", function (args) {
  //监听保存后事件
  if (args.res && args.res.id) {
    //每创建一个项目 默认增加目录
    cb.rest.invokeFunction(
      "02ed850293dd422285f3f48f4e4d88ae",
      {
        id: args.res.id,
        creator: args.res.creator,
        createTime: args.res.createTime
      },
      function (err, res) {
        console.log(JSON.stringify(res));
      }
    );
  }
});