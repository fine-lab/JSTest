viewModel.get("button56ri") &&
  viewModel.get("button56ri").on("click", function (data) {
    var currentRow = viewModel.getGridModel().getRow(data.index);
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