viewModel.get("LeaseAssetListList") &&
  viewModel.get("LeaseAssetListList").on("afterCellValueChange", function (data) {
    // 表格-租赁资产明细--单元格值改变后
    console.log("单元格值改变后");
    console.log(data);
    let rows = viewModel.get("LeaseAssetListList").getRows();
    console.log(rows);
    let row = rows[data.rowIndex];
    for (var i in rows) {
      if (parseInt(i) !== data.rowIndex) {
        var otherrow = rows[i];
        switch (data.cellName) {
          case "LeaseItem_name":
            if (otherrow["LeaseItem_name"] == data.value.name) {
              console.log(data.rowIndex);
              console.log(data.value.name);
              viewModel.get("LeaseAssetListList").deleteRows([data.rowIndex]);
            }
            break;
        }
      }
    }
    if (data.cellName == "LeaseItem_name") {
      console.log("租赁资产变化 设置开始时间");
      var index = data.rowIndex;
      var begindata = viewModel.get("effect_date").getValue();
      var sign_date = viewModel.get("sign_date").getValue();
      viewModel.get("LeaseAssetListList").setCellValue(index, "beginDate", begindata, true);
      viewModel.get("LeaseAssetListList").setCellValue(index, "EnsureRecdate", sign_date, true);
    }
    if (data.cellName == "EnsurereFunddate") {
      console.log("保证金退还时间变化 设置合同结束时间");
      var oenddate = viewModel.get("end_date").getValue();
      var end_date = data.value;
      if (!oenddate) {
        viewModel.get("end_date").setValue(end_date);
      } else {
        var oenddatetime = new Date(oenddate).getTime();
        var nenddatetime = new Date(end_date).getTime();
        if (nenddatetime > oenddatetime) {
          viewModel.get("end_date").setValue(end_date);
        }
      }
    }
    if (data.cellName == "LeaseTerm") {
      var index = data.rowIndex;
      console.log("租赁时间变化 设置结束时间");
      var beginDate = viewModel.get("LeaseAssetListList").getCellValue(index, "beginDate");
      // 总天数
      var dataadd = data.value * 30;
      // 生成次数
      var numt = viewModel.get("LeaseAssetListList").getCellValue(index, "item396bb");
      // 总时间，增加的天数
      console.log("新增" + dataadd + "天");
      cb.rest.invokeFunction(
        "GT9912AT31.common.dataAdd",
        {
          datastr: beginDate,
          aday: dataadd,
          i: index,
          type: "add"
        },
        function (err, res) {
          var enddate = res.res.acc;
          var t = res.res.t - 1;
          var endDate = enddate.substr(0, 10);
        }
      );
    }
  });
viewModel.get("LeaseAssetListList") &&
  viewModel.get("LeaseAssetListList").on("afterSelect", function (data) {
    // 表格-租赁资产明细--选择后
    console.log("选择后");
    console.log(data);
  });
