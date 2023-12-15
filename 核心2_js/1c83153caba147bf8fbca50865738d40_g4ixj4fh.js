viewModel.get("button27vb") &&
  viewModel.get("button27vb").on("click", function (data) {
    // 赋值--单击
    let kehufenlei = viewModel.get("kehufenlei").getValue(); //客户分类
    let chunxiaodidianbianma = viewModel.get("chunxiaodidianbianma").getValue(); //促销地点编码
    //处理分页
    var gridModel = viewModel.get("X00301List");
    //获取表格当前页面所有的行数据
    const rowAllDatas = gridModel.getRows();
    if (rowAllDatas == 0) {
      cb.utils.alert("请输入表体行数据");
      return;
    }
    let arrData = []; //存储每页的结果
    let pageSize = 100; //每页数量
    let rowSize = rowAllDatas.length;
    let totalNum = Math.ceil(rowSize / pageSize); //总分页
    let productConditions = "";
    let productConditionsArr = []; //存储生成条件的数组
    if (rowAllDatas[rowSize - 1].wuliaobianma == undefined || rowAllDatas[rowSize - 1].wuliaobianma == null) {
      delete rowAllDatas[rowSize - 1]; //移除最后一行空数据
      rowSize = rowSize - 1;
    }
    for (let i = 0; i < rowSize; i++) {
      if (rowAllDatas[i].wuliaobianma == undefined || rowAllDatas[i].wuliaobianma == null) {
        let currentRowPage = i + 1; //页面显示的表格行数据
        cb.utils.alert("第" + currentRowPage + "行没有选择物料");
        return;
      }
      //当前存储数据的数组下标
      let currentBottom = i >= pageSize ? parseInt(i / pageSize) : 0;
      if ((i + 1) % pageSize != 1 && rowAllDatas[i].wuliaobianma) {
        productConditions = productConditions + ", '" + rowAllDatas[i].wuliaobianma + "'";
      } else if (rowAllDatas[i].wuliaobianma) {
        productConditions = productConditions + "'" + rowAllDatas[i].wuliaobianma + "'";
      }
      productConditionsArr.push(rowAllDatas[i]); //将数据添加到条件数组中
      if (((i + 1) % pageSize == 0 && currentBottom < Math.ceil(rowSize / pageSize)) || i == rowSize - 1) {
        arrData[currentBottom] = { condition: productConditions, arr: productConditionsArr };
        productConditions = "";
        productConditionsArr = [];
      }
    }
    //调用后端函数
    if (
      kehufenlei == "1647343064549687310" ||
      kehufenlei == "1647343107499360277" ||
      kehufenlei == "1647343107499360270" ||
      kehufenlei == "1647343107499360272" ||
      kehufenlei == "1647343107499360311" ||
      kehufenlei == "1647343116089294857" ||
      kehufenlei == "1647343116089294864" ||
      kehufenlei == "1647343116089294868" ||
      kehufenlei == "1647343116089294875" ||
      kehufenlei == "1647343116089294881" ||
      kehufenlei == "1647343107499360273" ||
      kehufenlei == "1647343107499360269" ||
      kehufenlei == "1647343107499360280" ||
      kehufenlei == "1647343107499360274" ||
      kehufenlei == "1647343107499360276" ||
      kehufenlei == "1647343107499360278" ||
      kehufenlei == "1647343107499360275" ||
      kehufenlei == "1647343107499360279" ||
      kehufenlei == "1647343107499360271" ||
      kehufenlei == "1647343064549687300" ||
      kehufenlei == "1647343064549687305" ||
      kehufenlei == "1647343064549687302" ||
      kehufenlei == "1647343064549687301" ||
      kehufenlei == "1647343064549687309" ||
      kehufenlei == "1647343064549687308" ||
      kehufenlei == "1647343064549687304" ||
      kehufenlei == "1647343064549687303" ||
      kehufenlei == "1647343064549687306" ||
      kehufenlei == "1647343064549687299" ||
      kehufenlei == "1647373000467546115" ||
      kehufenlei == "1647343064549687360" ||
      kehufenlei == "1647343064549687361" ||
      kehufenlei == "1647343064549687367" ||
      kehufenlei == "1508039511138893837" ||
      kehufenlei == "1508039511138893843" ||
      kehufenlei == "1508039511138893846" ||
      kehufenlei == "1508039511138893838" ||
      kehufenlei == "1614540234643996681" ||
      kehufenlei == "1628111042810740742"
    ) {
      //根据客户分类获取原价
      for (let i = 0; i < arrData.length; i++) {
        let result = cb.rest.invokeFunction("GT9640AT12.api.queryYjByWlbm01", { kehufenlei: kehufenlei, _productConditions: arrData[i].condition }, function (err, res) {}, viewModel, {
          async: false
        });
        if (result.error != undefined) {
          cb.utils.alert("请先选择促销地点编码!");
          return;
        }
        let currentResPageCondition = arrData[i].arr; //生成当前返回数据的数组
        let resultResponse = result.result.res; //响应结果
        for (let x = 0; x < currentResPageCondition.length; x++) {
          //拼装key值
          let resultKey = kehufenlei + currentResPageCondition[x].wuliaobianma;
          if (resultResponse.hasOwnProperty(resultKey)) {
            let useProductInfo = resultResponse[resultKey]; //当前行要使用的物料信息
            let baseIndex = i == 0 ? 0 : i * pageSize; //每次分页初始编号
            let rowNo = x + baseIndex; //行号
            gridModel.setCellValue(rowNo, "yuanjia", useProductInfo.price); //赋值原价
          }
        }
      }
    } else {
      //根据促销地点编码获取原价
      for (let i = 0; i < arrData.length; i++) {
        let result = cb.rest.invokeFunction(
          "GT9640AT12.api.queryTjByWlbm02",
          { chunxiaodidianbianma: chunxiaodidianbianma, _productConditions: arrData[i].condition },
          function (err, res) {},
          viewModel,
          { async: false }
        );
        if (result.error != undefined) {
          cb.utils.alert("请先选择促销地点编码!");
          return;
        }
        let currentResPageCondition = arrData[i].arr; //生成当前返回数据的数组
        let resultResponse = result.result.res; //响应结果
        for (let x = 0; x < currentResPageCondition.length; x++) {
          //拼装key值
          let resultKey = chunxiaodidianbianma + currentResPageCondition[x].wuliaobianma;
          if (resultResponse.hasOwnProperty(resultKey)) {
            let useProductInfo = resultResponse[resultKey]; //当前行要使用的物料信息
            let baseIndex = i == 0 ? 0 : i * pageSize; //每次分页初始编号
            let rowNo = x + baseIndex; //行号
            gridModel.setCellValue(rowNo, "yuanjia", useProductInfo.price); //赋值原价
          }
        }
      }
    }
  });
