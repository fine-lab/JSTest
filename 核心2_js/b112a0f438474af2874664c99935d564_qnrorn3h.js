//获取浏览器参数
function getParams(key) {
  let search = window.location.search.replace(/^\?/, "");
  let pairs = search.split("&");
  let paramsMap = pairs
    .map((pair) => {
      let [key, value] = pair.split("=");
      return [decodeURIComponent(key), decodeURIComponent(value)];
    })
    .reduce((res, [key, value]) => Object.assign(res, { [key]: value }), {});
  return paramsMap[key] || "";
}
//页面初始化，如果已有相同单据则进入浏览态
viewModel.on("customInit", function (args) {
  debugger;
  let code = getParams("code"); //获取参数，调用后端函数获取处理过后的字符串
  let mode = viewModel.getParams().mode;
  if (mode == "add") {
    cb.rest.invokeFunction("AT176B72000860000A.rule.getXMSQ", { code: code }, function (err, res) {
      if (res != undefined) {
        let data = {
          billtype: "Voucher", // 单据类型
          billno: "yb98e1c1b3MobileArchive", // 单据号
          domainKey: "yourKeyHere",
          params: {
            mode: "browse", // (卡片页面区分编辑态edit、新增态add、)
            id: res.res[0].id //TODO:填写详情id
          }
        };
        //打开一个单据，并在当前页面显示
        cb.loader.runCommandLine("bill", data, viewModel);
      }
    });
  }
});
//页面初始化后执行动作
viewModel.on("afterLoadData", function (data) {
  // 返回值详情--页面初始化
  debugger;
  let code = getParams("code"); //获取参数，调用后端函数获取处理过后的字符串
  if (code != undefined && code != "") {
    cb.rest.invokeFunction("AT176B72000860000A.rule.getXMSKXX", { code: code }, function (err, res) {
      viewModel.get("bianma").setValue(res.res[0].code);
      viewModel.get("shenqingren").setValue(res.res[0].shoukuanfuzeren);
      viewModel.get("shenqingrenshoujihao").setValue(res.res[0].shoukuanfuzerendianhua);
      viewModel.get("yujishoukuanriqi").setValue(res.res[0].shoukuanjihuariqi);
    });
  }
});