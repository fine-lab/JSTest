viewModel.on("customInit", function (data) {
  console.log("[盘点单列表]");
  var addBtn = viewModel.get("button7ue");
  viewModel.on("afterMount", function () {
    viewModel.getCache("FilterViewModel").getParams().filterRows = 3;
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
    var shenheBtnModel = viewModel.get("button23ec");
    var fupanBtnModel = viewModel.get("button30aj");
    var ceshiBtnModel = viewModel.get("button36ef");
    var gridModel1 = viewModel.get("dxq_checkstock_1554560792884936713");
    gridModel1.setShowCheckbox(false); //主表去掉checkbox
    gridModel1._set_data("forbiddenDblClick", true); //主表去掉双击事件
    console.log(gridModel1);
    var gridModel2 = viewModel.get("dxq_checkstockAreaList");
    //根据单据状态判断部分操作按钮是否显示
    gridModel1.on("afterSetDataSource", () => {
      //获取列表所有数据
      const rows = gridModel1.getRows();
      //从缓存区获取按钮
      const actions = gridModel1.getCache("actions");
      console.log(actions);
      if (!actions) return;
      const actionsStates = [];
      rows.forEach((data) => {
        const actionState = {};
        actions.forEach((action) => {
          actionState["button23ec"] = { visible: true }; // 审核
          actionState["button30aj"] = { visible: true }; // 申请复盘·
          actionState["button17qi"] = { visible: true }; // 查看盘点结果
          actionState["button12kc"] = { visible: true }; // 删除
          if (data.IsFupan === "1" || data.IsFupan === 1) {
            if (data.iStatus === "0" || data.iStatus === 0) {
              actionState["button23ec"] = { visible: false }; // 审核
              actionState["button30aj"] = { visible: false }; // 申请复盘·
              actionState["button17qi"] = { visible: false }; // 查看盘点结果
            }
            if (data.iStatus === "1" || data.iStatus === 1) {
              actionState["button12kc"] = { visible: false };
              actionState["button23ec"] = { visible: false }; // 审核
              actionState["button30aj"] = { visible: false }; // 申请复盘·
            }
            if (data.iStatus === "2" || data.iStatus === 2) {
              actionState["button12kc"] = { visible: false };
              if (data.ShenheStatus === "0" || data.ShenheStatus === 0) {
                actionState["button23ec"] = { visible: true };
                actionState["button30aj"] = { visible: true };
              } else {
                actionState["button23ec"] = { visible: false }; // 审核
                actionState["button30aj"] = { visible: false }; // 申请复盘·
              }
            } else {
              actionState["button23ec"] = { visible: false }; // 审核
              actionState["button30aj"] = { visible: false }; // 申请复盘·
            }
          } else {
            actionState["button12kc"] = { visible: false };
            if (data.iStatus === "0" || data.iStatus === 0) {
              actionState["button23ec"] = { visible: false }; // 审核
              actionState["button30aj"] = { visible: false }; // 申请复盘·
              actionState["button17qi"] = { visible: false }; // 查看盘点结果
            }
            if (data.iStatus === "1" || data.iStatus === 1) {
              actionState["button12kc"] = { visible: false };
              actionState["button23ec"] = { visible: false }; // 审核
              actionState["button30aj"] = { visible: false }; // 申请复盘·
            }
            if (data.iStatus === "2" || data.iStatus === 2) {
              if (data.ShenheStatus === "0" || data.ShenheStatus === 0) {
                actionState["button23ec"] = { visible: true };
                actionState["button30aj"] = { visible: true };
              } else {
                actionState["button23ec"] = { visible: false }; // 审核
                actionState["button30aj"] = { visible: false }; // 申请复盘·
              }
            } else {
              actionState["button23ec"] = { visible: false }; // 审核
              actionState["button30aj"] = { visible: false }; // 申请复盘·
            }
          }
        });
        actionsStates.push(actionState);
      });
      setTimeout(function () {
        gridModel1.setActionsState(actionsStates);
      }, 50);
    });
    console.log("*****************");
    console.log(gridModel2);
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
          console.log(err);
          console.log(res);
          if (res !== null && res !== undefined && err === null) {
            // 跳转处理页面判断
            let checkID = currentRow.id;
            var checkLocationNameNow = "";
            var productNameNow = "";
            var productUnitNow = "";
            var stockUnitNameNow = "";
            var checkStatusNow = "";
            var scanWayNow = "";
            var productskuNameNow = "";
            var pageNow = 1;
            var pageSizeNow = 10;
            var reqParams = {
              checkid: checkID,
              checklocationname: checkLocationNameNow,
              productname: productNameNow,
              productunit: productUnitNow,
              stockunitname: stockUnitNameNow,
              checkstatus: checkStatusNow,
              scanWay: scanWayNow,
              productskuname: productskuNameNow,
              page: pageNow,
              pagesize: pageSizeNow
            };
            var ListResult = cb.rest.invokeFunction("317125ce944242109f940225e63b8529", { reqParams: reqParams }, function (err, res) {}, viewModel, { async: false });
            console.log(ListResult);
            const res = JSON.parse(ListResult.result.strResponse);
            var blankInfo = false;
            if (res.dataList.length > 0) {
              var dataListContent = res.dataList;
              for (var i = 0; i < dataListContent.length; i++) {
                if (dataListContent[i].checkstatus == "0" || dataListContent[i].checkstatus == "2") {
                  blankInfo = true;
                  break;
                }
              }
              if (blankInfo) {
                cb.utils.confirm(
                  "请处理盘盈或盘亏的数据",
                  () => {
                    // 参数提交 查看返回参数是否正确，决定是否打印
                    let data1 = {
                      billtype: "VoucherList", // 单据类型
                      billno: "6b70d3d6", // 单据号
                      params: {
                        mode: "browse", // (编辑态、新增态、浏览态)
                        checkCode: currentRow.cCheckCode
                      }
                    };
                    cb.loader.runCommandLine("bill", data1, viewModel);
                  },
                  () => {}
                );
              }
              cb.utils.alert("操作成功!");
              cb.utils.loadingControl.end();
            }
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
          billNum: "76a30055List",
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
    // 测试按钮点击
    ceshiBtnModel.on("click", function (args) {
      console.log("[ceshiBtnModelclick]");
      var currentRow = gridModel1.getRow(args.index);
      console.log(currentRow);
      var timestr = new Date().format("yyyy-MM-dd hh:mm:ss");
      // 跳转处理页面判断
      let checkID = currentRow.id;
      var checkLocationNameNow = "";
      var productNameNow = "";
      var productUnitNow = "";
      var stockUnitNameNow = "";
      var checkStatusNow = "";
      var scanWayNow = "";
      var productskuNameNow = "";
      var pageNow = 1;
      var pageSizeNow = 10;
      var reqParams = {
        checkid: checkID,
        checklocationname: checkLocationNameNow,
        productname: productNameNow,
        productunit: productUnitNow,
        stockunitname: stockUnitNameNow,
        checkstatus: checkStatusNow,
        scanWay: scanWayNow,
        productskuname: productskuNameNow,
        page: pageNow,
        pagesize: pageSizeNow
      };
      var ListResult = cb.rest.invokeFunction("317125ce944242109f940225e63b8529", { reqParams: reqParams }, function (err, res) {}, viewModel, { async: false });
      console.log(ListResult);
      const res = JSON.parse(ListResult.result.strResponse);
      var blankInfo = false;
      if (res.dataList.length > 0) {
        var dataListContent = res.dataList;
        for (var i = 0; i < dataListContent.length; i++) {
          if (dataListContent[i].checkstatus == "0" || dataListContent[i].checkstatus == "2") {
            blankInfo = true;
            break;
          }
        }
        if (blankInfo) {
          cb.utils.confirm(
            "请处理盘盈或盘亏的数据",
            () => {
              // 参数提交 查看返回参数是否正确，决定是否打印
              let data1 = {
                billtype: "VoucherList", // 单据类型
                billno: "6b70d3d6", // 单据号
                params: {
                  mode: "browse", // (编辑态、新增态、浏览态)
                  checkCode: currentRow.cCheckCode
                }
              };
              cb.loader.runCommandLine("bill", data1, viewModel);
            },
            () => {}
          );
        }
        cb.utils.alert("操作成功!");
        cb.utils.loadingControl.end();
      }
      viewModel.execute("refresh");
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
viewModel.get("button17qi") &&
  viewModel.get("button17qi").on("click", function (data) {
    // 查看盘点结果--单击
    console.log("[查看盘点结果独立按钮]");
    var gridModel1 = viewModel.get("dxq_checkstock_1554560792884936713");
    //获取选中行的行号
    var line = gridModel1.getFocusedRowIndex();
    //获取选中行数据信息
    var checkTaskInfo = gridModel1.getRow(line);
    //传递给被打开页面的数据信息
    let data1 = {
      billtype: "VoucherList", // 单据类型
      billno: "7c81e7f8", // 单据号
      params: {
        mode: "browse", // (编辑态edit、新增态add、浏览态browse)
        //传参
        checkTaskInfo: checkTaskInfo
      }
    };
    console.log("[modal]" + JSON.stringify(data1));
    console.log(checkTaskInfo);
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", data1, viewModel);
  });
viewModel.get("button31ig") &&
  viewModel.get("button31ig").on("click", function (data) {
    // 新增盘点单（全仓）--单击
    let data1 = {
      billtype: "Voucher", // 单据类型
      billno: "bc68f584", // 单据号
      params: {
        mode: "add" // (编辑态edit、新增态add、浏览态browse)
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", data1, viewModel);
  });
viewModel.get("button30aj") &&
  viewModel.get("button30aj").on("click", function (data) {
    // 申请复盘--单击
  });
viewModel.get("button36ef") &&
  viewModel.get("button36ef").on("click", function (data) {
    // 测试按钮--单击
  });