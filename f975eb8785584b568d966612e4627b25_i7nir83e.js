viewModel.get("diqu111") &&
  viewModel.get("diqu111").on("afterSelect", function (data) {
    //地区111--选择后
    throw new Error("afterSelect");
  });
viewModel.get("diqu111") &&
  viewModel.get("diqu111").on("afterValueChange", function (data) {
    //地区111--值改变后JSON.stringify(data)
    throw new Error("afterchange");
  });
viewModel.get("button19pc") &&
  viewModel.get("button19pc").on("click", function (data) {
    //按钮--单击
    var enumModel = viewModel.get("diqu111"); //获取ListModel
    enumModel.clear(); //ListModel清空方法
    enumModel.setValue(3); //ListModel设值
  });
viewModel.get("diqu111") &&
  viewModel.get("diqu111").on("beforeSelect", function (data) {
    //地区111--选择前
    var sexModel = viewModel.get("diqu111");
    sexModel.setValue(2);
  });
viewModel.get("button23ek") &&
  viewModel.get("button23ek").on("customInit", function (data) {
    //按钮页面--单击
    var viewModel = this;
    //跳转页面
    viewModel.get("button23ek").on("click", function () {
      cb.loader.runCommandLine(
        "bill",
        {
          billtype: "Voucher",
          billno: "tsxx",
          params: {
            perData: "测试父页面数据传递"
          }
        },
        viewModel
      );
    });
  });