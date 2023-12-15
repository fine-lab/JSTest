viewModel.on("afterLoadMeta", (args) => {
  const { vm, view } = args;
  cb.cache.set("popView", vm);
});
viewModel.get("plural_refer_staffsList") &&
  viewModel.get("plural_refer_staffsList").on("beforeBrowse", function (data) {
    // 可颁发人员--参照弹窗打开前
    debugger;
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    let viewModel = cb.cache.get("popView");
    condition.simpleVOs.push({
      field: "mainJobList.dept_id", // 取自参照getRefData数据中字段key
      op: "eq",
      value1: viewModel.getParams().applicable_dept
    });
    viewModel.get("plural_refer_staffsList").setFilter(condition);
  });
viewModel.get("button4ve") &&
  viewModel.get("button4ve").on("click", function (data) {
    // 保存--单击
    let viewModel = cb.cache.get("popView");
    let lural_refer_staffsList = viewModel.getAllData();
    let medals = viewModel.getParams().medals;
    let ct = new Date();
    ct.getFullYear();
    let nyear = ct.getFullYear() + "";
    let nmonth = ct.getMonth() + 1 + "";
    if (!lural_refer_staffsList || !lural_refer_staffsList.plural_refer_staffsList || lural_refer_staffsList.plural_refer_staffsList.length <= 0) {
      cb.utils.alert("请选择人员！");
      return;
    }
    let list = lural_refer_staffsList.plural_refer_staffsList;
    let staffList = [];
    for (let i = 0; i < list.length; i++) {
      let itemObj = list[i];
      let staff = {};
      staff["id"] = itemObj.staffs;
      staff["name"] = itemObj.plural_refer_staffsList;
      staffList.push(staff);
    }
    let awardParams = {};
    awardParams["medals"] = medals;
    awardParams["staffList"] = staffList;
    awardParams["nyear"] = nyear;
    awardParams["nmonth"] = nmonth;
    cb.rest.invokeFunction("AT165369EC09000003.apifunc.AwardProcess", { awardParams }, function (err, res) {
      debugger;
      let result = res.result;
      if (result == "0") {
        cb.utils.alert("颁发成功！");
        return;
      } else {
        cb.utils.alert(res.message);
        return;
      }
    });
  });
viewModel.get("staff_id") &&
  viewModel.get("staff_id").on("beforeBrowse", function (data) {
    // 单选人员--参照弹窗打开前
  });