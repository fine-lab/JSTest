viewModel.get("memo") &&
  viewModel.get("memo").on("afterValueChange", function (data) {
    // 备注--值改变后
    let orgId = viewModel.get("stockOrg").getValue(); //组织id
    let childModel = viewModel.get("details"); //表格模型
    let beforeChildData = childModel.getData(); //表格数据，改变前
    let wlhwData = beforeChildData; //物料货位数据
    debugger;
    //拼接物料in条件值 start
    let productConditions = "";
    for (let i = 0; i < beforeChildData.length; i++) {
      if (i > 0 && beforeChildData[i].product) {
        productConditions = productConditions + ", '" + beforeChildData[i].product + "'";
      } else if (beforeChildData[i].product) {
        productConditions = productConditions + "'" + beforeChildData[i].product + "'";
      }
    }
    debugger;
    //拼接物料in条件值 end
    if (productConditions) {
      cb.rest.invokeFunction(
        "d4ff0066d5964feb8d1ca8a30cac8c85",
        { _orgId: orgId, _productConditions: productConditions },
        function (err, res) {
          debugger;
          if (err) {
            cb.utils.alert("生成货位失败，请联系管理员。");
            cb.utils.alert(err.message);
            return;
          }
          wlhwData = res.res;
          //循环子表，找到对应物料进行货位赋值
          if (wlhwData) {
            for (let x = 0; x < beforeChildData.length; x++) {
              for (let y = 0; y < wlhwData.length; y++) {
                if (beforeChildData[x].product == wlhwData[y].wuliao) {
                  let rowNo = x; //行号
                  let hwId = wlhwData[y].huowei; //货位ID
                  let hwName = wlhwData[y].hw_mingchen; //货位Name
                  childModel.setCellValue(rowNo, "extendWLHWname", hwName, false, true); //赋值货位Name
                }
              }
            }
          } else {
            cb.utils.alert("未找到相应的货位信息");
          }
        }
      );
    } else {
      cb.utils.alert("请添加盘点物料后再生成货位信息");
    }
  });