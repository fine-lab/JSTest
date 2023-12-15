viewModel.get("headFreeItem!define9_name") &&
  viewModel.get("headFreeItem!define9_name").on("afterValueChange", function (data) {
    // 送达方--值改变后
    if (data != undefined) {
      let response = cb.rest.invokeFunction("SCMSA.A2.queryClientData", { data: data }, function (err, res) {}, viewModel, { async: false });
      let receiver = response.result.resData.receiver != undefined ? response.result.resData.receiver : null;
      let mobile = response.result.resData.mobile != undefined ? response.result.resData.mobile : null;
      let address = response.result.resData.address != undefined ? response.result.resData.address : null;
      //给某个字段赋值
      viewModel.get("orderDefineCharacter").get("attrext24").setValue(receiver);
      viewModel.get("orderDefineCharacter").get("attrext23").setValue(mobile);
      viewModel.get("orderDefineCharacter").get("attrext22").setValue(address);
    }
  });
// 报价数量--值改变
viewModel.get("orderDetails").on("afterCellValueChange", function (data) {
  if (data) {
    let total = 0;
    let rowIndex = data.rowIndex;
    let value = data.value.bodyDefine13;
    let valueOld = data.oldValue.bodyDefine13;
    let valuebodyDefine1 = data.value.bodyDefine1;
    let valueOldbodyDefine1 = data.oldValue.bodyDefine1;
    if (value != valueOld || valuebodyDefine1 != valueOldbodyDefine1) {
      if (data.value != data.oldValue) {
        var iQuantity = 0;
        switch (data.cellName) {
          case "orderDetailDefineCharacter": {
            var datas = viewModel.get("orderDetails").getDirtyData();
            datas = datas[rowIndex];
            //判断是卷筒还是版纸
            let productLine_Code = datas.orderDetailDefineCharacter.bodyDefine10;
            let bjdw = datas.orderDetailDefineCharacter.bodyDefine1;
            //判断报价单位是否输入
            if (!bjdw) {
              cb.utils.alert("请先选择报价单位", "error");
              return false;
            } else {
              let orderDetailDefineCharacter = datas.orderDetailDefineCharacter;
              //长
              let length = orderDetailDefineCharacter.bodyDefine5;
              //宽
              let width = orderDetailDefineCharacter.bodyDefine6;
              //克重
              let netWeight = orderDetailDefineCharacter.bodyDefine7;
              //卷重
              let weight = orderDetailDefineCharacter.bodyDefine8;
              //令数/件
              let linNum = orderDetailDefineCharacter.bodyDefine9;
              //是否切分
              let isfq = orderDetailDefineCharacter.bodyDefine3;
              //分切长度
              let fqLength = orderDetailDefineCharacter.bodyDefine4 / 1000;
              if (productLine_Code == "平板") {
                //版纸
                if (bjdw == "件") {
                  iQuantity = value * length * width * netWeight * 500 * linNum;
                } else {
                  cb.utils.alert("当前产品类型为版纸,报价单位只能选择件", "error");
                  return false;
                }
              } else if (productLine_Code == "卷筒") {
                //卷筒
                if (isfq && isfq == "是") {
                  if (!fqLength) {
                    cb.utils.alert("当前商品类型为卷筒，已选择分切，请输入分切长度！！！", "error");
                    return false;
                  } else {
                    if (bjdw == "令" || bjdw == "吨" || bjdw == "张" || bjdw == "件") {
                      if (bjdw == "令") {
                        iQuantity = value * fqLength * width * netWeight * 500;
                      } else if (bjdw == "吨") {
                        iQuantity = value * 1000;
                      } else if (bjdw == "张") {
                        iQuantity = value * fqLength * width * netWeight;
                      } else if (bjdw == "件") {
                        iQuantity = value;
                      }
                    } else {
                      cb.utils.alert("当前商品类型为卷筒并进行分切,只能选择报价单位令、吨、张、件", "error");
                      return false;
                    }
                  }
                } else {
                  if (bjdw == "吨" || bjdw == "卷") {
                    if (bjdw == "吨") {
                      iQuantity = value * 1000;
                    } else if (bjdw == "卷") {
                      iQuantity = value * weight;
                    }
                  } else {
                    cb.utils.alert("当前商品类型为卷筒并不进行分切,只能选择报价单位吨、卷", "error");
                    return false;
                  }
                }
              } else {
                cb.utils.alert("当前行物料无法识别版纸还是卷筒");
                return false;
              }
            }
            if (isNaN(iQuantity)) {
              cb.utils.alert("计算错误，请检查长，宽，克重，卷重，令数/件", "error");
              return false;
            }
            // 给页面的某个字段赋值
            var gridModel = viewModel.getGridModel("orderDetails");
            gridModel.setCellValue(rowIndex, "priceQty", iQuantity);
            gridModel.setCellValue(rowIndex, "subQty", iQuantity);
          }
        }
      }
    }
  }
});