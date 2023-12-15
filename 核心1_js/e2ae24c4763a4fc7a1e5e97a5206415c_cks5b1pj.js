//组件挂载后
viewModel.on("afterMount", function (args) {
  try {
    console.log("0.获取组织信息以及账簿");
    let orgUrl = "AT17AF88F609C00004.common.getOrgFromInter";
    cb.rest.invokeFunction(orgUrl, {}, function (err, res) {
      if (res.res === undefined || res.res === null) return;
      console.log(orgUrl + "接口返回数据：" + JSON.stringify(res.res));
    });
  } catch (e) {
    throw new Error("执行页面初始化customInit报错：" + e);
  }
});