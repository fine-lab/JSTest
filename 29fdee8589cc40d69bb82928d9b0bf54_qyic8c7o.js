viewModel.get("chanpinfenlei").on("afterValueChange", function (data) {
  // 产品分类--值改变后
  let productCategory = data.value.value;
  let fieldcloudData = [];
  cb.rest.invokeFunction(
    "AT1720E86417F00009.rule.fieldcloudApi",
    { productCategory },
    function (err, res) {
      fieldcloudData = res.data;
      viewModel.get("fieldcloud").setDataSource(fieldcloudData);
    },
    viewModel,
    { async: true }
  );
});
viewModel.get("fieldcloud").on("afterValueChange", function (data) {
  // 领域云--值改变后
  let productCategory = viewModel.get("chanpinfenlei").getData(); //获取产品分类得值
  let domainCloud = data.value.value;
  let fieldData = [];
  cb.rest.invokeFunction(
    "AT1720E86417F00009.rule.fieldApi",
    { productCategory, domainCloud },
    function (err, res) {
      fieldData = res.data;
      viewModel.get("field").setDataSource(fieldData);
    },
    viewModel,
    { async: true }
  );
});
viewModel.get("field").on("afterValueChange", function (data) {
  // 领域--值改变后
  let productCategory = viewModel.get("chanpinfenlei").getData(); //获取产品分类值
  let domainCloud = viewModel.get("fieldcloud").getData(); //获取领域云值
  let domain = data.value.value;
  let serviecegroupData = [];
  cb.rest.invokeFunction(
    "AT1720E86417F00009.rule.serviecegroupApi",
    { productCategory, domainCloud, domain },
    function (err, res) {
      serviecegroupData = res.data;
      viewModel.get("serviecegroup").setDataSource(serviecegroupData);
    },
    viewModel,
    { async: true }
  );
});