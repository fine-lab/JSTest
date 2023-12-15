viewModel.on("afterSave", function (args) {
  let YSCode = viewModel.get("code").getValue();
  let YSU8code = viewModel.get("OrderON").getValue();
  let result = cb.rest.invokeFunction(
    "AT1767B4C61D580001.api.updatau8yscode",
    {
      flg: 1,
      YSCode,
      YSU8code
    },
    function (err, res) {},
    viewModel,
    {
      async: false
    }
  );
});
viewModel.on("modeChange", function (data) {
  viewModel.get("btnBizFlowPush").setVisible(false);
});
viewModel.get("PO_PodetailsList") &&
  viewModel.get("PO_PodetailsList").on("afterCellValueChange", function (data) {
    // 表格-采购订单子表--单元格值改变后
    try {
      console.log(data, "单元格值改变后");
      let Price;
      let Num;
      let totalPrice;
      if (data.cellName == "product_code") {
        //修改价格
        let rowIndex = data.rowIndex; //行号
        let cInvCode = data.value.code;
        let org_id = viewModel.get("org_id").getValue();
        //调用后端函数
        let result = cb.rest.invokeFunction(
          "AT1767B4C61D580001.api.GetPrice",
          {
            cInvCode: cInvCode,
            org_id: org_id
          },
          function (err, res) {},
          viewModel,
          {
            async: false
          }
        );
        if (result.result.rsp.code == "0") {
          viewModel.getGridModel("PO_PodetailsList").setCellValue(data.rowIndex, "Price", result.result.rsp.data.Price);
        } else {
          viewModel.getGridModel("PO_PodetailsList").setCellValue(data.rowIndex, "Price", 0);
          cb.utils.alert(result.result.rsp.msg, "error");
        }
        console.log(result);
      }
      let PO_PodetailsList = viewModel.getGridModel("PO_PodetailsList");
      Price = parseFloat(PO_PodetailsList.getCellValue(data.rowIndex, "Price") || 0);
      Num = parseFloat(PO_PodetailsList.getCellValue(data.rowIndex, "Num") || 0);
      totalPrice = Price * Num;
      viewModel.getGridModel("PO_PodetailsList").setCellValue(data.rowIndex, "totalPrice", totalPrice);
      let PoNum = 0;
      let OrderAmount = 0;
      for (var i = 0; i < PO_PodetailsList.getRows().length; i++) {
        PoNum += parseFloat(PO_PodetailsList.getCellValue(i, "Num") || 0);
        OrderAmount += parseFloat(PO_PodetailsList.getCellValue(i, "totalPrice") || 0);
      }
      //计算累计采购数量
      viewModel.get("PoNum").setData(PoNum);
      viewModel.get("OrderAmount").setData(OrderAmount);
    } catch (e) {
      console.log(e.toString());
    }
  });
