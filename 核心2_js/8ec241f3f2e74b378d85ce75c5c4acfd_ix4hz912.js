viewModel.get("button4vi") &&
  viewModel.get("button4vi").on("click", function (data) {
    // 取消--单击
    let parentViewModel = viewModel.getCache("parentViewModel");
    parentViewModel.clearCache("isOpened");
    viewModel.communication({ type: "modal", payload: { data: false } });
  });
viewModel.get("button10nd") &&
  viewModel.get("button10nd").on("click", function (data) {
    // 确定--单击
    var parentViewModel = viewModel.getCache("parentViewModel");
    let dataRows = viewModel.getGridModel().getSelectedRows();
    if (dataRows.length == 0) {
      cb.utils.alert("请选择一条关联方案信息！");
      return;
    }
    debugger;
    let dataObj = dataRows[0];
    let CustomerName = dataObj.CustomerName; //潜客id
    let CustomerName_MingChen = dataObj.CustomerName_MingChen; //潜客名称
    if (dataObj.item183di == undefined || dataObj.item97mk == undefined) {
      cb.utils.alert("请为该客户[" + CustomerName_MingChen + "]生成系统档案！");
      return;
    }
    let id = dataObj.id;
    let code = dataObj.code;
    parentViewModel.get("shiyebu_name").setValue("百特环保事业部");
    parentViewModel.get("shiyebu").setValue("1568704274785370123");
    parentViewModel.get("prospectCust").setValue(CustomerName);
    parentViewModel.get("prospectCust_MingChen").setValue(CustomerName_MingChen);
    parentViewModel.get("schemeBillId").setValue(id);
    parentViewModel.get("schemeBillNo").setValue(code);
    parentViewModel.get("kehumingchen").setValue(dataObj.item183di); //客户档案
    parentViewModel.get("kehumingchen_name").setValue(dataObj.item97mk); //客户档案
    parentViewModel.get("qygjdq").setValue(dataObj.ProjectCountry);
    parentViewModel.get("qygjdq_guoJiaMingCheng").setValue(dataObj.ProjectCountry_guoJiaMingCheng);
    parentViewModel.get("kehuxinxilaiyuanshijian").setValue(dataObj.item268xc); //客户信息来源时间
    parentViewModel.get("xunpanlaiyuan").setValue(dataObj.item272jf); //客户来源
    parentViewModel.setCache("isOpened", false);
    viewModel.communication({ type: "modal", payload: { data: false } });
  });
viewModel.get("button13bi") &&
  viewModel.get("button13bi").on("click", function (data) {
    // 申请更新业务员--单击
    let dataBody = {
      billtype: "Voucher",
      domainKey: "yourKeyHere",
      billno: "3b6f887d",
      params: {
        mode: "add", // (编辑态edit、新增态add、浏览态browse)
        isBrowse: false,
        readOnly: false
      }
    };
    cb.loader.runCommandLine("bill", dataBody, viewModel);
  });