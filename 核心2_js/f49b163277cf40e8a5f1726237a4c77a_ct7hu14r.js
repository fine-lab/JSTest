viewModel.get("button12nb") &&
  viewModel.get("button12nb").on("click", function (data) {
    // 查看盘点结果--单击
    console.log("[查看盘点结果独立按钮]");
    var gridModel1 = viewModel.get("dxq_checkstock_1550886731822661638");
    //获取选中行的行号
    var line = gridModel1.getFocusedRowIndex();
    //获取选中行数据信息
    var checkTaskInfo = gridModel1.getRow(line);
    //传递给被打开页面的数据信息
    let data1 = {
      billtype: "VoucherList", // 单据类型
      billno: "7c81e7f8", // 单据号  盘点结果列表
      params: {
        //传参
        checkTaskInfo: checkTaskInfo
      }
    };
    console.log("[modal]" + JSON.stringify(data1));
    console.log("getcheckTaskinfo");
    console.log(checkTaskInfo);
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", data1, viewModel);
  });
viewModel.on("customInit", function (data) {
  // 盘点单列表--页面初始化
  console.log("[盘点单列表]");
  var addBtn = viewModel.get("button5tc");
  viewModel.on("afterMount", function () {
    // 获取查询区模型
    const filtervm = viewModel.getCache("FilterViewModel");
    //查询区模型DOM初始化后
    filtervm.on("afterInit", function () {
      const warehouseIdForm = filtervm.get("warehouseId").getFromModel();
      const orgIdForm = filtervm.get("org_id").getFromModel();
      // 方案一
      warehouseIdForm.setState("bCanModify", false);
      warehouseIdForm.setDisabled(true);
      orgIdForm.on("afterInitVm", function (argument) {
        orgIdForm.on("afterValueChange", function (data) {
          if (data.value === null || data.value === undefined) {
            warehouseIdForm.setState("bCanModify", false);
            warehouseIdForm.setDisabled(true);
          } else {
            warehouseIdForm.setState("bCanModify", true);
            warehouseIdForm.setDisabled(false);
          }
          warehouseIdForm.setValue("");
        });
      });
    });
    var shenheBtnModel = viewModel.get("button19sh");
    var fupanBtnModel = viewModel.get("button26oh");
    var gridModel1 = viewModel.get("dxq_checkstock_2598454567473408");
    gridModel1.setShowCheckbox(false); //主表去掉checkbox
    gridModel1._set_data("forbiddenDblClick", true); //主表去掉双击事件
    document.getElementsByClassName("button5tc")[0].style.backgroundColor = "red"; //设置新增按钮背景颜色和字体颜色
    document.getElementsByClassName("button5tc")[0].style.color = "white";
    var gridModel2 = viewModel.get("dxq_checkstockAreaList");
    //根据单据状态判断部分操作按钮是否显示
    gridModel1.on("afterSetDataSource", () => {
      //获取列表所有数据
      const rows = gridModel1.getRows();
      //从缓存区获取按钮
      const actions = gridModel1.getCache("actions");
      if (!actions) return;
      const actionsStates = [];
      rows.forEach((data) => {
        const actionState = {};
        actions.forEach((action) => {
          actionState["button19sh"] = { visible: false };
          actionState["button26oh"] = { visible: false };
          actionState["btnDelete"] = { visible: false };
          if ((data.iStatus === "2" || data.iStatus === 2) && (data.ShenheStatus === "0" || data.ShenheStatus === 0)) {
            actionState["button19sh"] = { visible: true };
            actionState["button26oh"] = { visible: true };
          } else {
            actionState["button19sh"] = { visible: false };
            actionState["button26oh"] = { visible: false };
          }
          if (data.iStatus === "0" || data.iStatus === 0) {
            actionState["btnDelete"] = { visible: true };
          }
          actionState["button12nb"] = { visible: true };
        });
        actionsStates.push(actionState);
      });
      gridModel1.setActionsState(actionsStates);
    });
    gridModel2.setColumnState("iStatus", "formatter", function (rowInfo, rowData) {
      var iStatusValue = "";
      if (rowData.iStatus === "0") {
        iStatusValue = "<span title='未盘点'>未盘点</span>";
      } else if (rowData.iStatus === "1") {
        iStatusValue = "<span title='盘点中'>盘点中</span>";
      } else if (rowData.iStatus === "2") {
        iStatusValue = "<span title='盘点完成'>盘点完成</span>";
      } else if (rowData.iStatus === "4") {
        iStatusValue = "<span title='作废'>作废</span>";
      } else {
        iStatusValue = "";
      }
      return {
        override: true,
        html: iStatusValue
      };
    });
    //删除前进行单据状态判断  只有未盘点可删除
    viewModel.on("beforeBatchdelete", function (params) {
      console.log("beforeBatchdelete");
      console.log(params);
      var deldata = JSON.parse(params.data.data);
      if (deldata[0].iStatus === 0 || deldata[0].iStatus === "0") {
        console.log(deldata[0].iStatus);
      } else {
        cb.utils.alert("只有盘点单状态为“未盘点”时才可以进行删除操作!");
        return false;
      }
    });
    //审核按钮点击事件
    shenheBtnModel.on("click", function (args) {
      console.log("[shenheclick]");
      var currentRow = gridModel1.getRow(args.index);
      console.log(currentRow);
      var timestr = new Date().format("yyyy-MM-dd hh:mm:ss");
      cb.rest.invokeFunction(
        "8ac74fb04c8d429c92f4efb3548a33cf",
        {
          stockId: currentRow.id,
          Shenhetime: timestr
        },
        function (err, res) {
          if (res !== null && res !== undefined && err === null) {
            cb.utils.alert("操作成功!");
            cb.utils.loadingControl.end();
            viewModel.execute("refresh");
          } else {
            cb.utils.loadingControl.end();
            cb.utils.alert("系统出错!");
          }
        }
      );
    });
    //申请复盘按钮点击事件
    fupanBtnModel.on("click", function (args) {
      cb.utils.loadingControl.start();
      console.log("[fupanBtnclick]");
      var currentRow = gridModel1.getRow(args.index);
      console.log(currentRow);
      var timestr = new Date().format("yyyy-MM-dd hh:mm:ss");
      cb.rest.invokeFunction(
        "e305fd717c7f498b98abbb56031c8127",
        {
          billNum: "b55df922List",
          stockId: currentRow.id,
          Shenhetime: timestr
        },
        function (err, res) {
          if (res !== null && res !== undefined && err === null) {
            cb.utils.loadingControl.end();
            cb.utils.alert("操作成功!");
            viewModel.execute("refresh");
          } else {
            cb.utils.loadingControl.end();
            cb.utils.alert("系统出错!");
          }
        }
      );
    });
  });
  //添加按钮跳转页面
  addBtn.on("click", function () {
    cb.loader.runCommandLine(
      "bill",
      {
        billtype: "voucherList",
        billno: "214f7c6c",
        params: { mode: "edit", readOnly: false }
      },
      viewModel
    );
  });
});