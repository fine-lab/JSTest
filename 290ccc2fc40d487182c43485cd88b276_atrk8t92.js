let gridModel = viewModel.getGridModel();
viewModel.on("afterMount", () => {
  loadStyle();
});
gridModel.on("afterSetDataSource", () => {
  const rows = gridModel.getRows();
  const actions = gridModel.getCache("actions");
  const actionsStates = [];
  rows.forEach((data) => {
    const actionState = {};
    actions.forEach((action) => {
      actionState[action.cItemName] = { visible: data.hdstatus == 1 };
    });
    actionsStates.push(actionState);
  });
  gridModel.setActionsState(actionsStates);
  return false;
});
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
// 启动
viewModel.get("button23qc").on("click", (params) => {
  const grid = viewModel.getGridModel();
  const rowData = grid.getEditRowModel().getAllData();
  cb.rest.invokeFunction(
    "AT15C31CE017B00008.backend.updateData",
    {
      url: "AT15C31CE017B00008.AT15C31CE017B00008.pshd",
      object: {
        id: rowData.id,
        hdstatus: "2"
      },
      billNo: viewModel.getParams().billNo
    },
    function (err, res) {
      if (err) {
        cb.utils.alert(err, "error");
        return false;
      }
      if (res && res.data) {
        cb.utils.alert("启动成功", "success");
        viewModel.execute("refresh");
      }
    }
  );
});
function loadStyle(params) {
  var headobj = document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  style.innerText = `
    .nh-xl {position: relative; top: 4px;}`;
  headobj.appendChild(style);
}