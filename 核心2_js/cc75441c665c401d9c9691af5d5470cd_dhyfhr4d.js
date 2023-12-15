viewModel.on("customInit", function (data) {
  // 我的党费--页面初始化
  debugger;
  var viewModel = this;
  var user = cb.rest.AppContext.user;
});
viewModel.get("button21ob") &&
  viewModel.get("button21ob").on("click", function (data) {
    // 缴纳凭证--单击
    var currentRow = viewModel.getGridModel().getRow(data.index);
    console.log(currentRow);
    // 查看--单击
    viewModel.communication({
      //模态框类型-固定写死
      type: "modal",
      payload: {
        //扩展的组件名
        key: "yourkeyHere",
        data: {
          //把模型传递给组件内部，用于组件和MDF模型关联使用（比如组件内发布事件，把组件内的值传到MDF模型中）
          viewModel: viewModel,
          visible: true,
          //传递给组件内部的数据（组件内部通过 this.props.myParam获取）
          feeData: currentRow
        }
      }
    });
  });