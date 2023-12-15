viewModel.get("button15zc") &&
  viewModel.get("button15zc").on("click", function (data) {
    // 确定--单击
    var rowDatas = viewModel.getGridModel().getSelectedRows();
    if (rowDatas.length == 0) {
      cb.utils.alert("没有选取潜客记录！");
      return;
    }
    cb.utils.confirm(
      "生成系统客户档案需要分为两步\n\r第一步:同步富通客戶信息,点击“取消”不执行同步操作，点击“确定”从富通获取最新数据进行同步更新。",
      function () {
        synFromFTCust(rowDatas[0]);
        secondFunc(rowDatas, "您已执行过同步更新");
      },
      function (args) {
        secondFunc(rowDatas, "您未执行同步更新操作,请确保与富通数据一致");
      }
    );
  });
const secondFunc = (rowDatas, msg) => {
  cb.utils.confirm(
    msg + "\n\r第二步：生成系统客户档案\n\r确定要生成系统客户档案吗？点击“确定”按钮生成客户档案。",
    function () {
      var rowData = rowDatas[0];
      synCreateSysCust(rowData);
    },
    function (args) {
      return;
    }
  );
};
function synFromFTCust(rowData) {
  debugger;
  let custId = rowData.id;
  let code = rowData.code;
  let MingChen = rowData.MingChen;
  let rest = cb.rest.invokeFunction("GT3734AT5.APIFunc.getCustFromFTApi", { custCode: code, custId: custId, orgName: "建机事业部", billNo: "b979b0e9" }, function (err, res) {}, viewModel, {
    async: false
  });
  let rst = rest.result.rst;
  if (rst) {
    cb.utils.alert("温馨提示！同步客户档案成功!", "info");
  } else {
    cb.utils.alert("温馨提示！同步客户档案", "error");
  }
}
function synCreateSysCust(rowData) {
  let isRelated = rowData.isRelated;
  let merchant = rowData.merchant;
  if (isRelated && merchant != null && merchant != "") {
    cb.utils.alert("温馨提示，系统客户档案已生成,不能重复生成！", "error");
    return;
  }
  let id = rowData.id;
  let code = rowData.code;
  let MingChen = rowData.MingChen;
  let merchant_name = rowData.merchant_name;
  let GuoJia = rowData.GuoJia;
  if (id == null || id == "" || GuoJia == undefined || GuoJia == null || GuoJia == "") {
    cb.utils.alert("温馨提示,关键信息不全,请先完善信息!", "error");
    return;
  }
  cb.rest.invokeFunction("GT3734AT5.APIFunc.createSysCustApi", { orgName: "建机事业部", id: id, code: code, MingChen: MingChen, merchant_name: merchant_name }, function (err, res) {
    if (err == null) {
      let resData = res.data;
      var rst = resData.rst;
      if (rst) {
        cb.utils.alert("温馨提示！系统客户档案已生成[" + resData.custCode + "]", "info");
      } else {
        cb.utils.alert("温馨提示！系统客户档案生成失败[" + resData.msg + "]", "error");
      }
    } else {
      cb.utils.alert("温馨提示！系统客户档案生成失败:" + JSON.JSON.stringify(err), "error");
    }
    let parentViewModel = viewModel.getCache("parentViewModel");
    parentViewModel.execute("refresh");
    viewModel.communication({ type: "modal", payload: { data: false } });
  });
}
viewModel.on("beforeSearch", function (args) {
  let user = cb.rest.AppContext.user;
  let userName = user.userName;
  if (userName == "王西亚" || userName == "闫富森" || userName == "gole" || userName == "钱培培" || userName == "刘涵") {
    return;
  }
  let rst = cb.rest.invokeFunction("GT3734AT5.APIFunc.getChildStaff", {}, function (err, res) {}, viewModel, { async: false });
  let rstObj = rst.result;
  let childStaffList = rstObj.rstData.data;
  if (childStaffList.length >= 0) {
    childStaffList.push(rstObj.staffId);
    args.isExtend = true;
    args.params.condition.simpleVOs = [
      {
        logicOp: "or",
        conditions: [
          {
            field: "Sales",
            op: "in",
            value1: childStaffList
          }
        ]
      }
    ];
    return;
  }
});