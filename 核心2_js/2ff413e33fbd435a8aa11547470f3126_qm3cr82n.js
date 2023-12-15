viewModel.get("personBank") &&
  viewModel.get("personBank").on("afterValueChange", function (data) {
    // 账户类型--值改变后
  });
viewModel.on("customInit", function (data) {
  // 供应商银行账户详情--页面初始化
  let mode = viewModel.getParams().mode;
  if (mode === "add") {
    // 当前为新增态时，选择组织后将登记日期设为当前日期。
    viewModel.get("org_id_name") && viewModel.get("org_id_name").on("afterValueChange", function (data) {});
  }
});
viewModel.on("beforeSave", function (args) {
  // 保存前校验
  // 登记日期必须大于账户开立日期
  var inputDate = viewModel.get("inputDate").getValue();
  var openDate = viewModel.get("openDate").getValue();
  const isAfterDate = (endDate, startDate) => endDate > startDate;
  if (!isAfterDate(inputDate, openDate)) {
    cb.utils.alert("登记日期必须大于账户开立日期");
    return false;
  }
});
viewModel.get("supplier_name") &&
  viewModel.get("supplier_name").on("afterValueChange", function (data) {
    // 所属供应商--值改变后
    // 清空税号
    viewModel.get("taxNo").setValue("");
    // 校验账户是否启用
    const supplier = viewModel.get("supplier").getValue();
    const supplierName = viewModel.get("supplier_name").getValue();
    if (supplier !== null && supplier !== "") {
      // 调用api函数
      cb.rest.invokeFunction("AT16139EE209C8000A.apiCustomFunction.custBankCheck", { supplier: supplier }, function (err, res) {
        const id = res.id;
        if (id === "") {
          cb.utils.alert("供应商银行账户非启用状态，请检查！");
          viewModel.get("supplier").setValue("");
          viewModel.get("supplier_name").setValue("");
        }
      });
    }
  });
viewModel.get("button21kh") &&
  viewModel.get("button21kh").on("click", function (data) {
    // 冻结--单击
    const data = viewModel.getAllData();
    // 账户状态
    const status = viewModel.get("status").getValue();
    if (status !== "1") {
      cb.utils.alert("只有状态为正常的单据才可以冻结");
    } else {
      cb.rest.invokeFunction("AT16139EE209C8000A.apiCustomFunction.freezeBill", { data: data }, function (err, res) {
        if (res.data !== null) {
          // 前端拿到已更新的数据对页面进行塞值
          viewModel.setData(data);
        }
      });
    }
  });