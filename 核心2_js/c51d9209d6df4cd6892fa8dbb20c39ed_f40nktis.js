viewModel.on("afterLoadData", function (data) {
  var viewModel = this;
  let strDate = new Date();
  var Y = strDate.getFullYear();
  var M = strDate.getMonth() + 1 < 10 ? "0" + (strDate.getMonth() + 1) : strDate.getMonth() + 1;
  var D = strDate.getDate() < 10 ? "0" + strDate.getDate() : strDate.getDate();
  let strVouchDate = `${Y}-${M}-${D}`;
  viewModel.get("vouchdate").setValue(strVouchDate);
});
let user = cb.rest.AppContext.user;
let referValue = "";
viewModel.on("afterLoadData", function (event) {
  let referModel = viewModel.get("client_name");
  referModel.on("beforeBrowse", function () {
    var viewModel = this;
    const value = "";
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    cb.utils.alert(referValue);
    condition.simpleVOs.push({
      field: "merchantAppliedDetail.professSalesman.name",
      op: "eq",
      value1: referValue
    });
    this.setFilter(condition);
  });
  cb.rest.invokeFunction("GT8429AT6.CommonFunction.getEmployee", {}, function (err, res) {
    console.log(JSON.stringify(res));
    let deptid = res.deptObj[0].mainJobList_dept_id;
    let deptname = res.deptObj[0].mainJobList_dept_id_name;
    let deptcode = res.deptObj[0].mainJobList_dept_id_code;
    viewModel.get("apply_user_dept").setValue(deptname);
    viewModel.get("apply_user_dept_id").setValue(deptid);
    viewModel.get("apply_user_dept_code").setValue(deptcode);
  });
});
viewModel.get("client_name") &&
  viewModel.get("client_name").on("beforeBrowse", function (data) {
    referValue = user.userName;
  });
viewModel.on("workflowLoaded", (args) => {
  let bShowIt = viewModel.get("c_lckzcontrol").getState("bShowIt");
  let verifystate = viewModel.get("verifystate").getValue();
  //默认设置为不显示
  //编辑按钮：审批中单据不显示（其他状态的产品功能是对的）
  //撤回按钮：审批中单据显示撤回，其他状态不显示
  //审批中: 编辑不显示，撤回显示
  //已审批：编辑不显示，撤回显示
  //撤回按钮
  viewModel.get("dctl1693529968273_1").setVisible(false);
  //编辑按钮
  viewModel.get("btnEdit").setVisible(false);
  //审批按钮
  if (verifystate == 1) {
    viewModel.get("dctl1693529968273_1").setVisible(true);
  } else if (verifystate == 2) {
  } else if (verifystate == 0) {
    viewModel.get("btnEdit").setVisible(true);
  }
});