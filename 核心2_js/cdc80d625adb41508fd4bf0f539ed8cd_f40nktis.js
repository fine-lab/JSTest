//项目选择参照---只看到负责人为自己的项目
viewModel.on("afterLoadData", function (data) {
  if (viewModel.getParams().mode == "add") {
    let result = cb.rest.invokeFunction("GT8429AT6.rule.getMobileInH5", {}, function (err, res) {}, viewModel, { async: false });
    let mobile = result.result.nameObj[0].mobile;
    viewModel.get("contact").setValue(mobile);
  }
});
viewModel.on("beforeSave", function () {
  const data = viewModel.getAllData();
  console.log(JSON.stringify(data));
  debugger;
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
viewModel.get("project_name_address_v4_name").on("afterBrowse", function () {
  const vm = this.getCache("vm");
  vm.getTreeModel().setCache("lazyLoad", false);
  vm.getTreeModel().setCache("lazyLoadTreeByPagination", false);
});
viewModel.on("beforeUnsubmit", function (args) {
  debugger;
  args.data.billnum = "9242e7a0";
});
//删除按钮
viewModel.get("dctl1700620589090_1").on("click", (args) => {
  let params = {
    cCommand: "cmdDelete",
    cAction: "delete",
    cSvcUrl: "/bill/delete",
    cHttpMethod: "POST",
    authOperate: false,
    fieldName: "btnDelete",
    fieldRuntimeState: false,
    cItemName: "btnDelete",
    cCaption: "dctl1700620589090_1",
    cShowCaption: "dctl1700620589090_1",
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