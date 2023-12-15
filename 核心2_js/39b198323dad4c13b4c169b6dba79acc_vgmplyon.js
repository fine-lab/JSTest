viewModel.on("afterMount", () => {
  loadStyle1();
});
//加载自定义样式 (无异步、css不生效问题，效果好)
function loadStyle1(params) {
  var headobj = document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  style.innerText = `
  .listHeadRow{
    display:none;
  }
  `;
  headobj.appendChild(style);
}