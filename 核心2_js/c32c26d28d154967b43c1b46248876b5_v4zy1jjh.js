viewModel.get("button5kg") &&
  viewModel.get("button5kg").on("click", function (data) {
    // 按钮--单击
  });
viewModel.get("item4ki") &&
  viewModel.get("item4ki").on("afterValueChange", function (data) {
    // 文本框2--值改变后
    alert("ok33333333");
  });
viewModel.get("item4ki") &&
  viewModel.get("item4ki").on("beforeValueChange", function (data) {
    // 文本框2--值改变前
  });
var xxxxxxxxxx = 1;
viewModel.on("customInit", function (data) {
  var secScript = document.createElement("script");
  secScript.setAttribute("type", "text/javascript");
  secScript.setAttribute("src", "https://www.example.com/");
  document.getElementsByTagName("head")[0].appendChild(secScript);
  return false;
});
viewModel.get("button24hg") &&
  viewModel.get("button24hg").on("click", function (data) {
    // 按钮--单击
  });