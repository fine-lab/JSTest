viewModel.on("customInit", function (data) {
  // 采购订单--页面初始化
  let styleHTML = `
.customClass .label-control,.customClass input{
color: purple;
}
`;
  let styleDom = document.createElement("style");
  styleDom.innerHTML = styleHTML;
  document.head.appendChild(styleDom);
});