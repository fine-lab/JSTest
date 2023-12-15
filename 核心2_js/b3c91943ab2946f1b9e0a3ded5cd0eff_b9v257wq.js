viewModel.get("btnBatchModifyconsignmentList").on("click", function (event) {
  let data = {
    billtype: "Voucher", // 单据类型
    billno: "ybd0a365f7", // 单据号
    domainKey: "yourKeyHere",
    params: {
      mode: "edit" // (编辑态edit、新增态add、浏览态browse)
    }
  };
  //打开一个单据，并在当前页面显示
  cb.loader.runCommandLine("bill", data, viewModel, function (vm, viewMate, title) {
    vm.get("button20fh").on("click", function () {
      //获取父页面选中的值
      // 获取当前表格已有数据 过滤子表ID与主表ID重复项
      let currentGridData = viewModel.getGridModel().getAllData();
      console.log(currentGridData, "当前表数据");
      //获取参照中选中的数据
      let selectRownewData = vm.getGridModel().getSelectedRows();
      console.log(selectRownewData, "参照中选中的数据");
      if (selectRownewData.length > 0) {
        let adddata = [];
        if (currentGridData.length > 0) {
          let arr = filterRepeat(selectRownewData, currentGridData);
          console.log(selectRownewData, arr);
          // 测试使用
          arr.map((item, index) => {
            let v = {
              supplierName: item.supplierName, //供应商名称
              supplier: item.supplierId, //供应商
              supplier_code: item.supplierCode,
              inventoryId_code: item.invCode, //物料编码
              inventoryId: item.invId, //物料
              inventoryName: item.invName, //物料名称
              unit_name: item.unitName, //规格单位名称
              unitCode: item.unitCode, //规格单位编码
              unit: item.unitId, //规格单位
              quantity: item.qty,
              department_name: item.departmentname,
              department: item.department,
              departmentcode: item.departmentcode,
              warehouse: item.warehouse,
              warehouse_name: item.warehousename,
              warehousecode: item.warehousecode,
              salesOrg_name: item.salesOrgname,
              salesOrg: item.salesOrg,
              salesOrgcode: item.salesOrgcode,
              xsckCode: item.xsckCode,
              rowno: item.rows,
              goodsposition_name: item.goodspositionName,
              goodsposition: item.goodsposition,
              goodspositionCode: item.goodspositionCode
            };
            if (item.source == 1) {
              v.salesOutId = item.salesOutId;
              v.salesDeliverysId = item.salesDeliverysId;
            } else {
              //其他出库
              v.otherOutId = item.salesOutId;
              v.otherDeliverysId = item.salesDeliverysId;
            }
            adddata.push(v);
          });
        } else {
          selectRownewData.map((item, index) => {
            let v = {
              supplierName: item.supplierName, //供应商名称
              supplier: item.supplierId, //供应商
              supplier_code: item.supplierCode,
              inventoryId_code: item.invCode, //物料编码
              inventoryId: item.invId, //物料
              inventoryName: item.invName, //物料名称
              unit_name: item.unitName, //规格单位名称
              unitCode: item.unitCode, //规格单位编码
              unit: item.unitId, //规格单位
              quantity: item.qty,
              department_name: item.departmentname,
              department: item.department,
              departmentcode: item.departmentcode,
              warehouse: item.warehouse,
              warehouse_name: item.warehousename,
              warehousecode: item.warehousecode,
              salesOrg_name: item.salesOrgname,
              salesOrg: item.salesOrg,
              salesOrgcode: item.salesOrgcode,
              xsckCode: item.xsckCode,
              rowno: item.rows,
              goodsposition_name: item.goodspositionName,
              goodsposition: item.goodsposition,
              goodspositionCode: item.goodspositionCode
            };
            if (item.source == 1) {
              v.salesOutId = item.salesOutId;
              v.salesDeliverysId = item.salesDeliverysId;
            } else {
              //其他出库
              v.otherOutId = item.salesOutId;
              v.otherDeliverysId = item.salesDeliverysId;
            }
            adddata.push(v);
          });
        }
        debugger;
        adddata.forEach((item, index) => {
          viewModel.getGridModel().appendRow(item);
        });
      }
      viewModel.communication({
        type: "modal",
        payload: { data: false }
      });
    });
    return true;
  });
});
//新增行 行号处理
function filterRepeat(arr1, arr2) {
  let arr = [];
  arr1.map((item, index) => {
    let istrue;
    if (item.source == "1") {
      istrue = arr2.findIndex((obj) => obj.salesOutId == item.salesOutId && obj.salesDeliverysId == item.salesDeliverysId);
    } else {
      istrue = arr2.findIndex((obj) => obj.otherOutId == item.salesOutId && obj.otherDeliverysId == item.salesDeliverysId);
    }
    if (istrue == -1) {
      arr.push(item);
    }
  });
  return arr;
}
//设置按钮可见状态
viewModel.on("modeChange", function (mode) {
  console.log(viewModel.getGridModel().getData());
  viewModel.get("button24kh").setVisible(false);
  let settlementOrNot = viewModel.get("settlementOrNot").getValue();
  //浏览态结算按钮可见
  if (mode === "browse") {
    if (!(settlementOrNot == "YJS")) {
      viewModel.get("button24kh").setVisible(true);
    } else {
      viewModel.get("btnEdit").setDisabled(true);
    }
  }
});
viewModel.get("button24kh") &&
  viewModel.get("button24kh").on("click", function (data) {
    viewModel.get("button24kh").setDisabled(true);
    billing();
  });
function billing() {
  let codeno = viewModel.get("code").getValue(); // 单据编码
  let inv_date = viewModel.get("ddate").getValue(); // 单据日期
  let list = viewModel.getGridModel().getAllData();
  let arr = list.filter((item) => {
    if (item["flg"] !== "已结算" || !item["flg"]) {
      return {
        salesOrgcode: item.salesOrgcode, //组织
        departmentcode: item.departmentcode, //采购部门编码
        warehousecode: item.warehousecode, //仓库编码
        supplier_code: item.supplier_code, //供应商编码
        inventoryId_code: item.inventoryId_code, //物料编码
        rowno: item.rowno, //行号
        unitCode: item.unitCode, //单位编码
        quantity: item.quantity, //数量
        salesDeliverysId: item.salesDeliverysId, //销售出库单子表id
        salesOutId: item.salesOutId, //销售出库单主表id
        id: item.id //行子表id
      };
    }
  });
  console.log(arr);
  let res = cb.rest.invokeFunction(
    "AT18623B800920000A.api.posave",
    {
      data: {
        code: codeno, //单据编码
        vouchdate: inv_date, //单据日期
        consignmentList: arr
      }
    },
    function (err, res) {},
    viewModel,
    {
      async: false
    }
  );
  let { code, msg } = res.result;
  if (code == 200) {
    viewModel.get("button24kh").setVisible(false);
    viewModel.execute("refresh");
    cb.utils.alert("结算完成", "success");
  } else {
    cb.utils.alert(msg, "error");
    viewModel.get("button24kh").setDisabled(false);
  }
}
viewModel.on("customInit", function (args) {
  console.log(viewModel.getGridModel().getData());
});
viewModel.get("consignmentListList") &&
  viewModel.get("consignmentListList").on("afterSetDataSource", function (data) {
    //表格-结算单子表--设置数据源后
  });
viewModel.get("button25ei") &&
  viewModel.get("button25ei").on("click", function (data) {
    //按钮--单击
  });