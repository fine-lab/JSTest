viewModel.get("button2ij") &&
  viewModel.get("button2ij").on("click", function (data) {
    // 取消--单击
    let parentViewModel = viewModel.getCache("parentViewModel");
    closeModalWin(parentViewModel);
  });
viewModel.get("button6mk") &&
  viewModel.get("button6mk").on("click", function (data) {
    // 确定--单击
    var parentViewModel = viewModel.getCache("parentViewModel");
    let dataRows = viewModel.getGridModel().getSelectedRows();
    if (dataRows.length == 0) {
      cb.utils.alert("请选择一条关联方案信息！");
      return;
    }
    let dataObj = dataRows[0];
    let CustomerName = dataObj.CustomerName; //潜客id
    let CustomerName_MingChen = dataObj.CustomerName_MingChen; //潜客名称
    if (dataObj.item146mf == undefined || dataObj.item79qa == undefined) {
      cb.utils.alert("请为该客户[" + CustomerName_MingChen + "]生成系统档案！");
      return;
    }
    let id = dataObj.id;
    let code = dataObj.code;
    parentViewModel.get("prospectCust").setValue(CustomerName);
    parentViewModel.get("prospectCust_MingChen").setValue(CustomerName_MingChen);
    parentViewModel.get("prospectCustId").setValue(CustomerName);
    parentViewModel.get("prospectCustName").setValue(CustomerName_MingChen);
    parentViewModel.get("schemeBillId").setValue(id);
    parentViewModel.get("schemeBillNo").setValue(code);
    parentViewModel.get("kehumingchen").setValue(dataObj.item146mf); //客户档案
    parentViewModel.get("kehumingchen_name").setValue(dataObj.item79qa); //客户档案
    parentViewModel.get("qygjdq").setValue(dataObj.Country);
    parentViewModel.get("qygjdq_guoJiaMingCheng").setValue(dataObj.Country_guoJiaMingCheng);
    parentViewModel.get("kehuxinxilaiyuanshijian").setValue(dataObj.item212wd); //客户信息来源时间
    parentViewModel.get("xunpanlaiyuan").setValue(dataObj.item216yf); //客户来源
    parentViewModel.get("yewuyuan").setValue(dataObj.Salesman); //业务人员
    parentViewModel.get("yewuyuan_name").setValue(dataObj.Salesman_name); //业务人员
    closeModalWin(parentViewModel);
    parentViewModel.get("schemeBillNo").fireEvent("afterValueChange");
  });
viewModel.get("button8nh") &&
  viewModel.get("button8nh").on("click", function (data) {
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
const closeModalWin = (parentViewModel) => {
  let kehumingchen = parentViewModel.get("prospectCust").getValue();
  parentViewModel.get("prospectCust_MingChen").setDisabled(kehumingchen != undefined && kehumingchen != "");
  parentViewModel.get("shiyebu_name").setValue("游乐事业部");
  parentViewModel.get("shiyebu").setValue("1573823532355289106");
  parentViewModel.setCache("isOpened", false);
  viewModel.communication({ type: "modal", payload: { data: false } });
};
viewModel.on("afterMount", function (data) {
  document.getElementsByClassName("close dnd-cancel")[0].style.display = "none";
});