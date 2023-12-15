viewModel.on("customInit", function (data) {
  // 盘管首检单据明细表(模态框)详情--页面初始化
  var viewModel = this;
  debugger;
  var bh = viewModel.getParams().line_data;
  viewModel.on("afterMount", function (args) {
    // 获取查询区模型
    viewModel.getCache("FilterViewModel").on("afterInit", function () {
      // 进行查询区相关扩展
      filtervm.get("shoujixinghao").getFromModel().setValue(bh);
    });
  });
  viewModel.get("batch_number").setValue(bh.batch_number); //生产批号
  viewModel.get("order_code").setValue(bh.order_code); //单据编码
  viewModel.get("order_date").setValue(bh.order_date); //单据日期
  viewModel.get("order_status").setValue(bh.order_status); //单据状态
  viewModel.get("sample_time").setValue(bh.sample_time); //取样时间
  viewModel.get("inspection_results").setValue(bh.inspection_results); //检验结果
  viewModel.get("productOrder").setValue(bh.productOrder); //生产订单
  viewModel.get("material_v1_name").setValue(bh.material_v1_name); //物料
  viewModel.get("departmentCode_name").setValue(bh.departmentCode_name); //部门编码
  viewModel.get("department").setValue(bh.department); //部门
  viewModel.get("groupCode").setValue(bh.groupCode); //组别编码
  viewModel.get("g_group").setValue(bh.g_group); //组别
  viewModel.get("inspectorCode_name").setValue(bh.inspectorCode_name); //检验员编号
  viewModel.get("inspector").setValue(bh.inspector); //检验员
});
viewModel.get("button1if") &&
  viewModel.get("button1if").on("click", function (data) {
    // 确定--单击
    var data_v3 = viewModel.getAllData();
    var line_v1 = viewModel.getParams().line_data.line;
    debugger;
    var parentViewModel = viewModel.getCache("parentViewModel"); //模态框中获取父页面
    var gridModel = parentViewModel.get("first_inspection_for_coilList");
    gridModel.updateRow(line_v1, {
      batch_number: data_v3.batch_number, //生产批号
      order_code: data_v3.order_code, //单据编码
      order_date: data_v3.order_date, //单据日期
      order_status: data_v3.order_status, //单据状态
      sample_time: data_v3.sample_time, //取样时间
      inspection_results: data_v3.inspection_results, //检验结果
      productOrder: data_v3.productOrder, //生产订单
      material_v1_name: data_v3.material_v1_name, //物料
      departmentCode_name: data_v3.departmentCode_name, //部门编码
      department: data_v3.department, //部门
      groupCode: data_v3.groupCode, //组别编码
      g_group: data_v3.g_group, //组别
      inspectorCode_name: data_v3.inspectorCode_name, //检验员编号
      inspector: data_v3.inspector //检验员
    });
    viewModel.communication({ type: "modal", payload: { data: false } }); //关闭模态框
  });