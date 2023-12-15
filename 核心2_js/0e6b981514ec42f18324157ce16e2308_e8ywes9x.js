// 获取要操作的表格
let gridModel = viewModel.getGridModel();
// 获取要过滤的参照字段--银行网点
let banktype = gridModel.getEditRowModel().get("bankdocId_name");
// 参照过滤实现
banktype.on("beforeBrowse", function (data) {
  //获取过滤的信息，银行类别 ID
  let value = gridModel.getEditRowModel().get("banktype").getValue();
  let condition = {
    isExtend: true,
    simpleVOs: []
  };
  // 取不到值时容错处理
  if (value) {
    condition.simpleVOs.push({
      field: "bank",
      op: "eq",
      value1: value
    });
  }
  this.setFilter(condition);
});