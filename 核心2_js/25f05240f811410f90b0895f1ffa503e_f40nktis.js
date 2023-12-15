viewModel.on("beforeSave", function (args) {
  debugger;
  let sublist = JSON.parse(args.data.data).construction_drawing_detailList;
  if (!sublist) {
    cb.utils.alert("施工图图纸详情不能为空");
    return false;
  } else {
    let sublist_len = JSON.parse(args.data.data).construction_drawing_detailList.length;
    if (sublist_len > 0) {
      for (var i = 0; i < sublist_len; i++) {
        let deviceModel = sublist[i].device_model_v2;
        let deviceNum = sublist[i].device_num_int;
        if (!deviceModel) {
          cb.utils.alert("设备型号未填写");
          return false;
        }
        if (!deviceNum) {
          cb.utils.alert("设备数量未填写");
          return false;
        }
        if (deviceNum < 0) {
          cb.utils.alert("设备数量有误");
          return false;
        }
      }
    }
  }
});
viewModel.on("afterLoadData", function () {
  // 用于卡片页面，页面初始化赋值等操作
  cb.rest.invokeFunction("GT8429AT6.CommonFunction.getEmployee", {}, function (err, res) {
    if (res.deptObj != null && res.deptObj != undefined && res.deptObj.length > 0) {
      console.log(JSON.stringify(res));
      let deptid = res.deptObj[0].mainJobList_dept_id;
      let deptname = res.deptObj[0].mainJobList_dept_id_name;
      viewModel.get("apply_department").setValue(deptname);
    }
  });
});
viewModel.on("beforeUnsubmit", function (args) {
  args.data.billnum = "b06f316a";
});
//删除按钮
viewModel.get("dctl1700619946974_3").on("click", (args) => {
  let params = {
    cCommand: "cmdDelete",
    cAction: "delete",
    cSvcUrl: "/bill/delete",
    cHttpMethod: "POST",
    authOperate: false,
    fieldName: "btnDelete",
    fieldRuntimeState: false,
    cItemName: "btnDelete",
    cCaption: "dctl1700619946974_3",
    cShowCaption: "dctl1700619946974_3",
    bEnum: false,
    cControlType: "button",
    iStyle: 0,
    bVmExclude: 0,
    iOrder: 15,
    uncopyable: false,
    bEnableFormat: false,
    key: "yourkeyHere",
    cExtProps: '{"ytenant_id":"f40nktis","pubts":"1700474360000","uiObject":"controls"}',
    ytenant_id: "youridHere",
    pubts: "1700474360000",
    uiObject: "controls",
    domainKey: "yourKeyHere",
    needClear: false,
    params: {}
  };
  viewModel.biz.do("delete", viewModel, params);
});