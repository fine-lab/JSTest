// 供应商银行账户批量--页面初始化
viewModel.on("customInit", function (e) {
  //设置行号
  viewModel.getGridModel().setState("showRowNo", true);
  //通过代码方式，实现过滤
  //获取要操作的表格
  let gridModel = viewModel.getGridModel();
  //获取要过滤的参照字段--银行网点
  //获取的是控件，要对控件进行操作
  let banktype = gridModel.getEditRowModel().get("bankdocld_name");
  //参照过滤实现
  banktype.on("beforeBrowse", function (data) {
    //获取过滤的信息，银行类别ID：从单据取到的银行类别字段
    let value = gridModel.getEditRowModel().get("banktype").getValue(); //获取的是banktype id的值，是因为要获取银行类别
    let condition = {
      isExtend: true,
      simpleVOs: []
    };
    //取不到值时容错处理
    //如果value有值
    if (value) {
      condition.simpleVOs.push({
        field: "bank",
        op: "eq",
        value1: value
      });
    }
    this.setFilter(condition);
  });
  //取消按钮
  viewModel.get("button16wf").on("click", function (data) {
    viewModel.communication({
      type: "modal",
      payload: {
        data: false
      }
    });
  });
  //确认按钮
  viewModel.get("button19yi").on("click", function (data) {
    //获取父页面模型
    let parentViewModel = viewModel.getCache("parentViewModel");
    //关闭弹窗
    viewModel.communication({
      type: "modal",
      payload: {
        data: false
      }
    });
    //刷新父页面
    parentViewModel.execute("refresh");
  });
});