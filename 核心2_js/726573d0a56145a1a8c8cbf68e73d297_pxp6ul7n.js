viewModel.on("customInit", function (data) {
  // 云表单详情--页面初始化
  let styleHTML = `
    .gridlayout-border .gridLayout > div:nth-child(odd){
      border-top: 1px solid;
      border-left: 1px solid;
      border-right: 1px solid;
    }
    .gridlayout-border .gridLayout > div:nth-child(even){
      border-top: 1px solid;
      border-right: 1px solid;
    }
    .gridlayout-border .gridLayout{
      border-bottom: 1px solid
    }
  `;
  let styleDom = document.createElement("style");
  styleDom.innerHTML = styleHTML;
  document.head.appendChild(styleDom);
});