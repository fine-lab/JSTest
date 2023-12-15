viewModel.on("customInit", function (data) {
  // 生产订单--页面初始化
  var viewModel = this;
  //特征标识
  let character = cb.context.isNewArch();
  console.log("测试扩展：生产订单--页面初始化"); //f12的Console里查看打印结果
  let ordertype = viewModel.getCache("orderType");
  let productModel;
  let materialModel;
  if (2 === ordertype) {
    productModel = viewModel.get("orderProductChange");
    materialModel = viewModel.get("orderMaterialChange");
  } else if (1 == ordertype || 3 == ordertype) {
    productModel = viewModel.get("orderProduct");
    materialModel = viewModel.get("orderMaterial");
  }
  const multiLangSplice = (value, params) => {
    let mlStr = value;
    if (mlStr != undefined && mlStr != null && typeof mlStr === "string") {
      if (params != undefined && params != null && params instanceof Array && params.length > 0) {
        mlStr = value.replace(/#\$(\d+)\$#/gi, (_, index) => params[index - 1]);
      }
    }
    return mlStr;
  };
  //产品表编辑后
  productModel.on("afterCellValueChange", function (args) {
    let mode = viewModel.getParams().mode;
    let cellname = args.cellName;
    let index = args.rowIndex;
    let value = args.value;
    switch (cellname) {
      //选择物料的处理放到后端处理
      case "batchNo":
        //中成药产品的批次
        let remark = productModel.getCellValue(index, "remark");
        let batchNo = productModel.getCellValue(index, "batchNo");
        let bomId = productModel.getCellValue(index, "bomId");
        let materials = productModel.getCellValue(index, "orderMaterial");
        let bomMaterials = [];
        if (batchNo && bomId && materials && materials.length > 0) {
          materials.forEach((item) => {
            if (item.bomMaterialId) {
              let warehouseId = item.warehouseId;
              if (warehouseId && warehouseId == "-1") {
                warehouseId = null;
              }
              bomMaterials.push({
                bomMaterialId: item.bomMaterialId,
                productId: item.productId,
                skuId: item.skuId,
                stockOrgId: item.orgId,
                warehouseId: warehouseId
              });
            }
          });
          if (bomMaterials.length > 0) {
            let params = {
              batchNo,
              bomId,
              bomMaterials
            };
            //根据bom母件、子件关键字段 匹配批次档案获取生产日期、有效期至
            matchExpireDateByBomInfo(viewModel, params, index);
          }
        }
        break;
    }
  });
  //产品表点击某个字段时(一单一girdModel平铺时)
  productModel.on("rowColChange", function (args) {
    let columnName = args.value.columnKey;
    let index = args.value.rowIndex;
    //预留：需求跟踪方式
    if (columnName == "reserveid_demandtype") {
      //推拉单时，香雪租户不可修改和变更
      let reserveid = productModel.getCellValue(index, "reserveid");
      let sourceid = productModel.getCellValue(index, "sourceid");
      if (sourceid) {
        return false;
      }
    }
    //预留：客户名称
    if (columnName == "reserveid_reservecust_name") {
      //推拉单时，香雪租户不可修改和变更
      let sourceid = productModel.getCellValue(index, "sourceid");
      if (sourceid) {
        return false;
      }
    }
  });
  // 生产订单--页面初始化
  //批量获取订单产品行信息（物料id+ 批次号+ 行id）
  let getOrderProductBatchnos = function (orderProducts) {
    let option = { async: false, domainKey: "yourKeyHere" };
    let res = cb.rest.invokeFunctionSync("PO.afterFunction.getMOBatchNos", { orderProducts }, option);
    return res;
  };
  let matchExpireDateByBomInfo = function (viewModel, args, index) {
    let productModel = viewModel.getCache("orderProduct");
    let requestUrl = "/getBatchNo/matchExpireDateByBomInfo";
    let proxy = viewModel.setProxy({
      ensure: {
        url: requestUrl,
        method: "POST"
      }
    });
    proxy.ensure(args, function (error, result) {
      if (error) {
        cb.utils.alert(error.message);
        return;
      }
      if (result && result.producedate) {
        productModel.setCellValue(index, "produceDate", result.producedate);
        productModel.setCellValue(index, "expirationDate", result.invaliddate);
      } else {
      }
    });
  };
  //是否是关键bom  (待改造，暂不使用)
  let isKeyBom = function (bomId, bomMaterialId) {
    //测试数据
    bomId = 1567210133340028935;
    bomMaterialId = 1567210133340028936;
    let option = { async: false, domainKey: "yourKeyHere" };
    let res = cb.rest.invokeFunctionSync("PO.afterFunction.queryBomGJJFlag", { bomId, bomMaterialId }, option);
    if (res && res.result && res.result.flag) {
      return true;
    }
    return false;
  };
  //同步请求
  cb.rest.invokeFunctionSync = function (id, data, optionsNew) {
    let proxySync = cb.rest.DynamicProxy.create({
      doProxy: {
        url: "/web/function/invoke/" + id,
        method: "POST",
        options: optionsNew
      }
    });
    return proxySync.doProxySync(data);
  };
});