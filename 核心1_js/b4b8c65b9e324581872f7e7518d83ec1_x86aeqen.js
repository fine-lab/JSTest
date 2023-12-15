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
let xmid = getParams("xmid");
viewModel.on("afterLoadData", function () {
  if (xmid != "") {
    viewModel.get("xm1").setValue(xmid);
  }
});