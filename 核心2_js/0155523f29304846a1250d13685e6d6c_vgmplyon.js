// 编辑合作方式
viewModel.get("button26se").on("click", () => {
  let data = {
    billtype: "VoucherList", // 单据类型
    billno: "d3d1d81bList", // 单据号
    params: {
      readOnly: true, // 预览时，一定为true，否则不加载详情数据
      mode: "browse" // 须传mode + 单据id + readOnly:false
    }
  };
  cb.loader.runCommandLine("bill", data, viewModel);
});