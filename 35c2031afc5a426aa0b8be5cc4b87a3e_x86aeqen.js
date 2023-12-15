viewModel.get("button26wg") &&
  viewModel.get("button26wg").on("click", function (data) {
    // 获取预审信息--单击
    console.log(viewModel.get("gZLX_guizeleixingmingchen").__data);
    const guizeleixingmingchen = viewModel.get("gZLX_guizeleixingmingchen").__data.value;
    console.log(guizeleixingmingchen);
    const gridModel = viewModel.getGridModel("YSGLList");
    console.log("aaa", gridModel);
    console.log("bbb", gridModel.getRows());
    cb.rest.invokeFunction("AT17FE7F8616F80008.HDJB.getApproveInfo2", { guizeleixingmingchen: guizeleixingmingchen }, function (err, res) {
      console.log(res);
      //少主键，不能保证幂等
      if (res && res.res) {
        console.log("111", res.res);
        const rowLength = gridModel.getRows().length;
        res.res.forEach((item, index) => {
          let zhr = [
            {
              YSGL_staffNewList: "",
              staffNew: item.morenzhixingren || "",
              id: "",
              fkid: ""
            }
          ];
          let rowData = {
            new1: item.huanjiemingchen,
            YSGL_staffNewList: zhr,
            new5: item.zhixingyaoqiu,
            huodongbianma: item.huanjiebianma
          };
          gridModel.insertRow(rowLength, rowData);
        });
      }
      console.log(err);
    });
  });
viewModel.get("YSGLList") &&
  viewModel.get("YSGLList").getEditRowModel() &&
  viewModel.get("YSGLList").getEditRowModel().get("new5") &&
  viewModel
    .get("YSGLList")
    .getEditRowModel()
    .get("new5")
    .on("blur", function (data) {
      // 执行要求--失去焦点的回调
    });
viewModel.get("YSGLList") &&
  viewModel.get("YSGLList").getEditRowModel() &&
  viewModel.get("YSGLList").getEditRowModel().get("huodongbianma") &&
  viewModel
    .get("YSGLList")
    .getEditRowModel()
    .get("huodongbianma")
    .on("blur", function (data) {
      // 活动编码--失去焦点的回调
    });