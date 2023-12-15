viewModel.on("customInit", function (data) {
  // 供应商申请--页面初始化
  let styleHTML = `
    .vendorCodeClass .label-control,.vendorCodeClass input{
      color: red;
    }
  `;
  let styleDom = document.createElement("style");
  styleDom.innerHTML = styleHTML;
  document.head.appendChild(styleDom);
});