viewModel.on("beforeSave", function (args) {
  // 获取页面的合计字段
  let xiangjinchengdanjineheji = viewModel.get("xiangjinchengdanjineheji").getValue();
  let zongjineheji = viewModel.get("zongjineheji").getValue();
  // 获取子表
  var gridModel = viewModel.get("X00301List");
  //获取表格当前页面所有的行数据
  const rowAllDatas = gridModel.getRows();
  if (rowAllDatas == 0) {
    cb.utils.alert("请选择表体行数据");
    return;
  }
  let zibiao_cdheji = 0;
  let zibiao_heji = 0;
  for (var i = 0; i < rowAllDatas.length; i++) {
    //承担金额合计
    if (rowAllDatas[i].xiangjinchengdanjine != undefined) {
      zibiao_cdheji += rowAllDatas[i].xiangjinchengdanjine;
    }
    //总金额合计
    if (rowAllDatas[i].heji != undefined) {
      zibiao_heji += rowAllDatas[i].heji;
    }
  }
  if (xiangjinchengdanjineheji != zibiao_cdheji || zongjineheji != zibiao_heji) {
    cb.utils.alert("保存前必须先进行合计！");
    return false;
  }
});
viewModel.get("button31kj") &&
  viewModel.get("button31kj").on("click", function (data) {
    // 合计--单击
    var gridModel = viewModel.get("X00301List");
    //获取表格当前页面所有的行数据
    const rowAllDatas = gridModel.getRows();
    if (rowAllDatas == 0) {
      cb.utils.alert("请输入表体行数据");
      return;
    }
    let xiangjinchengdanjineheji = 0;
    let zongjineheji = 0;
    for (var i = 0; i < rowAllDatas.length; i++) {
      //承担金额合计
      if (rowAllDatas[i].xiangjinchengdanjine != undefined) {
        xiangjinchengdanjineheji += rowAllDatas[i].xiangjinchengdanjine;
      }
      //总金额合计
      if (rowAllDatas[i].heji != undefined) {
        zongjineheji += rowAllDatas[i].heji;
      }
    }
    viewModel.get("xiangjinchengdanjineheji").setValue(xiangjinchengdanjineheji);
    viewModel.get("zongjineheji").setValue(zongjineheji);
  });
