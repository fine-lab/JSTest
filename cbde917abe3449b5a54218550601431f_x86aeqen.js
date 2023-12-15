let itemGrid = viewModel.get("dep_detail_extList");
itemGrid.setColumnState("priority", "bIsNull", false);
//更新部门审批负责人表
let updateDeptMangeStaff = function () {
  //封装部门审批信息
  let rowDatas = itemGrid.getRows();
  let deptName = viewModel.get("name").getValue().zh_CN;
  let deptId = viewModel.get("id").getValue();
  let parentDeptId = viewModel.get("parent").getValue();
  let postId = viewModel.get("deptOrgExt!managepositionid").getValue();
  let approvalType = viewModel.get("ext_approval_type").getValue();
  let currentDate = new Date().toISOString();
  let deptEffectiveDate = currentDate.substr(0, 10);
  let param = {
    deptId,
    rowDatas: ""
  };
  if (rowDatas) {
    rowDatas.map((row) => {
      row.deptName = deptName;
      row.deptId = deptId;
      row.parentDeptId = parentDeptId;
      row.postId = postId;
      row.approvalType = approvalType;
      row.deptEffectiveDate = deptEffectiveDate;
    });
    param.rowDatas = JSON.stringify(rowDatas);
  }
  //更新部门审批负责人表
  cb.rest.invokeFunction("GZTORG.rule.insertDeptMStaff", { param }, function (err, res) {});
};
//根据部门审批属性和负责岗获取负责人员信息
let queryMangeStaffByPostAndApprovalType = function (postId, approvalType) {
  if (postId && approvalType) {
    let deptName = viewModel.get("name").getValue().zh_CN;
    let deptId = viewModel.get("id").getValue();
    cb.rest.invokeFunction("GZTORG.rule.queryStaffByPost", { postId, deptName, deptId }, function (err, res) {
      itemGrid.setDataSource(res.gridData);
      //部门审批属性
      itemGrid.setColumnValue("priority", 1);
      if (approvalType > 3) {
        itemGrid.setColumnState("priority", "bCanModify", true);
      } else {
        itemGrid.setColumnState("priority", "bCanModify", false);
      }
      if (approvalType == 6) {
        itemGrid.setColumnValue("priority", 99);
        itemGrid.setCellValue(0, "priority", 1);
      }
    });
  }
};
itemGrid.on("afterCellValueChange", function (data) {
  if (data.cellName == "priority") {
    let approvalType = viewModel.get("ext_approval_type").getValue();
    if (approvalType == 6) {
      itemGrid.setColumnValue("priority", 99);
      itemGrid.setCellValue(data.rowIndex, "priority", 1);
    }
  }
});
viewModel.get("ext_approval_type") &&
  viewModel.get("ext_approval_type").on("afterValueChange", function (data) {
    //部门审批属性--值改变后
    if (data && data.value) {
      let postId = viewModel.get("deptOrgExt!managepositionid").getValue();
      queryMangeStaffByPostAndApprovalType(postId, data.value.value);
    } else {
      itemGrid.setDataSource([]);
    }
  });
viewModel.get("deptOrgExt!managepositioni_name") &&
  viewModel.get("deptOrgExt!managepositioni_name").on("afterValueChange", function (data) {
    //负责岗 --值改变后
    if (data && data.value) {
      let approvalType = viewModel.get("ext_approval_type").getValue();
      queryMangeStaffByPostAndApprovalType(data.value.id, approvalType);
    } else {
      itemGrid.setDataSource([]);
    }
  });
viewModel.on("afterLoadData", function (data) {
  //部门卡片--加载后
  let deptName = viewModel.get("name").getValue().zh_CN;
  let deptId = viewModel.get("id").getValue();
  let postId = viewModel.get("deptOrgExt!managepositionid").getValue();
  if (deptId && postId) {
    cb.rest.invokeFunction("GZTORG.rule.queryDeptMStaff", { postId, deptId }, function (err, res) {
      if (res.gridData) {
        res.gridData.map((rowData) => {
          rowData.deptName = deptName;
        });
      }
      itemGrid.setDataSource(res.gridData);
    });
  }
});
viewModel.on("beforeSave", function (data) {
  //部门卡片--保存
  if (data.data.data) {
    let saveData = JSON.parse(data.data.data);
    saveData.dep_detail_extList = "";
    data.data.data = JSON.stringify(saveData);
    //更新部门审批表数据
    updateDeptMangeStaff();
    //更新工作流数据
    updateDeptFlowData(data);
  }
});
//更新工作流数据
let updateDeptFlowData = function (data) {
  let neededrowDatas = itemGrid.getRows();
  let bizobj = JSON.parse(data.data.data);
  let orgid = bizobj.orgid;
  let orgidName = bizobj.parentorgid_name;
  let deptidname = viewModel.get("name").getValue().zh_CN;
  let deptid = viewModel.get("id").getValue();
  let deptcode = bizobj.code;
  // 所属上级
  let parentorgid = bizobj.parent;
  // 分管领导 branchleader
  let assignedmanager = bizobj.branchleader;
  // 审批类型
  let typeArr = viewModel.get("ext_approval_type").__data.dataSource;
  let shenpileixinggenorgidbangding = "";
  if (typeArr && typeArr.length > 0) {
    typeArr.forEach(function (item) {
      if (item.value == viewModel.get("ext_approval_type").getValue()) {
        shenpileixinggenorgidbangding = item.text;
      }
    });
  }
  let child = {};
  let ZBGLZBList = [];
  neededrowDatas.forEach(function (item) {
    let childZBG = {};
    // 子表
    childZBG.defaultmanager = item.staffId;
    childZBG.assignedmanager = assignedmanager;
    childZBG.orgid = bizobj.orgid;
    childZBG.parentorgid = parentorgid;
    childZBG.priority = item.priority;
    childZBG.shenpileixinggenorgidbangding = shenpileixinggenorgidbangding;
    ZBGLZBList.push(childZBG);
  });
  // 主表
  child.ZBGLZBList = ZBGLZBList;
  child.startdept = bizobj.id;
  child.deptName = deptidname;
  child.startorg = bizobj.orgid;
  child.orgidName = orgidName;
  child.bianma = bizobj.code;
  let childData = [child];
  let param = {};
  param.childData = JSON.stringify(childData);
  cb.rest.invokeFunction("GZTORG.rule.dealCCmanage", { param }, function (err, res) {});
};