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
  // 当触发搜索前的事件时  执行回调函数
  let rolesRest = cb.rest.invokeFunction("GT3734AT5.APIFunc.getUsrRoles", { rolecode: "spjs" }, function (err, res) {}, viewModel, { async: false }); // 使用 REST 调用获取用户角色信息
  let roleResObj = rolesRest.result; // 获取角色信息的结果对象
  debugger;
  if (roleResObj.admin === true || roleResObj.chkrst) {
    return; // 检查是否为管理员或具有审核权限，如果是，则返回
  }
  if ("1573848073785835568" == roleResObj.staffId) {
    // 如果角色是特定ID，则返回（1573848073785835568 可能是某个特定的角色ID）
  }
  let roles = roleResObj.roles; // 获取用户的角色列表
  let isXunpanRenY = chkUsrRole(roles, ["kk001"]); //询盘    // 检查是否为询盘人员
  let isYeWu = chkUsrRole(roles, ["kk002", "kk003", "kk004"]); //业务员   // 检查是否为业务人员
  let isShiChang = chkUsrRole(roles, ["kkscry"]); //市场部人员
  if (isXunpanRenY || isYeWu || isShiChang) {
    // 如果是询盘人员或业务员或市场部人员
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
          },
          {
            field: "scbry",
            op: "in",
            value1: [roleResObj.staffId]
          }
        ]
      }
    ];
    return;
  }
  // 在这里添加一段代码来检查转部门的情况，更新权限
  let isTransferred = chkUsrRole(roles, ["newRole"]); // 假设这里有一个新的标识来判断用户是否转部门了
  if (isTransferred) {
    // 如果用户转部门了，根据新的部门角色重新设置权限和搜索条件
    args.isExtend = true;
    args.params.condition.simpleVOs = [
      {
        // 更新为新部门的搜索条件
      }
    ];
    return;
  }
  let isYeWuGL = chkUsrRole(roles, ["kk1201", "kk005", "kk1202"]); //业务主管,2023-5-20 去掉询盘主管权限 'kkxpzg'
  if (isYeWuGL) {
    let rst = cb.rest.invokeFunction("GT3734AT5.APIFunc.getChildStaff", {}, function (err, res) {}, viewModel, { async: false }); // 使用 REST 调用获取子员工信息
    let rstObj = rst.result; // 获取子员工信息的结果对象
    let childStaffList = rstObj.rstData.data; // 获取子员工列表
    if (childStaffList == undefined || childStaffList == null) {
      // 如果子员工列表为空，则初始化为空数组
      childStaffList = [];
    }
    childStaffList.push(rstObj.staffId); // 将员工ID添加到子员工列表中
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
          },
          {
            field: "scbry",
            op: "in",
            value1: childStaffList
          }
        ]
      }
    ];
    return;
  }
  return;
  args.isExtend = true;
  var commonVOs = args.params.condition.commonVOs; //通用检查查询
  commonVOs.push({
    itemName: "yeWuYuan",
    op: "eq",
    value1: roleResObj.staffId
  });
  return;
  let rest = cb.rest.invokeFunction("GT3734AT5.APIFunc.xunPYwyFilterApi", {}, function (err, res) {}, viewModel, { async: false });
  let resObj = rest.result;
  let ywyCount = resObj.ywyCount;
  let baZhangCount = resObj.baZhangCount;
  let staffId = resObj.staffId;
  let xunPanRenYCount = resObj.xunPanRenYCount;
  if (ywyCount > 0 && baZhangCount == 0) {
    args.isExtend = true;
    var commonVOs = args.params.condition.commonVOs; //通用检查查询
    commonVOs.push({
      itemName: "yeWuYuan",
      op: "eq",
      value1: staffId
    });
  } else if (xunPanRenYCount > 0) {
    args.isExtend = true;
    var commonVOs = args.params.condition.commonVOs; //通用检查查询
    commonVOs.push({
      itemName: "xunPanRenY",
      op: "eq",
      value1: staffId
    });
  } else {
    args.isExtend = true;
    var commonVOs = args.params.condition.commonVOs; //通用检查查询
    commonVOs.push({
      itemName: "yeWuYuan",
      op: "eq",
      value1: staffId
    });
  }
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