viewModel.get("button46bf") &&
  viewModel.get("button46bf").on("click", function (data) {
    // 批量添加--单击
    // 生效日期
    var effect_date = viewModel.get("effect_date").getValue();
    var index1 = viewModel.get("LeaseAssetListList").getSelectedRowIndexes();
    console.log("选择 " + index1);
    var rows1 = viewModel.get("LeaseAssetListList").getRows();
    var res1 = rows1[index1];
    // 先清空
    var rows2 = viewModel.get("RentPayPlanList").getRows();
    var size = rows2.length;
    var deleteNum = [];
    if (size > 0) {
      for (var i = 0; i < size; i++) {
        deleteNum.push(i);
      }
      console.log(deleteNum);
      viewModel.get("RentPayPlanList").deleteRows(deleteNum);
    }
    // 租赁资产id
    var LeaseItem = res1["LeaseItem"];
    // 租赁资产名称
    var LeaseItem_name = res1["LeaseItem_name"];
    // 周期天数
    var dataadd = parseInt(res1["item336cj"]);
    // 生成次数
    var numt = res1["item396bb"];
    // 周期单位
    var times = res1["paymentCycle_name"];
    // 总金额
    var money = res1["money"];
    // 租赁总时间
    var LeaseTerm = res1["LeaseTerm"];
    // 租赁总时间
    var alldays = res1["item261ce"];
    console.log("周期天数 = " + dataadd);
    console.log("按照" + times + "缴纳");
    console.log("租赁资产 = " + LeaseItem);
    console.log("租赁资产 = " + LeaseItem_name);
    console.log("次数 = " + numt);
    cb.rest.invokeFunction("GT9912AT31.common.numAvg", { money, numt, scale: dataadd, days: alldays }, function (err, res) {
      console.log(res);
      var payment_money1 = res.res.value1;
      var payment_money2 = res.res.value2;
      cb.utils.loadingControl.start();
      if (numt == 1) {
        var obj = {
          remarks: "第1" + times,
          payment_date: effect_date,
          payment_money: money,
          LeaseItem: LeaseItem,
          LeaseItem_name: LeaseItem_name
        };
        viewModel.get("RentPayPlanList").insertRow(0, obj);
      } else if (numt > 1) {
        var insertRow = [];
        for (var i = 0; i < numt; i++) {
          if (dataadd >= 30) {
            var amonth = dataadd / 30;
            var amonth1 = amonth * i;
            cb.rest.invokeFunction(
              "GT9912AT31.common.dataAdd",
              {
                datastr: effect_date,
                amonth: amonth1,
                i,
                type: "addmonth"
              },
              function (err, res) {
                var t = res.res.t;
                var pm = payment_money1;
                if (t == numt) {
                  pm = payment_money2;
                }
                var datastr = res.res.acc;
                var datastr1 = datastr.substr(0, 10);
                var obj = {
                  remarks: "第" + t + times,
                  payment_date: datastr1,
                  payment_money: pm,
                  LeaseItem: LeaseItem,
                  LeaseItem_name: LeaseItem_name
                };
                insertRow.push({ index: t - 1, obj });
                if (insertRow.length == numt) {
                  var irow = sort(insertRow);
                  console.log(irow);
                  for (var j = 0; j < irow.length; j++) {
                    var nobj = irow[j];
                    viewModel.get("RentPayPlanList").insertRow(j, nobj);
                    console.log("insertRow " + j);
                    console.log(nobj);
                  }
                }
              }
            );
          } else {
            var dataadd1 = dataadd * i;
            cb.rest.invokeFunction(
              "GT9912AT31.common.dataAdd",
              {
                datastr: effect_date,
                aday: dataadd1,
                i,
                type: "addday"
              },
              function (err, res) {
                var t = res.res.t;
                var pm = payment_money1;
                if (t == numt) {
                  pm = payment_money2;
                }
                var datastr = res.res.acc;
                var datastr1 = datastr.substr(0, 10);
                var obj = {
                  remarks: "第" + t + times,
                  payment_date: datastr1,
                  payment_money: pm,
                  LeaseItem: LeaseItem,
                  LeaseItem_name: LeaseItem_name
                };
                insertRow.push({ index: t - 1, obj });
                if (insertRow.length == numt) {
                  var irow = sort(insertRow);
                  console.log(irow);
                  for (var j = 0; j < irow.length; j++) {
                    var nobj = irow[j];
                    viewModel.get("RentPayPlanList").insertRow(j, nobj);
                    console.log("insertRow " + j);
                    console.log(nobj);
                  }
                }
              }
            );
          }
        }
      }
      cb.utils.loadingControl.end();
      function sort(insertRows) {
        var narr = [];
        var size = parseInt(JSON.stringify(insertRows.length));
        for (var j = 0; j < size; j++) {
          for (var i = 0; i < insertRows.length; i++) {
            var row = insertRows[i];
            if (row.index == j) {
              narr.push(row.obj);
              insertRows.splice(i, 1);
              break;
            }
          }
        }
        return narr;
      }
    });
  });
viewModel.on("customInit", function (data) {
  // 租赁合同录入--页面初始化
});
viewModel.on("afterMount", function (data) {
  console.log("加载完成。。。");
  viewModel.get("LeaseAssetListList").setState("fixedHeight", 300);
  viewModel.get("RentPayPlanList").setState("fixedHeight", 300);
});