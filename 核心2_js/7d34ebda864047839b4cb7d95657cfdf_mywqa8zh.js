//保存前校验
viewModel.on("beforeSave", function (args) {
  debugger;
  var currentRow = viewModel.getGridModel().getRow();
  var CountResult = cb.rest.invokeFunction("GT8660AT38.hdhs.CSVoperate", {}, function (err, res) {}, viewModel, { async: false });
  if (CountResult == "true") {
    return true;
  }
});
//保存后
viewModel.on("afterSave", function (args) {
  let projectId = viewModel.get("product").getValue();
  let productId = viewModel.get("projectVO").getValue();
  //编辑后数量
  let quantity = viewModel.get("sl").getValue();
  //原数量
  var quantity1 = viewModel.getCache("quantity1");
  //最终要回写的数量
  if (quantity1 != undefined) {
    quantity = quantity - quantity1;
  }
  let data1 = {
    projectId: projectId,
    productId: productId,
    quantity: quantity
  };
  //调用API,回写数据
  var inner11 = cb.rest.invokeFunction("GT8660AT38.hdhs.kkgl", { data1: data1 }, function (err, res) {}, viewModel, { async: false });
});
// 删除前
viewModel.on("beforeDelete", function () {
  //出库数据
  //物料id
  let EXprojectId = viewModel.get("product").getValue();
  //项目id
  let EXproductId = viewModel.get("projectVO").getValue();
  //要出库的数量
  let EXquantity = viewModel.get("sl").getValue();
  //封装出库数据
  var writeCount = {
    EXprojectId: EXprojectId,
    EXproductId: EXproductId,
    EXquantity: EXquantity
  };
  //回写数据
  var inner = cb.rest.invokeFunction("GT8660AT38.hdhs.DeleteUpdate", { writeCount: writeCount }, function (err, res) {}, viewModel, { async: false });
  if (inner.result.tag == "true") {
    return true;
  }
  cb.utils.confirm("该数据在仓库未找到");
  return false;
});
// 删除后
viewModel.on("afterDelete", function () {
  //出库数据
  //物料id
  let EXprojectId = viewModel.get("product").getValue();
  //项目id
  let EXproductId = viewModel.get("projectVO").getValue();
  //要出库的数量
  let EXquantity = viewModel.get("sl").getValue();
  //封装出库数据
  var writeCount = {
    EXprojectId: EXprojectId,
    EXproductId: EXproductId,
    EXquantity: EXquantity
  };
  //回写数据
  var inner = cb.rest.invokeFunction("GT8660AT38.hdhs.DeleteUpdate2", { writeCount: writeCount }, function (err, res) {}, viewModel, { async: false });
});
viewModel.get("btnEdit") &&
  viewModel.get("btnEdit").on("click", function (data) {
    // 编辑--单击
    //获取使用数量
    let quantity1 = viewModel.get("sl").getValue();
    //放入缓存
    viewModel.setCache("quantity1", quantity1);
  });