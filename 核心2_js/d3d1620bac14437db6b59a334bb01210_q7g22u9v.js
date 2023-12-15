function initExt(event) {
  var viewModel = this;
  // 绑定颁发日期(新)组件的值改变后动作事件
  viewModel.get("newDateOfIssue").on("afterValueChange", function (event) {
    // 获取颁发日期(新)组件的值，该值为字符串类型
    let { value } = event;
    // 将颁发日期的值由字符串类型转化为日期类型
    let newDateOfIssue = new Date(value);
    // 获取有效期至(新)组件的值，该值为字符串类型
    let newDueDate = viewModel.get("newDueDate").getValue();
    // 判断有效期至(新)组件的值是否为空
    if (newDueDate !== null) {
      // 将有效期至(新)的值由字符串类型转化为日期类型
      let dueDate = new Date(newDueDate);
      // 判断颁发日期(新)是否大于有效期至(新)
      if (newDateOfIssue > dueDate) {
        // 弹窗提示：颁发日期(新)不得大于有效期至(新)
        cb.utils.alert("颁发日期(新)不得大于有效期至(新)");
        // 将颁发日期(新)组件的值设置为空
        viewModel.get("newDateOfIssue").setValue(null);
      }
    }
    // 获取当前的系统时间
    let systemDate = new Date();
    // 判断颁发日期(新)是否大于当前系统时间
    if (newDateOfIssue > systemDate) {
      // 弹窗提示：颁发日期(新)不得大于当前服务器日期
      cb.utils.alert("颁发日期(新)不得大于当前服务器日期");
      // 将颁发日期(新)组件的值设置为空
      viewModel.get("newDateOfIssue").setValue(null);
    }
  });
  // 绑定有效期至(新)组件的值改变后动作事件
  viewModel.get("newDueDate").on("afterValueChange", function (event) {
    // 获取有效期至(新)组件的值，该值为字符串类型
    let { value } = event;
    // 将有效期至(新)的值由字符串类型转化为日期类型
    let newDueDate = new Date(value);
    // 获取颁发日期(原)组件的值，该值为字符串类型
    let oldDateOfIssue = viewModel.get("oldDateOfIssue").getValue();
    // 判断颁发日期(原)组件的值是否为空
    if (oldDateOfIssue !== null) {
      // 将颁发日期(原)的值由字符串类型转化为日期类型
      let oldDateOfIssueDate = new Date(oldDateOfIssue);
      // 判断有效期至(新)是否小于颁发日期(原)
      if (newDueDate < oldDateOfIssueDate) {
        // 弹窗提示：有效期至(新)不得小于颁发日期(原)
        cb.utils.alert("有效期至(新)不得小于颁发日期(原)");
        // 将有效期至(新)组件的值设置为空
        viewModel.get("newDueDate").setValue(null);
      }
    }
    // 获取颁发日期(新)组件的值，该值为字符串类型
    let newDateOfIssue = viewModel.get("newDateOfIssue").getValue();
    // 判断颁发日期(新)组件的值是否为空
    if (newDateOfIssue !== null) {
      // 将颁发日期(新)的值由字符串类型转化为日期类型
      let newDateOfIssueDate = new Date(newDateOfIssue);
      // 判断有效期至(新)是否小于颁发日期(新)
      if (newDueDate < newDateOfIssueDate) {
        // 弹窗提示：有效期至(新)不得小于颁发日期(新)
        cb.utils.alert("有效期至(新)不得小于颁发日期(新)");
        // 将有效期至(新)组件的值设置为空
        viewModel.get("newDueDate").setValue(null);
      }
    }
  });
  viewModel.get("qualificationCode_typeCode_name").on("afterValueChange", function (event) {
    let { code } = event.obj.select;
    let respResult = cb.rest.invokeFunction("0d412b7b08ea4727b393316c503eebdf", { code: code }, null, viewModel, { async: false });
    let b = viewModel.GridModel();
    cb.utils.alert(respResult.result.a);
    let a = 123;
  });
}