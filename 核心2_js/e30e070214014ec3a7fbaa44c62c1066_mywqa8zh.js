viewModel.get("button27rh") &&
  viewModel.get("button27rh").on("click", function (data) {
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
      billno: "c81a29aa", // 单据号
      params: {
        mode: "browse", // (编辑态edit、新增态add、浏览态browse)
        //传参
        XianCun1: XianCun1
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", data1, viewModel);
  });
viewModel.get("btnAddRowxq_zly") &&
  viewModel.get("btnAddRowxq_zly").on("click", function (data) {
    // 增行--单击
    const params = data.value;
    debugger;
    var pose = cb.rest.invokeFunction("AT16142F1209C80004.backOpenApiFunction.selectYs", { param: params }, function (err, res) {}, viewModel, { async: false });
    const res = JSON.parse(pose.result.apiResponseRes);
    viewModel.get("stockOrgid_name").setValue(res.data.recordList[0].inventory_org_name);
  });
viewModel.get("saleOrgid_name") &&
  viewModel.get("saleOrgid_name").on("afterValueChange", function (data) {
    // 销售组织--值改变后
    const params = data.value;
    debugger;
    var pose = cb.rest.invokeFunction("AT16142F1209C80004.backOpenApiFunction.selectYs", { param: params }, function (err, res) {}, viewModel, { async: false });
    const res = JSON.parse(pose.result.apiResponseRes);
    viewModel.get("stockOrgid_name").setValue(res.data.recordList[0].inventory_org_name);
  });