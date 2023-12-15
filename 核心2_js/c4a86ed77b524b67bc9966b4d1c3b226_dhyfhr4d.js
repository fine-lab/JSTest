viewModel.get("button20ke") &&
  viewModel.get("button20ke").on("click", function (data) {
    // 测试--单击
    //触发弹窗
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
          myParam: {
            title: "弹窗示例之扩展弹窗",
            billLink: "123"
          }
        }
      }
    });
  });