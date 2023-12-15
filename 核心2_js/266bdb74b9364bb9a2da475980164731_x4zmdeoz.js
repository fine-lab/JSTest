function loadStyle(params) {
  var headobj = document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  headobj.appendChild(style);
  style.sheet.insertRule(params, 0);
}
viewModel.on("customInit", function (data) {
  //过滤商机
  loadStyle(".viewSetting .pictureupload .label-control.multi-line {width:300px !important;overflow:inherit;white-space:nowrap}");
  // 售前确认单详情--页面初始化
  viewModel.get("shangji_name").on("beforeBrowse", function () {
    // 获取当前编辑行的品牌字段值
    const value = viewModel.get("kehujingli").getValue();
    console.log("客户经理：" + value);
    // 实现品牌的过滤
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "manager",
      op: "eq",
      value1: value
    });
    this.setFilter(condition);
  });
});
viewModel.on("customInit", function (data) {
  //过滤客户
  loadStyle(".viewSetting .pictureupload .label-control.multi-line {width:300px !important;overflow:inherit;white-space:nowrap}");
  // 售前确认单详情--页面初始化
  viewModel.get("jy_customer_customer_name").on("beforeBrowse", function () {
    // 获取当前编辑行的品牌字段值
    const value = viewModel.get("kehujingli").getValue();
    console.log("客户经理：" + value);
    // 实现品牌的过滤
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "respon_person",
      op: "eq",
      value1: value
    });
    this.setFilter(condition);
  });
});
viewModel.on("beforeWorkflow", function (e) {
  //按角色控制销管确认信息必输
  let userRole = cb.rest.invokeFunction("AT15D266F408300004.backFunction.queryUserRoles", {}, function (err, res) {}, viewModel, { async: false });
  let roleResult = userRole.result.res;
  let haveRole = false;
  for (var i = 0; i < roleResult.length; i++) {
    if (roleResult[i].role_code == "hnxgzj") {
      haveRole = true;
      break;
    }
  }
  if (haveRole) {
    let bianhao = viewModel.get("xiangmuhetongbianhao").getValue();
    let jine = viewModel.get("hetongjine").getValue();
    let dingyueyunjine = viewModel.get("dingyueyunjine").getValue();
    let chengben = viewModel.get("disanfangyingjianjichengben").getValue();
    if (bianhao == null || jine == null || dingyueyunjine == null || chengben == null) {
      cb.utils.alert("销管和人力确认信息必填");
      return false;
    }
  }
});
viewModel.on("beforeSave", function (data) {
  debugger;
  let billData = JSON.parse(data.data.data);
  let childList = billData.sqyjList;
  if (childList) {
    let canSave = true;
    for (var i = 0; i < childList.length; i++) {
      //顾问同时为空
      if (childList[i].jituanguwen == null && childList[i].shouqianguwen == null) {
        cb.utils.alert("售前顾问和集团顾问不能同时为空");
        canSave = false;
        break;
      }
      //顾问同时非空
      if (childList[i].jituanguwen != null && childList[i].shouqianguwen != null) {
        cb.utils.alert("售前顾问和集团顾问不能同时有值");
        canSave = false;
        break;
      }
    }
    if (!canSave) {
      return false;
    }
  }
});