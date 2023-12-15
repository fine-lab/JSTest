viewModel.on("customInit", function (data) {
  // 部门权限列表--页面初始化
  import { Button, InputItem, Modal } from "@mdf/baseui-mobile";
  viewModel.get("button23zg").on("click", function () {
    Modal.prompt(
      "改零售价",
      null,
      [
        {
          text: "取消",
          onPress: () => {
            this.props.handleCancel();
          }
        },
        { text: "保存", onPress: (value) => this.onBlur(value, "fQuotePrice") }
      ],
      "default",
      nextProps.quote.value
    );
  });
});