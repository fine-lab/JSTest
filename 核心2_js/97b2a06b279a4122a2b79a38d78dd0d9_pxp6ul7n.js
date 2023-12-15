viewModel.on("customInit", function (data) {
  // 云表单详情--页面初始化
  let styleHTML = `
    .layout-border .gridLayout > div:nth-child(odd){
      border: solid 1px;
    }
  `;
  let styleDom = document.createElement("style");
  styleDom.innerHTML = styleHTML;
  document.head.appendChild(styleDom);
});