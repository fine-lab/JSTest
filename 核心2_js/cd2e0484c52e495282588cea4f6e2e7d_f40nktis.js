var pass_contract_code = viewModel.getParams().pass_contract_code;
viewModel.on("afterMount", function () {
  // 获取查询区模型
  const filtervm = viewModel.getCache("FilterViewModel");
  filtervm.on("afterInit", function () {
    // 进行查询区相关扩展
    filtervm.get("sactCode").getFromModel().setValue(pass_contract_code);
  });
});