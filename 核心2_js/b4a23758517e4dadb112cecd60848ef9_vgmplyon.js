// 证照档案
var zzModel = viewModel.get("zzname_zzname");
zzModel.on("beforeBrowse", (data) => {
  var { zhuangtai } = viewModel.getAllData();
  let val = zhuangtai == 1 ? "2" : "1";
  //获取供应商使用范围
  var condition = {
    isExtend: true,
    simpleVOs: []
  };
  condition.simpleVOs.push({
    field: "zhuangtai", // 取自参照getRefData数据中字段key
    op: "eq",
    value1: val
  });
  zzModel.setFilter(condition);
});
viewModel.get("zhuangtai").on("afterValueChange", (data) => {
  let bNull = data.value.value == "1" ? true : false;
  viewModel.get("jieyongriqi").setState("bIsNull", !bNull);
  viewModel.get("yujiguihuanriqi").setState("bIsNull", !bNull);
  viewModel.get("guihuanriqi").setState("bIsNull", bNull);
});