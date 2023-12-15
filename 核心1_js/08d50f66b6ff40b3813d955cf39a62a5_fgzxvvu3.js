viewModel.on("customInit", function (data) {
  var gridModelInfo = viewModel.getGridModel("SY01_pro_sreport_v3List");
  viewModel.on("afterLoadData", function (data) {
    var gridModelDetails = viewModel.getGridModel("SY01_pro_sreport_v3List").get("dataSource");
    var gridModel = viewModel.getGridModel("SY01_pro_sreport_v3List");
    if (viewModel.getParams().mode == "add") {
      let dataInfo = viewModel.getParams().dataInfo;
      if (dataInfo.length > 0) {
        viewModel.get("org_id").setValue(dataInfo[0].org_id); //组织ID
        viewModel.get("org_id_name").setValue(dataInfo[0].org_id_name); //组织名称
        viewModel.get("verifystate").setValue(dataInfo[0].verifystate); //单据状态
        viewModel.get("bizFlowName").setValue(dataInfo[0].bizFlowName); //流程名称
        let childDataInfo = dataInfo[0].SY01_pro_sreport_v3List;
        if (childDataInfo.length > 0) {
          for (let i = 0; i < childDataInfo.length; i++) {
            viewModel.getGridModel().appendRow(childDataInfo[i]);
          }
        }
      }
    }
    for (var i = 0; i < gridModelDetails.length; i++) {
      let productsku = gridModelDetails[i].holder_id;
    }
    viewModel.on("modeChange", function (data) {
      let recheckMan = viewModel.get("staff").getValue();
      if ((data === "add" || data === "edit") && (recheckMan == "" || recheckMan == null)) {
        //获取当前用户对应的员工，赋值给复核人员
        cb.rest.invokeFunction("GT22176AT10.publicFunction.getStaffOfCurUser", { mainOrgId: viewModel.get("org_id").getValue() }, function (err, res) {
          if (res != undefined && res.staffOfCurrentUser != undefined) {
            viewModel.get("staff").setValue(res.staffOfCurrentUser.id);
            viewModel.get("staff_name").setValue(res.staffOfCurrentUser.name);
            viewModel.get("department").setValue(res.staffOfCurrentUser.deptId);
            viewModel.get("department_name").setValue(res.staffOfCurrentUser.deptName);
          }
        });
      }
    });
  });
  viewModel.on("beforePush", function (args) {
    var verifystate = viewModel.getAllData().verifystate;
    if (2 != verifystate) {
      cb.utils.alert("未审核的单据不允许下推!");
      return false;
    }
    let returnPromise = new cb.promise();
    let id = viewModel.get("id").getValue();
    cb.rest.invokeFunction(
      "GT22176AT10.publicFunction.pushOtherCheck",
      {
        ids: [id]
      },
      function (err, res) {
        if (err != undefined) {
          cb.utils.alert(err.message, "error");
          returnPromise.reject();
        }
        if (res != undefined) {
          if (res.message.length > 0) {
            cb.utils.alert(res.message, "error");
            returnPromise.reject();
          } else {
            returnPromise.resolve();
          }
        }
      }
    );
    return returnPromise;
  });
  viewModel.on("beforeSave", function (args) {
    debugger;
    var gridModelDetails1 = viewModel.getGridModel("SY01_pro_sreport_v3List").get("dataSource");
    var gridModel1 = viewModel.getGridModel("SY01_pro_sreport_v3List");
    for (var i = 0; i < gridModelDetails1.length; i++) {
      let qty = gridModelDetails1[i].applications_number;
      if (!qty > 0) {
        cb.utils.alert("申请数量不能为空!");
        return false;
      }
    }
    let promises = [];
    let childData = viewModel.getGridModel("SY01_pro_sreport_v3List").get("dataSource");
    let masterIds = [];
    if (childData.length > 0) {
      for (let i = 0; i < childData.length; i++) {
        masterIds.push(childData[i].source_id);
      }
    }
    promises.push(
      updateBadDrug(masterIds).then((res) => {
        res;
      })
    );
  });
  viewModel.get("staff_name").on("beforeBrowse", function () {
    // 获取组织id
    const value = viewModel.get("org_id").getValue();
    // 实现选择用户的组织id过滤
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "mainJobList.org_id",
      op: "eq",
      value1: value
    });
    this.setFilter(condition);
  });
  //根据审核状态控制按钮显示
  function updateBadDrug(masterIds) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction(
        "GT22176AT10.backDefaultGroup.updateBadDrug",
        {
          masterIds: masterIds
        },
        function (err, res) {
          if (typeof res != "undefined") {
            resolve(res);
          } else if (typeof err != "undefined") {
            cb.utils.alert(err);
            return false;
          }
          resolve();
        }
      );
    });
  }
});