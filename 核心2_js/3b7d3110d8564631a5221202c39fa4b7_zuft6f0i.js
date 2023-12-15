viewModel.on("afterSave", function (args) {
  let YSCode = viewModel.get("code").getValue();
  let YSU8code = viewModel.get("Iarriveid").getValue();
  let result = cb.rest.invokeFunction(
    "AT1767B4C61D580001.api.updatau8yscode",
    {
      flg: 2,
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
viewModel.get("Serial_NoList") &&
  viewModel.get("Serial_NoList").on("beforeCellValueChange", function (data) {
    // 表格-序列号信息
  });
//选中select后事件 rowIndexs为行号，单行(整形)or多行(数组)
viewModel.getGridModel("rdrecordsList").on("afterSelect", function (rowIndexs) {
});
//页面DOM加载完成
viewModel.on("afterMount", function (data) {
  let rdsList = viewModel.getGridModel("rdrecordsList");
  let Rd_Count = 0;
  for (var i = 0; i < rdsList.getRows().length; i++) {
    Rd_Count += parseFloat(rdsList.getCellValue(i, "Rd_Count"));
  }
  //计算已收到货数量
  viewModel.get("ArrivedNum").setData(Rd_Count);
});
viewModel.on("afterLoadData", function (args) {
  try {
    debugger;
    if (args.id == null) {
      let orgid = viewModel.get("org_id").getValue();
      let deparId = viewModel.get("DepId").getValue();
      //查询组织信息 赋值主组织
      //调用后端函数
      let result = cb.rest.invokeFunction(
        "AT1767B4C61D580001.api.getWarehouse",
        {
          orgid: orgid,
          deparId: deparId
        },
        function (err, res) {},
        viewModel,
        {
          async: false
        }
      );
      if (result.result.rsp.code == "0") {
        let data = result.result.rsp.data;
        viewModel.get("warehouse_name").setData(data.name);
        viewModel.get("item190ec").setData(data.code);
        viewModel.get("warehouse").setData(data.id);
      }
      console.log(result);
    }
  } catch (e) {}
});
viewModel.on("afterSave", (args) => {
  debugger;
  let POPomainCodeYS = viewModel.get("POPomainCodeYS").getValue();
  //调用后端函数
  let updateponum = cb.rest.invokeFunction(
    "AT1767B4C61D580001.api.updateponum",
    {
      POPomainCodeYS: POPomainCodeYS
    },
    function (err, res) {},
    viewModel,
    {
      async: false
    }
  );
});
//保存后事件
viewModel.on("beforeSave", (args) => {
  try {
    console.log(args);
    //校验入库数量是否大于或等于采购数量
    let rdrecord = JSON.parse(args.data.data);
    //调用后端函数
    let accIdresult = cb.rest.invokeFunction(
      "AT1767B4C61D580001.api.getaccId",
      {
        org_id: rdrecord.org_id
      },
      function (err, res) {},
      viewModel,
      {
        async: false
      }
    );
    let accId = accIdresult.result.accId;
    if (rdrecord.rdrecordsList != null && rdrecord.rdrecordsList.length > 0) {
      var logindate;
      var time = new Date(rdrecord.WaDate);
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = time.getDate();
      d = d < 10 ? "0" + d : d;
      logindate = y + "-" + m + "-" + d;
      let warehouse_code = rdrecord.item190ec; //仓库编码
      var request = {
        logindate: logindate || "", //单据日期
        cMemo: rdrecord.Memo || "", //备注
        cPTName: rdrecord.PTType || "", //采购类型
        SFCode: rdrecord.code || "", //SF订单编号
        InorgCode: rdrecord.InorgCode || "", //组织编码
        rdstyle: rdrecord.WaType || "", //入库类别
        wh: warehouse_code, //仓库编码
        IsQualified: rdrecord.IsQualified || "1", //
        BodyList: [] //表体信息
      };
      for (var i = 0; i < rdrecord.rdrecordsList.length; i++) {
        //行
        var item = {
          //表体信息
          iPOsID: rdrecord.rdrecordsList[i].PodId, //采购订单子表id
          iquantity: rdrecord.rdrecordsList[i].Rd_Count, //入库数量
          productSKU_code: rdrecord.rdrecordsList[i].productSKU_code, //suk编码
          sn: [] //序列号信息
        };
        debugger;
        let Isserial = cb.rest.invokeFunction(
          "AT1767B4C61D580001.api.Isserial",
          {
            iPOsID: rdrecord.rdrecordsList[i].PodId,
            org_id: rdrecord.org_id
          },
          function (err, res) {},
          viewModel,
          {
            async: false
          }
        );
        if (Isserial.result.rsp.code == "0") {
          if (!Isserial.result.rsp.data.bSerial) {
            rdrecord.rdrecordsList[i].Serial_NoList = []; //没有序列号清空
          }
        } else {
          cb.utils.alert(Isserial.result.rsp.msg, "error");
          return false;
        }
        if (rdrecord.rdrecordsList[i].Serial_NoList != null && rdrecord.rdrecordsList[i].Serial_NoList.length > 0) {
          for (var j = 0; j < rdrecord.rdrecordsList[i].Serial_NoList.length; j++) {
            item.sn.push({
              cinvsn: rdrecord.rdrecordsList[i].Serial_NoList[j].numberNo //序列号
            });
          }
        }
        request.BodyList.push(item);
      }
      console.log(request);
      console.log(JSON.stringify(request));
      //调用后端函数
      let result = cb.rest.invokeFunction(
        "AT1767B4C61D580001.api.rdssave",
        {
          req: JSON.stringify(request),
          org_id: rdrecord.org_id
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
        rdrecord.Iarriveid = accId + "_" + data.data.cCode; //订单号
        rdrecord.VyState = "已同步U8未审核";
        args.data.data = JSON.stringify(rdrecord);
        return true;
      } else {
        cb.utils.alert("保存失败！" + result.result.rsp.msg);
        return false;
      }
    } else {
      cb.utils.alert("采购入库明细行至少录入一行");
      return false;
    }
    return false;
  } catch (e) {
    console.log(e.toString());
    return false;
  }
});
viewModel.getGridModel("Serial_NoList").on("afterInsertRow", function (data) {
  debugger;
  console.log(JSON.stringify(data));
  if (data.index > 0) {
    let Serial_NoList = viewModel.getGridModel("Serial_NoList");
    Serial_NoList.setCellValue(data.index, "InvCode", Serial_NoList.getCellValue(data.index - 1, "InvCode")); //设置编码为上一行的
  }
});
viewModel.get("rdrecordsList") &&
  viewModel.get("rdrecordsList").on("afterCellValueChange", function (data) {
    // 表格-采购入库子表--单元格值改变后
    let rdsList = viewModel.getGridModel("rdrecordsList");
    let Rd_Count = 0;
    for (var i = 0; i < rdsList.getRows().length; i++) {
      Rd_Count += parseFloat(rdsList.getCellValue(i, "Rd_Count"));
    }
    //计算累计采购数量
    viewModel.get("ArrivedNum").setData(Rd_Count);
  });
//自动编码生成后
viewModel.on("afterBuildCode", function (args) {
  let rdsList = viewModel.getGridModel("rdrecordsList");
  for (var i = 0; i < rdsList.getRows().length; i++) {
    let Po_Num = rdsList.getCellValue(i, "Po_Num"); //采购数量
    let AddNum = rdsList.getCellValue(i, "AddNum"); //累计入库数量
    if (Po_Num <= AddNum) {
      rdsList.deleteRows([i]);
    }
  }
});
//    删除
viewModel.on("beforeDelete", function (params) {
  debugger;
  let data = JSON.parse(params.data.data);
  let OrderON = viewModel.get("Iarriveid").getValue();
  let VyState = viewModel.get("VyState").getValue();
  if (VyState == "已同步U8未审核" || VyState == "U8已审核" || VyState == "已同步U8已弃审") {
    let result = cb.rest.invokeFunction(
      "AT1767B4C61D580001.api.rddel",
      {
        code: OrderON,
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
  }
});
//删除后
viewModel.on("afterDelete", function (params) {
  debugger;
  let POPomainCodeYS = viewModel.get("POPomainCodeYS").getValue();
  //调用后端函数
  let updateponum = cb.rest.invokeFunction(
    "AT1767B4C61D580001.api.updateponum",
    {
      POPomainCodeYS: POPomainCodeYS
    },
    function (err, res) {},
    viewModel,
    {
      async: false
    }
  );
});
viewModel.get("warehouse_name") &&
  viewModel.get("warehouse_name").on("afterValueChange", function (data) {
    // 仓库--值改变后
    debugger;
  });