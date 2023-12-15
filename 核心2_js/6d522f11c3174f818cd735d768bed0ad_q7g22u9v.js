function initExt(event) {
  var viewModel = this;
  // 绑定颁发日期组件的值改变后动作事件
  viewModel.get("issueDate").on("afterValueChange", function (event) {
    // 获取颁发日期组件的值，该值为字符串类型
    let { value } = event;
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
  });
  //子表生产/经营类别、剂型、物料基本分类、物料，四选一
  viewModel.getGridModel().on("afterCellValueChange", function (event) {
    const gridModel = viewModel.getGridModel();
    //获取列表所有数据
    let rows = gridModel.getRows();
    if (!rows || rows.length <= 0) {
      return;
    }
    var readOnlyFields = [];
    let len = rows.length;
    const cellStates = [];
    for (let i = 0; i < len; i++) {
      var pmcName = rows[i].productionManageCategory_name;
      var msName = rows[i].materielSort_name;
      var mcCode = rows[i].materielCode_code;
      var dNname = rows[i].dosage_name;
      if (
        (typeof pmcName == "undefined" || pmcName === null) &&
        (typeof msName == "undefined" || msName === null) &&
        (typeof mcCode == "undefined" || mcCode === null || mcCode === "") &&
        (typeof dNname == "undefined" || dNname === null)
      ) {
        gridModel.setCellState(i, "productionManageCategory_name", "readOnly", false);
        gridModel.setCellState(i, "materielSort_name", "readOnly", false);
        gridModel.setCellState(i, "materielCode_code", "readOnly", false);
        gridModel.setCellState(i, "dosage_name", "readOnly", false);
        return;
      } else {
        if ((typeof msName == "undefined" || msName === null) && (typeof mcCode == "undefined" || mcCode === null || mcCode === "") && (typeof dNname == "undefined" || dNname === null)) {
          readOnlyFields = ["materielSort_name", "materielCode_code", "dosage_name"];
        } else if ((typeof pmcName == "undefined" || pmcName === null) && (typeof mcCode == "undefined" || mcCode === null || mcCode === "") && (typeof dNname == "undefined" || dNname === null)) {
          readOnlyFields = ["productionManageCategory_name", "materielCode_code", "dosage_name"];
        } else if ((typeof pmcName == "undefined" || pmcName === null) && (typeof msName == "undefined" || msName === null) && (typeof dNname == "undefined" || dNname === null)) {
          readOnlyFields = ["productionManageCategory_name", "materielSort_name", "dosage_name"];
        } else if ((typeof pmcName == "undefined" || pmcName === null) && (typeof msName == "undefined" || msName === null) && (typeof mcCode == "undefined" || mcCode === null || mcCode === "")) {
          readOnlyFields = ["productionManageCategory_name", "materielSort_name", "materielCode_code"];
        }
        for (let field of readOnlyFields) {
          cellStates.push({ rowIndex: i, cellName: field, propertyName: "readOnly", value: true });
        }
        gridModel.setCellStates(cellStates);
      }
    }
  });
}