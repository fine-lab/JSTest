viewModel.on("customInit", function (data) {
  // 项目物料关系详情--页面初始化
});
//数据加载后事件
viewModel.on("afterLoadData", function () {
  //获取子表数据
  var gridModel = viewModel.getGridModel("prjMaterRelevance_aList");
  var rows = gridModel.getRows();
  var isok = false;
  //如果子表的使用数据>0,对应的物料不可修改
  for (var i = 0; i < rows.length; i++) {
    if (rows[i].useshuliang > 0) {
      gridModel.setCellState(i, "product_code", "readOnly", true);
      isok = true;
    }
  }
  if (isok) {
    viewModel.get("project_code").setState("readOnly", true); //不可编辑
  }
});
//保存前事件
viewModel.on("beforeSave", function (parmas) {
  //判断子表数据是否重复
  //获取子表数据
  var rows = viewModel.getGridModel("prjMaterRelevance_aList").getRows();
  var productArry = new Array();
  for (var j = 0; j < rows.length; j++) {
    productArry[j] = rows[j].product;
    //使用数量要小于数量
    if (rows[j].useshuliang > rows[j].shuliang) {
      cb.utils.alert("保存失败，子表第【" + (j + 1) + "】行数量小于使用数量，不符合逻辑！");
      return false;
    }
  }
  var nary = productArry.sort();
  for (var i = 0; i < productArry.length; i++) {
    if (nary[i] == nary[i + 1]) {
      cb.utils.alert("保存失败，子表存在重复数据！");
      return false;
    }
  }
  //判断项目是否重复
  var returnPromise = new cb.promise();
  //获取项目主键
  var projectId = viewModel.get("project").getValue();
  //获取【主键】字段值
  var idnumber = viewModel.get("id").getValue();
  cb.rest.invokeFunction("GT4425AT14.backDesignerFunction.beforeSave", { idnumber: idnumber, projectId: projectId }, function (err, res) {
    if (err != null) {
      cb.utils.alert(err.message);
      return returnPromise.reject();
    } else {
      return returnPromise.resolve();
    }
  });
  return returnPromise;
});
//卡片删除前事件
viewModel.on("beforeDelete", function () {
  var gridModel = viewModel.getGridModel("prjMaterRelevance_aList");
  var rows = gridModel.getRows();
  //如果子表的使用数据>0,对应的物料不可修改
  for (var i = 0; i < rows.length; i++) {
    if (rows[i].useshuliang > 0) {
      cb.utils.alert("删除失败，该关系表已被引用，不可删除");
      return false;
    }
  }
});
//删行前操作
viewModel.on("beforeDeleteRow", function (args) {
  for (var i = 0; i < args.data.length; i++) {
    var data = viewModel.getGridModel().getRows()[args.data[i]];
    if (data.useshuliang > 0) {
      cb.utils.alert("删除失败，该行数据已被引用，不可删除");
      return false;
    }
  }
});
var gridModel = viewModel.getGridModel("prjMaterRelevance_aList");
//参照设置
let refModel = gridModel.getEditRowModel().get("product_code");
refModel.on("afterInitVm", function (args) {
  let referViewModel = args.vm;
  let aa = referViewModel.get("table");
  aa.setPageSize(1000);
});