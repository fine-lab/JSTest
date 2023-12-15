function initExt1(event) {
  var viewModel = this;
  viewModel.get("typeCode_code").on("beforeValueChange", function (event) {
    if (!event.value.isArray) {
      let respResult = cb.rest.invokeFunction("313df79e27cb4446a24adf26b0eb655c", { id: event.value.id }, null, viewModel, { async: false });
      if (respResult.result.result) {
        viewModel.get("effectiveControl").setValue(respResult.result.resp[0].validityManagement);
      }
    }
  });
  // 绑定颁发日期组件的值改变后动作事件
  viewModel.get("issueDate").on("afterValueChange", function (event) {
    // 获取颁发日期组件的值，该值为字符串类型
    let { value } = event;
    if (value === null) {
      return true;
    }
    // 将颁发日期的值由字符串类型转化为日期类型
    let issueDate = new Date(value);
    // 获取有效期至组件的值，该值为字符串类型
    let validUntil = viewModel.get("validUntil").getValue();
    // 判断有效期至组件的值是否为空
    if (validUntil !== null) {
      // 将有效期至的值由字符串类型转化为日期类型
      let validUntilDate = new Date(validUntil);
      // 判断颁发日期是否大于有效期至
      if (issueDate > validUntilDate) {
        // 弹窗提示：颁发日期不得大于有效期至
        cb.utils.alert("颁发日期不得大于有效期至");
        // 将颁发日期组件的值设置为空
        viewModel.get("issueDate").setValue(null);
      }
    }
    // 获取当前的系统时间
    let systemDate = new Date();
    // 判断颁发日期是否大于当前系统时间
    if (issueDate > systemDate) {
      // 弹窗提示：颁发日期不得大于当前服务器日期
      cb.utils.alert("颁发日期不得大于当前服务器日期");
      // 将颁发日期组件的值设置为空
      viewModel.get("issueDate").setValue(null);
    }
  });
  // 绑定有效期至组件的值改变后动作事件
  viewModel.get("validUntil").on("afterValueChange", function (event) {
    // 获取有效期至组件的值，该值为字符串类型
    let { value } = event;
    if (value === null) {
      return true;
    }
    // 将有效期至的值由字符串类型转化为日期类型
    let validUntil = new Date(value);
    // 获取颁发日期组件的值，该值为字符串类型
    let issueDate = viewModel.get("issueDate").getValue();
    // 判断颁发日期组件的值是否为空
    if (issueDate !== null) {
      // 将颁发日期的值由字符串类型转化为日期类型
      let issueDateDate = new Date(issueDate);
      // 判断有效期至是否小于颁发日期
      if (validUntil < issueDateDate) {
        // 弹窗提示：有效期至不得小于颁发日期
        cb.utils.alert("有效期至不得小于颁发日期");
        // 将有效期至组件的值设置为空
        viewModel.get("validUntil").setValue(null);
      }
    }
    // 获取生效日期组件的值，该值为字符串类型
    let effectiveDate = viewModel.get("effectiveDate").getValue;
    // 判断生效日期组件的值是否为空
    if (effectiveDate !== null) {
      // 将生效日期的值由字符串类型转化为日期类型
      let effectiveDateDate = new Date(effectiveDate);
      // 判断有效期至是否小于生效日期
      if (validUntil < effectiveDateDate) {
        // 弹窗提示：有效期至不得小于生效日期
        cb.utils.alert("有效期至不得小于生效日期");
        // 将有效期至组件的值设置为空
        viewModel.get("validUntil").setValue(null);
      }
    }
  });
  // 绑定生效日期组件的值改变后动作事件
  viewModel.get("effectiveDate").on("afterValueChange", function (event) {
    // 获取生效日期组件的值，该值为字符串类型
    let { value } = event;
    if (value === null) {
      return true;
    }
    // 将生效日期的值由字符串类型转化为日期类型
    let effectiveDate = new Date(value);
    // 获取有效期至组件的值，该值为字符串类型
    let validUntil = viewModel.get("validUntil").getValue();
    // 判断有效期至组件的值是否为空
    if (validUntil !== null) {
      // 将有效期至的值由字符串类型转化为日期类型
      let validUntilDate = new Date(validUntil);
      // 判断生效日期是否大于有效期至
      if (effectiveDate > validUntilDate) {
        // 弹窗提示：生效日期不得大于有效期至
        cb.utils.alert("生效日期不得大于有效期至");
        // 将生效日期组件的值设置为空
        viewModel.get("effectiveDate").setValue(null);
      }
    }
  });
}