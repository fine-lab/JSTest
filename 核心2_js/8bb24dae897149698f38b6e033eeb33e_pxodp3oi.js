viewModel.on("afterMount", function (params) {
  var billNo = viewModel.getParams().billNo;
  cb.rest.invokeFunction("GT3734AT5.APIFunc.getLimitFieldApi", { billNo: billNo }, function (err, res) {
    if (err != null) {
      cb.utils.alert("权限控制异常");
      return false;
    } else {
      if (res.data.length > 0) {
        let data = res.data;
        for (let i in data) {
          let dataObj = data[i]; //let isMain = dataObj.isMain;
          let fieldParamsList = dataObj.FieldParamsList;
          let isList = dataObj.isList;
          let isVisilble = dataObj.isVisilble;
          for (j in fieldParamsList) {
            let fieldParams = fieldParamsList[j];
            let fieldName = fieldParams.fieldName;
            let isMain = fieldParams.isMain;
            let childrenField = fieldParams.childrenField;
            if (isList) {
              //列表单据
              viewModel.get(childrenField).setColumnState(fieldName, "bShowIt", isVisilble);
              viewModel.get(childrenField).setColumnState(fieldName, "bHidden", !isVisilble);
            } else {
              //单据
              if (isMain) {
                //主表
                viewModel.get(fieldName).setVisible(isVisilble);
              } else {
                viewModel.get(childrenField).setColumnState(fieldName, "bShowIt", isVisilble);
                viewModel.get(childrenField).setColumnState(fieldName, "bHidden", !isVisilble);
              }
            }
          }
        }
      }
    }
  });
});
viewModel.on("beforeSearch", function (args) {
  var queryOrders = args.params.condition.queryOrders; //排序
  if (queryOrders == undefined) {
    args.params.condition.queryOrders = [
      {
        field: "modifyTime",
        order: "desc"
      }
    ];
  } else {
    queryOrders.push({
      field: "modifyTime",
      order: "desc"
    });
  }
  let rolesRest = cb.rest.invokeFunction("GT3734AT5.APIFunc.getUsrRoles", { rolecode: "HTGL" }, function (err, res) {}, viewModel, { async: false });
  let roleResObj = rolesRest.result;
  if (roleResObj.admin === true) {
    return;
  }
  let roles = roleResObj.roles;
  let isXunpanRenY = chkUsrRole(roles, ["kk001"]); //询盘
  let isYeWu = chkUsrRole(roles, ["kk002", "kk003", "kk004"]); //业务员
  if (isXunpanRenY || isYeWu) {
    args.isExtend = true;
    args.params.condition.simpleVOs = [
      {
        logicOp: "or",
        conditions: [
          {
            field: "yeWuYuan",
            op: "in",
            value1: [roleResObj.staffId]
          },
          {
            field: "xunPanRenY",
            op: "in",
            value1: [roleResObj.staffId]
          }
        ]
      }
    ];
    return;
  }
  let isYeWuGL = chkUsrRole(roles, ["kk1201", "kk005", "kk1202", "kkxpzg", "kkxpjjb"]); //业务主管
  if (isYeWuGL) {
    let rst = cb.rest.invokeFunction("GT3734AT5.APIFunc.getChildStaff", {}, function (err, res) {}, viewModel, { async: false });
    let rstObj = rst.result;
    let childStaffList = rstObj.rstData.data;
    if (childStaffList == undefined || childStaffList == null) {
      childStaffList = [];
    }
    childStaffList.push(rstObj.staffId);
    args.isExtend = true;
    args.params.condition.simpleVOs = [
      {
        logicOp: "or",
        conditions: [
          {
            field: "yeWuYuan",
            op: "in",
            value1: childStaffList
          },
          {
            field: "xunPanRenY",
            op: "in",
            value1: childStaffList
          }
        ]
      }
    ];
    return;
  }
  args.isExtend = true;
  var commonVOs = args.params.condition.commonVOs; //通用检查查询
  commonVOs.push({
    itemName: "yeWuYuan",
    op: "eq",
    value1: roleResObj.staffId
  });
  return;
});
let chkUsrRole = (roles, roleParams, fieldName) => {
  for (var i in roleParams) {
    let roleParam = roleParams[i];
    for (var j in roles) {
      let roleObj = roles[j];
      let roleVal = fieldName == undefined || fieldName == null || fieldName == "code" ? roleObj.role_code : roleObj.role_name;
      if (roleVal == roleParam) {
        return true;
      }
    }
  }
  return false;
};