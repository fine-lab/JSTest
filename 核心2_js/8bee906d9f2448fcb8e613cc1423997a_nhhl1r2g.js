viewModel.on("customInit", function (data) {
  // 客户费用单据--页面初始化
  debugger;
  var viewModel = this;
  // 将父页面传过来的参数弹出 测试
  cb.utils.alert(viewModel.getParams().hello);
  // 取消按钮
  viewModel.get("button20lj").on("click", function (data) {
    viewModel.communication({
      type: "modal",
      payload: {
        data: false
      }
    });
  });
  // 确认按钮
  viewModel.get("button24cd").on("click", function (args) {
    // 获取父页面模型
    let parentViewModel = viewModel.getCache("parentViewModel");
    // 获取弹出页面选中的下标
    var indexes = viewModel.getGridModel().getSelectedRowIndexes();
    //校验可用金额不能为 0
    if (viewModel.getGridModel().getRows()[indexes[0]].surplusMoney === 0 || viewModel.getGridModel().getRows()[indexes[0]].status !== 1) {
      cb.utils.alert("当前选中数据未审批或可用费用为0,不允许做调整单！");
      // 获取弹出页面选中的数据
      indexes.forEach(function (index) {
        // 对父页面 值清空
        //客户费用-金额 单据编码
        parentViewModel.get("costvbillcode").setValue(null);
        //总返利金额
        parentViewModel.get("rebateMoney").setValue(null);
        //可用余额
        parentViewModel.get("surplusMoney").setValue(null);
        //原客户
        parentViewModel.get("oldcustomer").setValue(null);
        //本次调整金额 【默认带出 可用金额】
        parentViewModel.get("adjustMoney").setValue(null);
        //客户费用-金额 单据ID
        parentViewModel.get("costid").setValue(null);
        //客户费用-金额 销售组织
        parentViewModel.get("salesOrgId").setValue(null);
        //客户费用-金额 单据日期
        parentViewModel.get("vouchdate").setValue(null);
        //客户费用-金额 开票组织
        parentViewModel.get("settlementOrgId").setValue(null);
        //客户费用-金额 兑付方式
        parentViewModel.get("useWayCode").setValue(null);
        //客户费用-金额 应用类型
        parentViewModel.get("useType").setValue(null);
        //客户费用-金额 有效期结束日期
        parentViewModel.get("validEndDate").setValue(null);
        //客户费用-金额 币种 【对应ID】
        parentViewModel.get("originalPk").setValue(null);
      });
    } else {
      // 获取弹出页面选中的数据
      indexes.forEach(function (index) {
        // 对父页面赋值
        //客户费用-金额 单据编码
        parentViewModel.get("costvbillcode").setValue(viewModel.getGridModel().getRows()[index].code);
        //总返利金额
        parentViewModel.get("rebateMoney").setValue(viewModel.getGridModel().getRows()[index].rebateMoney);
        //可用余额
        parentViewModel.get("surplusMoney").setValue(viewModel.getGridModel().getRows()[index].surplusMoney);
        //原客户
        parentViewModel.get("oldcustomer").setValue(viewModel.getGridModel().getRows()[index].agentId);
        //本次调整金额 【默认带出 可用金额】
        parentViewModel.get("adjustMoney").setValue(viewModel.getGridModel().getRows()[index].surplusMoney);
        //客户费用-金额 单据ID
        parentViewModel.get("costid").setValue(viewModel.getGridModel().getRows()[index].id);
        //客户费用-金额 销售组织
        parentViewModel.get("salesOrgId").setValue(viewModel.getGridModel().getRows()[index].salesOrgId);
        //客户费用-金额 单据日期
        parentViewModel.get("vouchdate").setValue(viewModel.getGridModel().getRows()[index].vouchdate);
        //客户费用-金额 开票组织
        parentViewModel.get("settlementOrgId").setValue(viewModel.getGridModel().getRows()[index].salesOrgId);
        //客户费用-金额 兑付方式
        parentViewModel.get("useWayCode").setValue(viewModel.getGridModel().getRows()[index].useWayCode);
        //客户费用-金额 应用类型
        parentViewModel.get("useType").setValue(viewModel.getGridModel().getRows()[index].useType);
        //客户费用-金额 有效期开始日期
        //客户费用-金额 有效期结束日期
        parentViewModel.get("validEndDate").setValue(viewModel.getGridModel().getRows()[index].validEndDate);
        //客户费用-金额 币种 【对应ID】
        parentViewModel.get("originalPk").setValue(viewModel.getGridModel().getRows()[index].originalPk);
      });
    }
    // 将表格内的所有行值设置到父页面的 cache 里，可以在父页面调用
    parentViewModel.setCache("childGridRows", viewModel.getGridModel().getRows());
    // 关闭弹窗
    viewModel.communication({
      type: "modal",
      payload: {
        data: false
      }
    });
  });
});