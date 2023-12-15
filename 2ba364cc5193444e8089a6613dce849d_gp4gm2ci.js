viewModel.get("button22kg") &&
  viewModel.get("button22kg").on("click", function (data) {
    //按钮--单击
    throw new Error("111");
  });
viewModel.get("button22ui") &&
  viewModel.get("button22ui").on("click", function (data) {
    //按钮--单击
    //跳转页面
    viewModel.get("button22ui").on("click", function () {
      cb.loader.runCommandLine(
        "bill",
        {
          billtype: "voucherList",
          billno: "Mtest0012List",
          params: {
            perData: "测试父页面数据传递"
          }
        },
        viewModel
      );
    });
  });