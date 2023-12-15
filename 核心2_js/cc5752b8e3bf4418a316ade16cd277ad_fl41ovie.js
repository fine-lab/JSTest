viewModel.get("button27nc") &&
  viewModel.get("button27nc").on("click", function (data) {
    //合同维护--单击
    viewModel.biz.do("edit", viewModel);
    //设置页面为编辑态
    viewModel.get("hetongmingchen").setDisabled(true);
    //设置字段合同名称不可修改
    viewModel.getParams().editMode = "custEdit";
  });
viewModel.on("afterLoadMeta", (args) => {
  let meta = args.view.view.containers[1].containers[0].controls;
  let billFields = [];
  meta.map((item) => {
    billFields.push(item.cItemName);
  });
  console.log("模板====", billFields);
  viewModel.setCache("billFields", billFields);
});
viewModel.on("modeChange", (mode) => {
  let editMode = viewModel.getParams().editMode;
  let billFields = viewModel.getCache("billFields");
  console.log("bianji====", editMode);
  if (editMode == "custEdit") {
    billFields &&
      billFields.map((field) => {
        console.log("禁用", field);
        if (viewModel.get(field) && viewModel.get(field).setDisabled && field != "hetongzhuangtai") viewModel.get(field).setDisabled(true);
      });
    billFields &&
      billFields.map((field) => {
        console.log("禁用", field);
        if (viewModel.get(field) && viewModel.get(field).setDisabled && field != "charuziduan34") viewModel.get(field).setDisabled(true);
      });
    viewModel.get("hetongzhuangtai").setDisabled(false);
    viewModel.get("charuziduan34").setDisabled(false);
  }
});
viewModel.on("afterMasterOrgChange", () => {
  viewModel.get("hetongzhuangtai").setDisabled(true);
});
//合同状态
viewModel.on("afterMasterOrgChange", () => {
  viewModel.get("charuziduan34").setDisabled(true);
});
//合同状态说明