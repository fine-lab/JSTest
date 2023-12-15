let gridModel = viewModel.getGridModel();
viewModel.on("afterMount", () => {
  loadStyle();
});
function loadStyle(params) {
  var headobj = document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  style.innerText = `
  .nh-xl {position: relative; top: 4px;}`;
  headobj.appendChild(style);
}
const map = {
  1: "新闻出版司法艺术",
  2: "农业系列",
  3: "工程系列",
  4: "经济系列",
  5: "会计系列",
  6: "统计系列",
  7: "教育系列",
  8: "卫生系列"
};
gridModel.setColumnState("shbaoxulie_zcxulie", "formatter", (rowInfo, rowData) => {
  return {
    override: true,
    html: `<span class="nh-xl" title=${map[rowData.shbaoxulie_zcxulie]}>${map[rowData.shbaoxulie_zcxulie]}</span>`
  };
});
// 查看
viewModel.get("button0kg").on("click", (params) => {
  jumpPage();
});
// 结果确定
viewModel.get("button2nj").on("click", (params) => {
  jumpPage();
});
//查询过滤，过滤掉已经复核的
viewModel.on("beforeSearch", function (args) {
  args.isExtend = true;
  commonVOs = args.params.condition.commonVOs;
  commonVOs.push({
    itemName: "hdstatus",
    op: "eq",
    value1: 2
  });
});
function jumpPage() {
  let data = {
    billtype: "VoucherList", // 单据类型
    billno: "psmxcprylistList", // 单据号
    params: {
      readOnly: true, // 预览时，一定为true，否则不加载详情数据
      mode: "browse" // 须传mode + 单据id + readOnly:false
    }
  };
  cb.loader.runCommandLine("bill", data, viewModel);
}