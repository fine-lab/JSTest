viewModel.get("date") &&
  viewModel.get("date").on("beforeValueChange", function (data) {
    let date = yyMMdd();
    return data.value != null ? isBeforeDate(date, data.value) : true;
    //体检日期校验
  });
// 预约日期--值改变前
//比较日期
const isBeforeDate = (dateA, dateB) => dateA < dateB;
//获取当前的年月日
const yyMMdd = () => {
  let date = new Date(); //获取当前日期
  let year = date.getFullYear(); //获取当前年
  let month = date.getMonth() + 1; //获取当前月
  month = month.toString().length == 1 ? "0" + month : month; //补0
  let strDate = date.getDate(); //获取当前日
  strDate = strDate.toString().length == 1 ? "0" + strDate : strDate; //补0
  return year + "-" + month + "-" + strDate;
};
viewModel.get("pay_examination_kitList") &&
  viewModel.get("pay_examination_kitList").on("afterValueChange", function (data) {
    // 体检套餐--值改变后
    //如果套餐字段还有数据则调用接口获取项目后渲染页面
    var gridModel = viewModel.get("pre_projectList");
    //清楚子表是否套餐为是的行，后续再进行新增
    clearKitRow();
    if (data != null && data != undefined && data.value.length > 0) {
      let result = cb.rest.invokeFunction(
        "AT17E6E98209580009.test001.getProjectById",
        { data: data.value },
        function (err, res) {
          if (err != undefined || err != null) {
            cb.utils.alert("获取套餐异常");
            return false;
          }
        },
        viewModel,
        { async: false }
      );
      result.result.res.forEach((project) => {
        project.is_kit = "Y";
        gridModel.appendRow(project); //插入行
      });
    }
    //清楚所有套餐行
  });
const clearKitRow = () => {
  let gridModel = viewModel.get("pre_projectList");
  let rows = gridModel.getRows(); //获取表格所有的行
  let deleteRowIndexes = [];
  rows.forEach((row, index) => {
    if (row.is_kit == "Y") {
      deleteRowIndexes.push(index);
    }
  });
  gridModel.deleteRows(deleteRowIndexes);
};
viewModel.get("examination_kit_name") &&
  viewModel.get("examination_kit_name").on("beforeValueChange", function (data) {
    // 体检套餐--值改变前
  });
viewModel.get("btnAddRowpre_project") &&
  viewModel.get("btnAddRowpre_project").on("click", function (params) {
    // 增行--单击
    let data = {
      billtype: "VoucherList", // 单据类型
      billno: "ybe68bc4dc" // 单据号
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", data, viewModel);
  });
viewModel.get("custCategory_name") &&
  viewModel.get("custCategory_name").on("beforeValueChange", function (data) {
    // 客户分类--值改变前
  });
viewModel.get("btnBatchDeleteRowpre_project") &&
  viewModel.get("btnBatchDeleteRowpre_project").on("click", function (data) {
    // 删行--单击
    var belongKitId = [];
    var belongKitMap = [];
    var gridModel = viewModel.get("pre_projectList");
    var selectedRowIndexes = gridModel.getSelectedRowIndexes(); //获取选中的行号
    if (selectedRowIndexes.length > 0) {
      //获取删除行所属套餐
      selectedRowIndexes.forEach((row) => {
        let currentRow = gridModel.getRow(row); //获取指定行数据
        if (currentRow.examination_kit != undefined && currentRow.examination_kit != null && currentRow.is_kit == "Y") {
          belongKitId.push(currentRow.examination_kit);
          belongKitMap[currentRow.examination_kit] = currentRow.is_kit;
        }
      });
    } else {
      cb.utils.alert("请选择数据");
      return false;
    }
    cb.utils.confirm("删除后不满足套餐的情况体检项将按照原价计算", function () {
      //先删除选中行
      gridModel.deleteRows(selectedRowIndexes);
      //获取表格信息，根据当前删除行的所属套餐改变是否套餐为否;
      gridModel.getRows().forEach((row, rowIndex) => {
        if (belongKitMap.hasOwnProperty(row.examination_kit)) {
          gridModel.setCellValue(rowIndex, "is_kit", "N", true);
        }
      });
      //删除主表字段中的套餐,
      var kits = viewModel.get("pay_examination_kitList").getValue();
      var newKit = [];
      kits.forEach((kit, index) => {
        if (!(belongKitMap.hasOwnProperty(kit.examination_kit) && belongKitMap[kit.examination_kit] == "Y")) {
          newKit.push(kit);
        }
      });
      viewModel.get("pay_examination_kitList").clear();
      if (newKit.length > 0) {
        //重新赋值
        viewModel.get("pay_examination_kitList").setData(newKit);
      }
    });
  });