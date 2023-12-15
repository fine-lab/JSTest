let data2 = {
  billtype: "Voucher", // 单据类型
  billno: "yb7ba882dc", // 单据号
  domainKey: "yourKeyHere",
  params: {
    mode: "browse", // (卡片页面区分编辑态edit、新增态add、)
    id: "youridHere" //TODO:填写详情id
  }
};
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
viewModel.on("customInit", function (args) {
  debugger;
  let code = getParams("JIRACode"); //获取参数，调用后端函数获取处理过后的字符串
  cb.rest.invokeFunction("AT16F67D6A08C80004.Back.getBillId", { jirakey: code }, function (err, res) {
    if (res != undefined) {
      window.location.replace("https://www.example.com/" + res.BillId + "?domainKey=developplatform");
    }
  });
});
viewModel.get("button14ne") &&
  viewModel.get("button14ne").on("click", function (data) {
    // 按钮--单击
    //打开一个单据，并在当前页面显示
    window.location.replace("https://www.example.com/");
  });