viewModel.getGridModel("PO_PodetailsList").on("afterDeleteRows", function (rows) {
  sumnum();
});
function sumnum() {
  let PO_PodetailsList = viewModel.getGridModel("PO_PodetailsList");
  let PoNum = 0;
  let OrderAmount = 0;
  for (var i = 0; i < PO_PodetailsList.getRows().length; i++) {
    PoNum += parseFloat(PO_PodetailsList.getCellValue(i, "Num") || 0);
    OrderAmount += parseFloat(PO_PodetailsList.getCellValue(i, "totalPrice") || 0);
  }
  //计算累计采购数量
  viewModel.get("PoNum").setData(PoNum);
  viewModel.get("OrderAmount").setData(OrderAmount);
}
viewModel.on("beforeSave", (args) => {
  try {
    debugger;
    console.log(args);
    console.log("beforeSave");
    let poOrder = JSON.parse(args.data.data);
    //调用后端函数
    let accIdresult = cb.rest.invokeFunction(
      "AT1767B4C61D580001.api.getaccId",
      {
        org_id: poOrder.org_id
      },
      function (err, res) {},
      viewModel,
      {
        async: false
      }
    );
    let accId = accIdresult.result.accId;
    if (!cb.utils.isEmpty(poOrder.StoreCode)) {
      let Storeresult = cb.rest.invokeFunction(
        "AT1767B4C61D580001.api.checkstore",
        {
          StoreCode: poOrder.StoreCode
        },
        function (err, res) {},
        viewModel,
        {
          async: false
        }
      );
      if (Storeresult.result.code != "0") {
        cb.utils.alert("门店编码[" + poOrder.StoreCode + "]不存在");
        return false;
      }
    }
    if (poOrder.PO_PodetailsList != null && poOrder.PO_PodetailsList.length > 0) {
      var logindate;
      var time = new Date(poOrder.PODate);
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = time.getDate();
      d = d < 10 ? "0" + d : d;
      logindate = y + "-" + m + "-" + d;
      let cPersonCode01 = viewModel.get("item215hf").getValue();
      var request = {
        logindate: logindate,
        cBusType: poOrder.BusType,
        cMemo: poOrder.Memo,
        cVenCode: poOrder.item102cb, //供应商
        PTCode: poOrder.PTCode, //采购类型
        cDepCode: poOrder.item158gb,
        StoreCode: poOrder.StoreCode,
        cPersonCode: cPersonCode01, //业务员编码
        nflat: poOrder.Nflat,
        VenAccount: poOrder.VenAccount,
        InorgCode: poOrder.InorgCode, //组织编码
        SFCode: poOrder.code, //sf单号
        BodyList: []
      };
      for (var i = 0; i < poOrder.PO_PodetailsList.length; i++) {
        //行
        request.BodyList.push({
          cInvCode: poOrder.PO_PodetailsList[i].cInvCode,
          iquantity: poOrder.PO_PodetailsList[i].Num,
          productSKU_code: poOrder.PO_PodetailsList[i].productSKU_code
        });
      }
      console.log(JSON.stringify(request));
      //调用后端函数
      let result = cb.rest.invokeFunction(
        "AT1767B4C61D580001.api.posave",
        {
          req: JSON.stringify(request),
          org_id: poOrder.org_id
        },
        function (err, res) {},
        viewModel,
        {
          async: false
        }
      );
      console.log("后端同步u8同步回调");
      console.log(result);
      if (result.result.rsp.code == "0") {
        //调用成功
        var data = result.result.rsp;
        poOrder.OrderON = accId + "_" + data.data.cPOID; //订单号
        poOrder.POID = data.data.POID; //主表Id
        poOrder.VyState = "已同步U8未审核"; //主表Id
        for (var j = 0; j < data.data.listInfo.length; j++) {
          var row = data.data.listInfo[j].Row - 1;
          poOrder.PO_PodetailsList[row].PodId = data.data.listInfo[j].ID;
        }
        args.data.data = JSON.stringify(poOrder);
        return true;
      } else {
        cb.utils.alert("保存失败！" + result.result.rsp.msg);
        return false;
      }
    } else {
      cb.utils.alert("采购明细行至少录入一行");
      return false;
    }
  } catch (e) {
    console.log(e.toString());
    return false;
  }
});
viewModel.on("afterLoadData", function (args) {
  try {
    debugger;
    if (args.id == null) {
      let user = cb.rest.AppContext.user;
      //查询组织信息 赋值主组织
      //调用后端函数
      let result = cb.rest.invokeFunction(
        "AT1767B4C61D580001.api.queryOrgAndDept",
        {
          userId: user.userId
        },
        function (err, res) {},
        viewModel,
        {
          async: false
        }
      );
      console.log("后端同步u8同步回调");
      console.log(result);
      if (result.result.rsp.code == "0") {
        let data = result.result.rsp.data;
        viewModel.get("org_id_name").setValue(data.orgName);
        viewModel.get("InorgCode").setValue(data.orgIdCode);
        viewModel.get("org_id").setValue(data.orgId);
        viewModel.get("DepId_name").setValue(data.deptName);
        viewModel.get("DepId").setValue(data.deptId);
        viewModel.get("item158gb").setValue(data.deptCode); //部门编码
        viewModel.get("item215hf").setValue(data.staffCode); //业务员编码
        viewModel.get("StaffId_name").setValue(data.staffName); //员工姓名
        viewModel.get("StaffId").setValue(data.staffId); //所有人id
        viewModel.get("PersonId_name").setValue(data.staffName); //业务员
        viewModel.get("PersonId").setValue(data.staffId); //业务员编码
      }
    }
  } catch (e) {}
});
//删除
viewModel.on("beforeDelete", function (params) {
  debugger;
  let data = JSON.parse(params.data.data);
  let VyState = viewModel.get("VyState").getValue();
  let result = cb.rest.invokeFunction(
    "AT1767B4C61D580001.api.podel",
    {
      code: data.OrderON,
      org_id: data.org_id
    },
    function (err, res) {},
    viewModel,
    {
      async: false
    }
  );
  console.log(result);
  if (result.result.rsp.code == "0") {
    return true;
  } else {
    cb.utils.alert("删除失败！" + result.result.rsp.msg);
    return false;
  }
});
viewModel.get("VenId_name") &&
  viewModel.get("VenId_name").on("afterValueChange", function (data) {
    debugger;
    // 供应商--值改变后
    let vendorid = data.value.id;
    let depcode = viewModel.get("item158gb").getValue();
    let StoreCode = viewModel.get("StoreCode").getValue();
    let StoreCoderesult = cb.rest.invokeFunction(
      "AT1767B4C61D580001.api.getStoreCode",
      {
        depcode: depcode
      },
      function (err, res) {},
      viewModel,
      {
        async: false
      }
    );
    if (StoreCoderesult.result.code == 0) {
      StoreCode = StoreCoderesult.result.data;
      viewModel.get("StoreCode").setValue(StoreCode);
    }
    viewModel.get("VenAccount").setValue("");
    viewModel.get("supplierAccount").setValue("");
    viewModel.get("supplierAccount_AccountNo").setValue("");
    debugger;
    //调用后端函数
    let result = cb.rest.invokeFunction(
      "AT1767B4C61D580001.api.getSupplier",
      {
        vendorid: vendorid,
        StoreCode: StoreCode
      },
      function (err, res) {},
      viewModel,
      {
        async: false
      }
    );
    if (result.result.rsp.code == "0") {
      let data = result.result.rsp.data;
      viewModel.get("VenAccount").setValue(data.AccountNo);
      viewModel.get("supplierAccount").setValue(data.id);
      viewModel.get("supplierAccount_AccountNo").setValue(data.AccountNo);
    }
  });
viewModel.get("StoreCode") &&
  viewModel.get("StoreCode").on("afterValueChange", function (data) {
    // 门店编码--值改变后
    debugger;
    // 供应商--值改变后
    let vendorid = viewModel.get("VenId").getValue();
    let StoreCode = data.value;
    viewModel.get("VenAccount").setValue("");
    viewModel.get("supplierAccount").setValue("");
    viewModel.get("supplierAccount_AccountNo").setValue("");
    debugger;
    //调用后端函数
    let result = cb.rest.invokeFunction(
      "AT1767B4C61D580001.api.getSupplier",
      {
        vendorid: vendorid,
        StoreCode: StoreCode
      },
      function (err, res) {},
      viewModel,
      {
        async: false
      }
    );
    if (result.result.rsp.code == "0") {
      let data = result.result.rsp.data;
      viewModel.get("VenAccount").setValue(data.AccountNo);
      viewModel.get("supplierAccount").setValue(data.id);
      viewModel.get("supplierAccount_AccountNo").setValue(data.AccountNo);
    }
  });