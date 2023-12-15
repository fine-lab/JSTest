// 预置自定义样式
const initStyle = () => {
  var head = document.querySelector("head");
  var _style = document.createElement("style");
  _style.innerText = `.cus-tag { text-align: center; color: #fff; border-radius: 4px; position: relative;top: 4px;}
    .confirm-tag { background: #c89b40;} 
    .unconfirm-tag { background: #e23;}`;
  head.appendChild(_style);
};
initStyle();
console.log(111);
let gridModel = viewModel.getGridModel();
// 设置表格xx列的单元格渲染内容
gridModel.setColumnState("yesno", "formatter", (rowInfo, rowData) => {
  if (!rowData.yesno) return;
  let cls = rowData.yesno.text == "否" ? `cus-tag confirm-tag` : `cus-tag unconfirm-tag`;
  if (rowData.yesno) {
    // 显示带背景色的枚举标签
    return {
      override: true,
      html: `<div class="${cls}">` + rowData.yesno.text + `</div>`
    };
  }
});