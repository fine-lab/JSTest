viewModel.on("afterInit", (args) => {
  cb.rest.invokeFunction("AT165369EC09000003.apifunc.PPUserGetStaff", {}, function (err, res) {
    if (err) {
      cb.utils.alert("查询人员信息错误!");
    }
    if (res) {
      cb.cache.set("StaffId", res.userMsg.staffId);
    }
  });
});
viewModel.on("beforeSearch", function (data) {
  // 个人积分--页面初始化
  let staffId = cb.cache.get("StaffId");
  data.isExtend = true;
  commonVOs = data.params.condition.commonVOs;
  commonVOs.push({
    itemName: "renyuan",
    op: "eq",
    value1: staffId
  });
});