viewModel.on("beforeValidate", function (args) {
  debugger;
  // 获取列表所有数据
  const rows = viewModel.getGridModel("delivery_request_detailList").getRows();
  var isreturn = false;
  var material_code;
  var codelist;
  cb.rest.invokeFunction("3a3c8a09da88427997228099f86be5a0", {}, function (err, res) {
    if (err) {
      cb.utils.alert(err, "error");
    } else {
      let codeList = res.codeList;
      for (var i = 0; i < rows.length; i++) {
        let material_code1 = rows[i].material_code; //物料编码
        let shelfdate = rows[i].shelf_life; //保质期
        let senddate = rows[i].estimate_del_date; //预计送达日期
        let productdate = rows[i].product_date; //生产日期
        for (var y = 0; y < codeList.length; y++) {
          let material_code3 = codeList[y].material_code; //物料编码
          let shelfdate2 = codeList[y].shelf_life; //保质期
          let senddate2 = codeList[y].estimate_del_date; //预计送达日期
          let productdate2 = codeList[y].product_date; //生产日期
          if (material_code1 == material_code3 && productdate < productdate2 && senddate > senddate2) {
            material_code = material_code1;
            viewModel.get("is_firstsend").setValue("1");
            isreturn = true;
            break;
          }
        }
      }
      if (isreturn) {
        viewModel.get("is_firstsend").setValue("2");
        cb.utils.alert("物料[" + material_code + "]存在先产后送情况，请核实", "error");
      } else {
        viewModel.get("is_firstsend").setValue("1");
      }
    }
  });
  for (var i = 0; i < rows.length; i++) {
    let product_date1 = rows[i].product_date.replace("-", "/").replace("-", "/"); //生产日期
    let shelf_life1 = rows[i].product_date.replace("-", "/").replace("-", "/"); //保质期
    let estimate_del_date1 = rows[i].estimate_del_date.replace("-", "/").replace("-", "/"); //预计送达日期
    let material_code1 = rows[i].material_code; //物料编码
    product_date1 = new Date(Date.parse(product_date1)); //生产日期
    shelf_life1 = new Date(Date.parse(shelf_life1)); //保质期
    estimate_del_date1 = new Date(Date.parse(estimate_del_date1)); //预计送达日期
    let shelfdate = rows[i].shelf_life; //保质期
    let senddate = rows[i].estimate_del_date; //预计送达日期
    let productdate = rows[i].product_date; //生产日期
    if (shelfdate <= senddate) {
      cb.utils.alert("第" + (i + 1) + "行 物料[" + material_code1 + "]保质期小于等于预计送达日期", "error");
      return false;
    }
    for (var y = 0; y < rows.length; y++) {
      let product_date2 = rows[y].product_date.replace("-", "/").replace("-", "/"); //生产日期
      let estimate_del_date2 = rows[y].estimate_del_date.replace("-", "/").replace("-", "/"); //预计送达日期
      let material_code2 = rows[y].material_code; //物料编码
      let shelfdate1 = rows[y].shelf_life; //保质期
      let senddate1 = rows[y].estimate_del_date; //预计送达日期
      let productdate1 = rows[y].product_date; //生产日期
      product_date2 = new Date(Date.parse(product_date2));
      estimate_del_date2 = new Date(Date.parse(estimate_del_date2));
      if (material_code1 == material_code2 && productdate > productdate1 && senddate < senddate1) {
        material_code = material_code1;
        viewModel.get("is_firstsend").setValue("1");
        isreturn = true;
        break;
      }
    }
  }
  if (isreturn) {
    viewModel.get("is_firstsend").setValue("2");
    cb.utils.alert("物料[" + material_code + "]存在先产后送情况，请核实", "error");
  } else {
    viewModel.get("is_firstsend").setValue("1");
  }
  return true;
});