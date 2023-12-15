viewModel.get("button30ah") &&
  viewModel.get("button30ah").on("click", function (data) {
    // 拍平导出--单击
    //动态引入js-xlsx库
    let secScript = document.createElement("script");
    //保存传入的viewModel对象
    window.viewModelInfo = viewModel;
    //加载js-xlsx
    let data1 = viewModel.getGridModel().getSelectedRows();
    let param = {};
    // 勾选导出
    if (data1 && data1.length > 0) {
      var ids = "";
      data1.forEach((item) => {
        ids += "'" + item.id + "',";
      });
      ids = ids.substring(0, ids.length - 1);
      param = { whereStr: ids, isSelect: true };
    } else {
      var searchFieldMap = new Map();
      var searchField = ["po_number", "bill_to_address", "vendorId", "request_date", "estimated_packing_date", "order_remark", "creation_date", "publish_time", "last_update_date"];
      for (var i = 0; i < searchField.length; i++) {
        if (viewModel.get("cache").FilterViewModel.get(searchField[i]).get("fromModel").get("value")) {
          searchFieldMap.set(searchField[i], viewModel.get("cache").FilterViewModel.get(searchField[i]).get("fromModel").get("value"));
        }
      }
      if (searchFieldMap.size > 0) {
        let obj = Object.create(null);
        for (let [k, v] of searchFieldMap) {
          obj[k] = v;
        }
        param = { whereStr: obj, isSelect: false };
      } else {
        cb.utils.alert("请选择勾选要货主表或者输入查询条件进行导出！", "error");
        return;
      }
    }
    if (param) {
      cb.rest.invokeFunction("GT39325AT4.backOpenApiFunction.getShippingVO", param, function (err, res) {
        if (res && res.shippingvoList.length > 0) {
          let shippingvoList = res.shippingvoList;
          let rowsData = [];
          for (var i = 0; i < shippingvoList.length; i++) {
            var shippingbvoList = shippingvoList[i].shippingschedulebList;
            if (!shippingbvoList || shippingbvoList.length <= 0) {
              let tempItem = {};
              tempItem["订单号码"] = shippingvoList[i].po_number || "";
              tempItem["发货地址"] = shippingvoList[i].bill_to_address;
              tempItem["供应商名称"] = shippingvoList[i].vendorId_name;
              tempItem["需求时间"] = shippingvoList[i].request_date;
              tempItem["预计发货时间"] = shippingvoList[i].estimated_packing_date;
              tempItem["订单备注"] = shippingvoList[i].order_remark;
              tempItem["生成时间"] = shippingvoList[i].creation_date;
              tempItem["发布时间"] = shippingvoList[i].publish_time;
              tempItem["最后更新时间"] = shippingvoList[i].last_update_date;
              if (!shippingvoList[i].po_code || shippingvoList[i].po_code == "") {
                tempItem["编码"] = shippingvoList[i].code;
              } else {
                tempItem["编码"] = shippingvoList[i].po_code;
              }
              tempItem["数量"] = "";
              tempItem["形态"] = "";
              tempItem["单位"] = "";
              tempItem["PO行"] = "";
              tempItem["SN"] = "";
              tempItem["物料描述"] = "";
              rowsData.push(tempItem);
              continue;
            }
            for (var j = 0; j < shippingbvoList.length; j++) {
              var shippingsnvoList = shippingbvoList[j].shippingschedulesnList;
              if (!shippingsnvoList || shippingsnvoList.length <= 0) {
                let tempItem = {};
                tempItem["订单号码"] = shippingvoList[i].po_number || "";
                tempItem["发货地址"] = shippingvoList[i].bill_to_address;
                tempItem["供应商名称"] = shippingvoList[i].vendorId_name;
                tempItem["需求时间"] = shippingvoList[i].request_date;
                tempItem["预计发货时间"] = shippingvoList[i].estimated_packing_date;
                tempItem["订单备注"] = shippingvoList[i].order_remark;
                tempItem["生成时间"] = shippingvoList[i].creation_date;
                tempItem["发布时间"] = shippingvoList[i].publish_time;
                tempItem["最后更新时间"] = shippingvoList[i].last_update_date;
                if (!shippingvoList[i].po_code || shippingvoList[i].po_code == "") {
                  tempItem["编码"] = shippingvoList[i].code;
                } else {
                  tempItem["编码"] = shippingvoList[i].po_code;
                }
                tempItem["数量"] = shippingbvoList[j].quantitiy;
                tempItem["形态"] = shippingbvoList[j].item_type;
                tempItem["单位"] = shippingbvoList[j].unit_name;
                tempItem["PO行"] = shippingbvoList[j].batch;
                tempItem["SN"] = "";
                tempItem["物料描述"] = "";
                rowsData.push(tempItem);
                continue;
              }
              for (var z = 0; z < shippingsnvoList.length; z++) {
                let tempItem = {};
                tempItem["订单号码"] = shippingvoList[i].po_number || "";
                tempItem["发货地址"] = shippingvoList[i].bill_to_address;
                tempItem["供应商名称"] = shippingvoList[i].vendorId_name;
                tempItem["需求时间"] = shippingvoList[i].request_date;
                tempItem["预计发货时间"] = shippingvoList[i].estimated_packing_date;
                tempItem["订单备注"] = shippingvoList[i].order_remark;
                tempItem["生成时间"] = shippingvoList[i].creation_date;
                tempItem["发布时间"] = shippingvoList[i].publish_time;
                tempItem["最后更新时间"] = shippingvoList[i].last_update_date;
                if (!shippingvoList[i].po_code || shippingvoList[i].po_code == "") {
                  tempItem["编码"] = shippingvoList[i].code;
                } else {
                  tempItem["编码"] = shippingvoList[i].po_code;
                }
                tempItem["数量"] = 1;
                tempItem["形态"] = shippingbvoList[j].item_type;
                tempItem["单位"] = shippingbvoList[j].unit_name;
                tempItem["PO行"] = shippingbvoList[j].batch;
                tempItem["SN"] = shippingsnvoList[z].sncode;
                tempItem["物料描述"] = shippingsnvoList[z].materialdescription;
                rowsData.push(tempItem);
              }
            }
          }
          exportExcelFile(rowsData, "供应商要货计划拍平导出-" + new Date().format("yyyy-MM-dd-hh-mm-ss"));
          cb.utils.alert("导出成功！", "success");
        }
      });
    }
  });