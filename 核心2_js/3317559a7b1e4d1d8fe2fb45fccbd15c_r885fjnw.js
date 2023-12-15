var browse = ["btnAdd", "button18ya", "btnBatchDelete"]; //浏览
var addOrEdit = ["button27ob", "button36ha"]; //新增或者修改
var gridModel = viewModel.getGridModel();
gridModel._set_data("forbiddenDblClick", true); //双击禁止进入卡片页
//设置初始化状态按钮
viewModel.on("afterMount", function (data) {
  setIsDisplay("footer8gd", false);
  buttonIsDisplay(browse, true);
  buttonIsDisplay(addOrEdit, false);
});
//编辑按钮点击事件
viewModel.get("button18ya").on("click", function (data) {
  setIsDisplay("footer8gd", true);
  buttonIsDisplay(browse, false);
  buttonIsDisplay(addOrEdit, true);
  gridModel.setReadOnly(false); //设置gridModel可编辑
});
//取消按钮点击事件
viewModel.get("button9ca").on("click", function (data) {
  setIsDisplay("footer8gd", false);
  buttonIsDisplay(browse, true);
  buttonIsDisplay(addOrEdit, false);
  gridModel.setReadOnly(true); //设置gridModel可编辑
  viewModel.execute("refresh"); //刷新
});
//增行操作
viewModel.get("button27ob").on("click", function (data) {
  viewModel.getGridModel().appendRow({});
});
//删行操作
viewModel.get("button36ha").on("click", function (data) {
  viewModel.getGridModel().deleteRows(viewModel.getGridModel().getSelectedRowIndexes());
});
//保存操作
viewModel.get("button36ha").on("click", function (data) {
  cb.requireInner(["/iuap-yonbuilder-runtime/opencomponentsystem/public/AT181E596009F80008/Requests?domainKey=developplatform"], function (a) {
    const queryData = {
      //把viewModel对象传入封装得公共函数
      viewModel: viewModel,
      //请求地址
      url: "/bill/save",
      //请求类型
      method: "POST",
      //请求上送数据
      param: {
        billnum: "ybcbab938f",
        data: viewModel.getGridModel().getDirtyData()
      }
    };
    a.getServeData(queryData)
      .then((result) => {
        //数据请求成功
        setIsDisplay("footer8gd", false);
        buttonIsDisplay(browse, true);
        buttonIsDisplay(addOrEdit, false);
        gridModel.setReadOnly(true); //设置gridModel可编辑
        viewModel.execute("refresh"); //刷新
      })
      .catch((error) => {
        //数据请求失败
      });
  });
});
function setIsDisplay(cGroupCode, isShow) {
  viewModel.execute("updateViewMeta", { code: cGroupCode, visible: isShow });
}
function buttonIsDisplay(btnArr, isShow) {
  for (var btn in btnArr) {
    viewModel.get(btnArr[btn]).setVisible(isShow);
  }
}
viewModel.on("customInit", function (data) {
  // 左树右表测试_nishch--页面初始化
});