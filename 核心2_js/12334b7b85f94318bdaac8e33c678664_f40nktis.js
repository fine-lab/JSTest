viewModel.on("beforeSave", function (data) {
  // 表格-预埋线发货申请单详情--设置数据源后
  debugger;
  let len = JSON.parse(data.data.data).pre_buriedwire_detailList.length;
  if (len > 0) {
    for (let i = 0; i < len; i++) {
      let device_model_num = JSON.parse(data.data.data).pre_buriedwire_detailList[i].device_model_v2;
      let device_model = JSON.parse(data.data.data).pre_buriedwire_detailList[i].device_model;
      let curtain_num = JSON.parse(data.data.data).pre_buriedwire_detailList[i].the_curtain_on_the_ground;
      let deviceNum = JSON.parse(data.data.data).pre_buriedwire_detailList[i].device_num_v2;
      if (!device_model_num) {
        cb.utils.alert("设备型号未填写");
        return false;
      }
      if (!deviceNum) {
        cb.utils.alert("设备台数未填写");
        return false;
      }
      if (deviceNum < 0) {
        cb.utils.alert("设备台数有误");
        return false;
      }
      if (device_model_num) {
        if (device_model_num == 9 && !curtain_num) {
          cb.utils.alert("设备型号为T4系列（T4V、T4VD、T4VB、T4VBD）时地面幕布不能为空");
          return false;
        } else if (device_model_num == 10 && !curtain_num) {
          cb.utils.alert("设备型号为T4系列（T4V、T4VD、T4VB、T4VBD）时地面幕布不能为空");
          return false;
        } else if (device_model_num == 11 && !curtain_num) {
          cb.utils.alert("设备型号为T4系列（T4V、T4VD、T4VB、T4VBD）时地面幕布不能为空");
          return false;
        } else if (device_model_num == 12 && !curtain_num) {
          cb.utils.alert("设备型号为T4系列（T4V、T4VD、T4VB、T4VBD）时地面幕布不能为空");
          return false;
        }
      }
      if (device_model) {
        if (device_model == "T4V" && !curtain_num) {
          cb.utils.alert("设备型号为T4系列（T4V、T4VD、T4VB、T4VBD）时地面幕布不能为空");
          return false;
        } else if (device_model == "T4VD" && !curtain_num) {
          cb.utils.alert("设备型号为T4系列（T4V、T4VD、T4VB、T4VBD）时地面幕布不能为空");
          return false;
        } else if (device_model == "T4VB" && !curtain_num) {
          cb.utils.alert("设备型号为T4系列（T4V、T4VD、T4VB、T4VBD）时地面幕布不能为空");
          return false;
        } else if (device_model == "T4VBD" && !curtain_num) {
          cb.utils.alert("设备型号为T4系列（T4V、T4VD、T4VB、T4VBD）时地面幕布不能为空");
          return false;
        }
      }
    }
  }
});
viewModel.on("afterLoadData", function (data) {
  debugger;
  let iRows = data.pre_buriedwire_detailList.length;
  //判断当前的行是否大于0
  if (iRows > 0) {
    let deviceListArr = new Array();
    //如果大于0则开始遍历
    for (let i = 0; i < iRows; i++) {
      if (data.pre_buriedwire_detailList[i] == null || data.pre_buriedwire_detailList[i].device_model_v2 == null) {
        continue;
      }
      let device_model_name = data.pre_buriedwire_detailList[i].device_model_v2;
      if (device_model_name == "无") {
        data.pre_buriedwire_detailList[i].device_model_v2 = 0;
      } else if (device_model_name == "T1V") {
        data.pre_buriedwire_detailList[i].device_model_v2 = 1;
      } else if (device_model_name == "T1VS") {
        data.pre_buriedwire_detailList[i].device_model_v2 = 2;
      } else if (device_model_name == "T1VB") {
        data.pre_buriedwire_detailList[i].device_model_v2 = 3;
      } else if (device_model_name == "T1VBS") {
        data.pre_buriedwire_detailList[i].device_model_v2 = 4;
      } else if (device_model_name == "T2G") {
        data.pre_buriedwire_detailList[i].device_model_v2 = 5;
      } else if (device_model_name == "T2GB") {
        data.pre_buriedwire_detailList[i].device_model_v2 = 6;
      } else if (device_model_name == "T2GBS") {
        data.pre_buriedwire_detailList[i].device_model_v2 = 7;
      } else if (device_model_name == "T2V") {
        data.pre_buriedwire_detailList[i].device_model_v2 = 8;
      } else if (device_model_name == "T4V") {
        data.pre_buriedwire_detailList[i].device_model_v2 = 9;
      } else if (device_model_name == "T4VD") {
        data.pre_buriedwire_detailList[i].device_model_v2 = 10;
      } else if (device_model_name == "T4VB") {
        data.pre_buriedwire_detailList[i].device_model_v2 = 11;
      } else if (device_model_name == "T4VBD") {
        data.pre_buriedwire_detailList[i].device_model_v2 = 12;
      }
      deviceListArr.push(data.pre_buriedwire_detailList[i]);
    }
    //重新设置数据源
    viewModel.get("pre_buriedwire_detailList").setDataSource(deviceListArr);
  }
});
viewModel.on("beforeUnsubmit", function (args) {
  args.data.billnum = "9f9131d6";
});
viewModel.on("workflowLoaded", (args) => {
  let bShowIt = viewModel.get("c_lckzcontrol").getState("bShowIt");
  let verifystate = viewModel.get("verifystate").getValue();
  if (verifystate == 1 && bShowIt == true) {
    viewModel.get("btnEdit").setVisible(false);
    viewModel.get("c_lckzcontrol").setVisible(false);
  }
  if (verifystate == 2) {
    viewModel.get("c_lckzcontrol").setVisible(false);
  }
});