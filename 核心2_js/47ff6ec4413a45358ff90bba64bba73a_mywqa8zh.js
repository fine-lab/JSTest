function setIsDisplay(Code, isShow) {
  viewModel.execute("updateViewMeta", { code: Code, visible: isShow });
}
function setBtnIsDisplay(codeArray, isShow) {
  for (var codeItem in codeArray) {
    viewModel.get(codeArray[codeItem]).setVisible(isShow);
  }
}
let browseTtnArr = ["btnAdd", "button18lb", "btnBatchDelete"];
let addBtnArr = ["button29rj", "button40uf"];
// 表格模型
let gridModel = viewModel.getGridModel();
// 生命周期函数，页面挂载之后
viewModel.on("afterMount", function (args) {
  setIsDisplay("footer8zj", false);
  setBtnIsDisplay(addBtnArr, false);
});
// 单击编辑按钮
viewModel.get("button18lb") &&
  viewModel.get("button18lb").on("click", function (data) {
    // 显示底部 取消 保存容器
    setIsDisplay("footer8zj", true);
    // 隐藏 新增、编辑、删除钮栏; 显示增行，删行
    setBtnIsDisplay(browseTtnArr, false);
    setBtnIsDisplay(addBtnArr, true);
    // 将表格设置为可编辑状态
    gridModel.setReadOnly(false);
  });
// 取消--单击
viewModel.get("button9ke") &&
  viewModel.get("button9ke").on("click", function (data) {
    // 隐藏底部 取消 保存容器
    setIsDisplay("footer8zj", false);
    // 隐藏增行，删行; 钮栏 显示新增、编辑、删除
    setBtnIsDisplay(browseTtnArr, true);
    setBtnIsDisplay(addBtnArr, false);
    // 将表格设置为只读状态
    gridModel.setReadOnly(true);
    // 刷新页面
    viewModel.execute("refresh");
  });
// 增行 --单击
viewModel.get("button29rj") &&
  viewModel.get("button29rj").on("click", function (data) {
    // 增加表格行  参数为行对象，可以为空
    gridModel.appendRow({});
  });
// 删行--单击
viewModel.get("button40uf") &&
  viewModel.get("button40uf").on("click", function (data) {
    // 获取表格选中的行
    let indexArr = gridModel.getSelectedRowIndexes();
    // 删除表格行 参数为行数组，可以批量删除
    gridModel.deleteRows(indexArr);
  });
// 保存--单击
viewModel.get("button13qb") &&
  viewModel.get("button13qb").on("click", function (data) {
    console.log(gridModel.getDirtyData());
    if (gridModel.getDirtyData() == undefined) {
      return;
    }
    // 调用保存数据的函数
    cb.requireInner(["/iuap-yonbuilder-runtime/opencomponentsystem/public/AT164B201408C00003/requestTestAPI?domainKey=developplatform"], function (a) {
      const queryData = {
        //把viewModel对象传入封装得公共函数
        viewModel: viewModel,
        //请求地址
        url: "/bill/save",
        //请求类型
        method: "POST",
        //请求上送数据
        param: {
          billnum: "b59ef921", // 通过浏览器地址可以获得，笔记中 6.8有截图
          data: gridModel.getDirtyData() // viewModel.getDirtyData()获取修改或新增的数据
        }
      };
      a.getServeData(queryData)
        .then((result) => {
          //数据请求成功
          // 隐藏底部 取消 保存容器
          setIsDisplay("footer8zj", false);
          // 隐藏增行，删行; 钮栏 显示新增、编辑、删除
          setBtnIsDisplay(browseTtnArr, true);
          setBtnIsDisplay(addBtnArr, false);
          // 将表格设置为只读状态
          gridModel.setReadOnly(true);
          // 刷新页面
          viewModel.execute("refresh");
        })
        .catch((error) => {
          //数据请求失败
        });
    });
  });