viewModel.get("pre_buriedwire_detailList").on("afterSetDataSource", function (data) {
  if (data && viewModel.getParams().mode == "add") {
    let b = viewModel.getCache("mark");
    if (!b) {
      //获取枚举
      let deviceEnum = JSON.parse(viewModel.getGridModel().getColumn("device_model_v2").cEnumString);
      //避免循环 将key和value对调
      for (var key in deviceEnum) {
        let value = deviceEnum[key];
        deviceEnum[value] = key;
        delete deviceEnum[key];
      }
      //遍历子表数据 修改枚举字段的值
      for (var prop in data) {
        data[prop]["device_model_v2"] = deviceEnum[data[prop]["device_model_v2"]];
        console.log(deviceEnum[data[prop]["device_model_v2"]]);
      }
      viewModel.setCache("mark", 1);
      viewModel.get("pre_buriedwire_detailList").setDataSource(data);
    } else {
      viewModel.clearCache("mark");
    }
  }
});
viewModel.get("pre_buriedwire_detailList") &&
  viewModel.get("pre_buriedwire_detailList").on("afterCellValueChange", function (data) {
    // 表格-预埋线发货申请单详情--单元格值改变后
    console.log("1111111");
    console.log(JSON.stringify(data));
    let rowData = viewModel.get("pre_buriedwire_detailList").getEditRowModel();
    if (rowData.get("device_model_v2") == "T4V" || rowData.device_model_v2 == "T4VD" || rowData.device_model_v2 == "T4VB" || rowData.device_model_v2 == "T4VBD") {
      console.log("aaaaa");
    }
    console.log(rowData.get("device_model_v2").getValue());
    console.log(rowData);
  });
viewModel.get("pre_buriedwire_detailList") &&
  viewModel.get("pre_buriedwire_detailList").getEditRowModel() &&
  viewModel.get("pre_buriedwire_detailList").getEditRowModel().get("device_model_v2") &&
  viewModel
    .get("pre_buriedwire_detailList")
    .getEditRowModel()
    .get("device_model_v2")
    .on("valueChange", function (data) {
      // 设备型号--值改变
      let deviceModelValue = viewModel.get("pre_buriedwire_detailList").getEditRowModel().get("device_model_v2");
      console.log(deviceModelValue);
    });
viewModel.on("customInit", function (data) {
});
//设置保存前校验
viewModel.on("beforeSave", function (args) {
  let bRes = false;
  let data = JSON.parse(args.data.data).pre_buriedwire_detailList;
  console.log(JSON.stringify(data));
  let arrDevice = new Array();
  for (var i = 0; i < data.length; i++) {
    if (data[i]._status != "Delete") {
      let device_model_num = data[i].device_model_v2;
      let deviceNum = data[i].device_num_v2;
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
      if (!device_model_num) {
        cb.utils.alert("预埋线发货申请单详情不能为空");
        return false;
      }
    }
  }
  arrDevice[0] = 9;
  arrDevice[1] = 10;
  arrDevice[2] = 11;
  arrDevice[3] = 12;
  for (let i = 0; i < data.length; i++) {
    console.log("start----" + i);
    console.log(data[i].device_model_v2);
    console.log(data[i].device_num_v2);
    console.log(data[i].the_curtain_on_the_ground);
    if (arrDevice.indexOf(data[i].device_model_v2) > -1) {
      if (data[i].the_curtain_on_the_ground == null || data[i].the_curtain_on_the_ground == undefined || data[i].the_curtain_on_the_ground == "") {
      } else {
        bRes = true;
      }
    }
    console.log("bRes----" + bRes);
    console.log("stop----" + i);
  }
  if (bRes) {
    alert("地面幕布不能为空");
    return;
  }
});
viewModel.on("beforeUnsubmit", function (args) {
  args.data.billnum = "9f9131d6";
});