//按钮【页面跳转】--单击
viewModel.get("button1ce").on("click", function (event) {
  // 页面跳转--单击
  cb.loader.runCommandLine(
    "bill",
    {
      billtype: "voucherList",
      billno: "yb807e3b1f",
      params: {}
    },
    viewModel
  );
});
//按钮【跳转并传参】-单击
viewModel.get("button5ai").on("click", function (event) {
  const matcode = viewModel.get("material_id_matcode").getValue(); //获取控件物料编码的值
  const matname = viewModel.get("item9nj").getValue(); //获取控件物料名称的值
  cb.loader.runCommandLine(
    "bill",
    {
      billtype: "voucherList", //跳转页面的单据类型
      billno: "yb807e3b1f", //跳转页面的单据编号
      params: {
        mode: "browse", // (编辑态edit、新增态add、浏览态browse)
        //传参
        matcode: matcode,
        matname: matname
      }
    },
    viewModel
  );
});
viewModel.getParams().matcode; //接收参数
viewModel.getParams().matname; //接收参数
//按钮【打开新页签】-单击
viewModel.get("button6nd") &&
  viewModel.get("button6nd").on("click", function (data) {
    window.open("https://www.example.com/");
  });
//按钮【弹窗】的脚本-单击
viewModel.get("button4df") &&
  viewModel.get("button4df").on("click", function (data) {
    const matcode = viewModel.get("material_id_matcode").getValue(); //获取控件物料编码的值
    const matname = viewModel.get("item9nj").getValue(); //获取控件物料名称的值
    cb.loader.runCommandLine(
      "bill",
      {
        billtype: "voucherList", //弹窗的单据类型
        billno: "yb9dc59e5c", //弹窗的单据编号
        params: {
          mode: "browse", // (编辑态edit、新增态add、浏览态browse)
          //传参
          matcode: matcode,
          matname: matname
        }
      },
      viewModel
    );
  });
viewModel.getParams().matcode; //接收参数
viewModel.getParams().matname; //接收参数