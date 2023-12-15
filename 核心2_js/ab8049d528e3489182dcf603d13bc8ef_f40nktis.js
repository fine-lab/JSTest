viewModel.on("afterLoadData", function (data) {
  var viewModel = this;
  if (viewModel.getParams().mode == "add") {
    //如果来自商机跳转
    let parentBillNo = viewModel.getCache("parentViewModel")?.getParams()?.billNo;
    if ("sfa_opptcard" == parentBillNo) {
      let opptData = viewModel.getCache("parentViewModel")?.getData();
      if (opptData) {
        viewModel.get("contact")?.setValue(opptData["headDef!define2"]); //联系人手机   联系方式
        viewModel.get("customer")?.setValue(opptData?.customer);
        viewModel.get("customer_name")?.setValue(opptData?.customer_name); //客户-客户
        viewModel.get("project_add")?.setValue(opptData?.address); //详细地址 项目地址
        viewModel.get("source_id")?.setValue(opptData?.id); //上游单据主表id
        viewModel.get("source_billtype")?.setValue("SFA.sfa_opptcard"); //上游单据主表id
      }
    } else {
      let result = cb.rest.invokeFunction("GT8429AT6.rule.getMobileInH5", {}, function (err, res) {}, viewModel, {
        async: false
      });
      let mobile = result.result.nameObj[0].mobile;
      viewModel.get("contact").setValue(mobile);
    }
  }
});
viewModel.on("beforeSave", function () {
  const data = viewModel.getAllData();
  console.log(JSON.stringify(data));
  let len = data.open_areaList.length;
  let openAreaList = data.open_areaList;
  if (len > 0) {
    for (var i = 0; i < len; i++) {
      let open_area_num = openAreaList[i].open_area_num_v2;
      if (open_area_num < 0) {
        cb.utils.alert("开放区数量有误");
        return false;
      }
    }
  }
  let len2 = data.plane_apply_detailList.length;
  let planeApply = data.plane_apply_detailList;
  if (len > 0) {
    for (var i = 0; i < len; i++) {
      let private_room_num = planeApply[i].private_room_num_v2;
      if (private_room_num < 0) {
        cb.utils.alert("包间数量有误");
        return false;
      }
    }
  }
  if (!data.open_areaList.length) {
    cb.utils.alert("开放区不能为空");
    return false;
  }
  if (!data.plane_apply_detailList.length) {
    cb.utils.alert("包间不能为空");
    return false;
  }
});
viewModel.get("plane_apply_detailList") &&
  viewModel.get("plane_apply_detailList").on("afterCellValueChange", function (data) {
    // 包间--单元格值改变后
    let rows = viewModel.getGridModel("plane_apply_detailList").getRows();
    let len = rows.length;
    let deviceModelArr = [];
    for (var i = 0; i < len; i++) {
      let device_model = rows[i].private_room_device_modelV2;
      if (device_model == 0) {
        deviceModelArr.push("无");
      } else if (device_model == 1) {
        deviceModelArr.push("T1V");
      } else if (device_model == 2) {
        deviceModelArr.push("T1VS");
      } else if (device_model == 3) {
        deviceModelArr.push("T1VB");
      } else if (device_model == 4) {
        deviceModelArr.push("T1VBS");
      } else if (device_model == 5) {
        deviceModelArr.push("T2G");
      } else if (device_model == 6) {
        deviceModelArr.push("T2GB");
      } else if (device_model == 7) {
        deviceModelArr.push("T2GBS");
      } else if (device_model == 8) {
        deviceModelArr.push("T2V");
      } else if (device_model == 9) {
        deviceModelArr.push("T4V");
      } else if (device_model == 10) {
        deviceModelArr.push("T4VD");
      } else if (device_model == 11) {
        deviceModelArr.push("T4VB");
      } else if (device_model == 12) {
        deviceModelArr.push("T4VBD");
      }
    }
    console.log(JSON.stringify(deviceModelArr));
    viewModel.get("private_room_devices_model").setValue(deviceModelArr.join(","));
  });
viewModel.get("open_areaList") &&
  viewModel.get("open_areaList").on("afterCellValueChange", function (data) {
    // 开放区--单元格值改变后
    let rows = viewModel.getGridModel("open_areaList").getRows();
    let len = rows.length;
    let deviceModelArr = [];
    for (var i = 0; i < len; i++) {
      let device_model = rows[i].open_area_deviceV2;
      if (device_model == 0) {
        deviceModelArr.push("无");
      } else if (device_model == 1) {
        deviceModelArr.push("T1V");
      } else if (device_model == 2) {
        deviceModelArr.push("T1VS");
      } else if (device_model == 3) {
        deviceModelArr.push("T1VB");
      } else if (device_model == 4) {
        deviceModelArr.push("T1VBS");
      } else if (device_model == 5) {
        deviceModelArr.push("T2G");
      } else if (device_model == 6) {
        deviceModelArr.push("T2GB");
      } else if (device_model == 7) {
        deviceModelArr.push("T2GBS");
      } else if (device_model == 8) {
        deviceModelArr.push("T2V");
      } else if (device_model == 9) {
        deviceModelArr.push("T4V");
      } else if (device_model == 10) {
        deviceModelArr.push("T4VD");
      } else if (device_model == 11) {
        deviceModelArr.push("T4VB");
      } else if (device_model == 12) {
        deviceModelArr.push("T4VBD");
      }
    }
    console.log(JSON.stringify(deviceModelArr));
    viewModel.get("open_area_devices_model").setValue(deviceModelArr.join(","));
  });
viewModel.get("project_name_address_v4_name") &&
  viewModel.get("project_name_address_v4_name").on("beforeBrowse", function (data) {
    // 项目名称--参照弹窗打开前
  });
viewModel.on("beforeUnsubmit", function (args) {
  args.data.billnum = "9242e7a0";
});