var browse = ["btnBatchSubmit", "button19pb"];
var addOrEdit = ["btnBatchUnSubmit", "button16rg"];
var gridModel = viewModel.getGridModel();
gridModel._set_data("forbiddenDblClick", true);
//设置初始状态
viewModel.on("afterMount", function () {
  SetIsDisplay("footer8sc", false);
  btnIsDisplay(browse, true);
  btnIsDisplay(addOrEdit, false);
});
viewModel.get("btnBatchSubmit") &&
  viewModel.get("btnBatchSubmit").on("click", function (data) {
    // 编辑--单击
    SetIsDisplay("footer8sc", true);
    btnIsDisplay(browse, false);
    btnIsDisplay(addOrEdit, true);
    //设置可编辑
    gridModel.setReadOnly(false);
  });
viewModel.get("button10yf") &&
  viewModel.get("button10yf").on("click", function (data) {
    // 取消--单击
    SetIsDisplay("footer8sc", false);
    btnIsDisplay(browse, true);
    btnIsDisplay(addOrEdit, false);
    //设置只读
    gridModel.setReadOnly(true);
    //页面刷新
    viewModel.execute("refresh");
  });
viewModel.get("btnBatchUnSubmit") &&
  viewModel.get("btnBatchUnSubmit").on("click", function (data) {
    // 增行--单击
    viewModel.getGridModel().appendRow({});
  });
viewModel.get("button16rg") &&
  viewModel.get("button16rg").on("click", function (data) {
    // 删行--单击
    //获取当前表格的选中状态
    var ids = viewModel.getGridModel().getSelectedRowIndexes();
    console.log(ids);
    viewModel.getGridModel().deleteRows(ids);
  });
function SetIsDisplay(cGroupCode, isShow) {
  viewModel.execute("updateViewMeta", { code: cGroupCode, visible: isShow });
}
function btnIsDisplay(btnArry, isShow) {
  console.log(btnArry);
  for (var btn in btnArry) {
    viewModel.get(btnArry[btn]).setVisible(isShow);
  }
}
viewModel.get("button15nd") &&
  viewModel.get("button15nd").on("click", function (data) {
    // 保存--单击
    cb.requireInner(["/opencomponentsystem/public/GT15804AT96/getQueryData"], function (a) {
      const queryData = {
        //把viewModel对象传入封装得公共函数
        viewModel: viewModel,
        //请求地址
        url: "/XXX/XXX",
        //请求类型
        method: "POST",
        //请求上送数据
        param: {
          字段名: "XXXX"
        }
      };
      a.getDataInit(queryData)
        .then((result) => {
          //数据请求成功
        })
        .catch((error) => {
          //数据请求失败
        });
    });
  });