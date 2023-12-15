viewModel.get("button27xd") &&
  viewModel.get("button27xd").on("click", function (data) {
    // 草稿--单击
  });
viewModel.get("agetid_name") &&
  viewModel.get("agetid_name").on("afterValueChange", function (data) {
    // 客户--值改变后
    const value = viewModel.get("agetid_name").getValue();
    viewModel.get("invoiceAgentid_name").setValue(value);
  });
viewModel.get("btnEdit") &&
  viewModel.get("btnEdit").on("click", function (data) {
    viewModel.get("button38oe").setVisible(false);
  });
viewModel.get("btnSave") &&
  viewModel.get("btnSave").on("click", function (data) {
    // 保存--单击
    viewModel.get("button38oe").setVisible(false);
  });
viewModel.get("button41wc") &&
  viewModel.get("button41wc").on("click", function (data) {
    // 现存量查询--单击
    var girdModel = viewModel.getGridModel();
    // 获取grid中已选中行的数据
    const XianCun = girdModel.getSelectedRows();
    if (XianCun.length <= 0) {
      cb.utils.alert("请选择行！");
      return;
    }
    debugger;
    var XianCun1 = XianCun[0].productid;
    let data1 = {
      billtype: "VoucherList", // 单据类型
      billno: "fc771270", // 单据号
      params: {
        mode: "browse", // (编辑态edit、新增态add、浏览态browse)
        //传参
        XianCun1: XianCun1
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", data1, viewModel);
  });
viewModel.get("saleOrgid_name") &&
  viewModel.get("saleOrgid_name").on("afterValueChange", function (data) {
    // 销售组织--值改变后
    const params = data.value;
    debugger;
    var pose = cb.rest.invokeFunction("AT1613B2EE09C80003.frontDesignerFunction.getYSData", { param: params }, function (err, res) {}, viewModel, { async: false });
  });