viewModel.get("button35te") &&
  viewModel.get("button35te").on("click", function (data) {
    // 取差价--单击
    //获取表格当前页面所有的行数据
    var gridModel = viewModel.get("X00301List");
    const rowAllDatas = gridModel.getRows();
    if (rowAllDatas == 0) {
      cb.utils.alert("请输入表体行数据");
      return;
    }
    let chajiaCellValues = [];
    let xiangjinchengdanbiliCellValues = [];
    let xiangjinchengdanjineCellValues = [];
    let hejiCellValues = [];
    //相关计算逻辑
    for (var i = 0; i < rowAllDatas.length; i++) {
      let rowNo = i;
      if (rowAllDatas[i].yuanjia != undefined) {
        let yuanjia = rowAllDatas[i].yuanjia;
        if (rowAllDatas[i].tejia != undefined) {
          let tejia = rowAllDatas[i].tejia;
          //计算差价
          let chajia = yuanjia - tejia;
          let chajiaCellValue = {
            rowIndex: rowNo,
            cellName: "chajia",
            value: chajia
          };
          chajiaCellValues.push(chajiaCellValue);
          //计算公司承担比例
          let xiangjinchengdanbiliCellValue = {
            rowIndex: rowNo,
            cellName: "xiangjinchengdanbili",
            value: chajia
          };
          xiangjinchengdanbiliCellValues.push(xiangjinchengdanbiliCellValue);
          if (rowAllDatas[i].shuliang != undefined) {
            //公司承担金额
            let xiangjinchengdanjine = rowAllDatas[i].shuliang * chajia;
            let xiangjinchengdanjineCellValue = {
              rowIndex: rowNo,
              cellName: "xiangjinchengdanjine",
              value: xiangjinchengdanjine
            };
            xiangjinchengdanjineCellValues.push(xiangjinchengdanjineCellValue);
            //合计
            let hejiCellValue = {
              rowIndex: rowNo,
              cellName: "heji",
              value: xiangjinchengdanjine
            };
            hejiCellValues.push(hejiCellValue);
          } else {
            let xiangjinchengdanjineCellValue = {
              rowIndex: rowNo,
              cellName: "xiangjinchengdanjine",
              value: 0
            };
            xiangjinchengdanjineCellValues.push(xiangjinchengdanjineCellValue);
            let hejiCellValue = {
              rowIndex: rowNo,
              cellName: "heji",
              value: 0
            };
            hejiCellValues.push(hejiCellValue);
          }
        }
      }
    }
    //集合赋值
    gridModel.setCellValues(chajiaCellValues);
    gridModel.setCellValues(xiangjinchengdanbiliCellValues);
    gridModel.setCellValues(xiangjinchengdanjineCellValues);
    gridModel.setCellValues(hejiCellValues);
  });