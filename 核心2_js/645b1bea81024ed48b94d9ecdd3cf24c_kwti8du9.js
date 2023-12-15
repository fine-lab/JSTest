viewModel.on("afterSave", function (args) {
  debugger;
  if (args.err == null) {
    var data = args.res;
    var productName;
    console.log("判断类型是啥：" + data.pc_product_userDefine002);
    // 使用组织
    var wldata = cb.rest.invokeFunction("GZTBDM.frontDesignerFunction.getMaterialBySql", { orgId: data.productApplyRangeId, id: data.id }, function (err, res) {}, viewModel, { async: false });
    data = wldata.result.data;
    productName = data.name;
    let productApplyRange = data.productOrgs;
    for (let i = 0; i < productApplyRange.length; i++) {
      let orgId = productApplyRange[i].orgId;
      var customerId = "";
      if (orgId == "2522102344422656" || orgId == "2390178757465088" || orgId == "2369205391741184") {
        // 表体
        if (orgId == "2522102344422656") {
          //依安工厂
          customerId = "yourIdHere";
        } else if (orgId == "2390178757465088") {
          //克东
          customerId = "yourIdHere";
        } else if (orgId == "2369205391741184") {
          //克东
          customerId = "001";
        }
      }
      let shelfLifeUnit = ""; //有效期单位
      let shelfLife; //有效期时间
      //是否启用效期控制
      let shelfLifeFlag = data.detail.isExpiryDateManage != null ? data.detail.isExpiryDateManage : "N";
      if (shelfLifeFlag == true) {
        shelfLifeFlag = "Y";
        //有效期单位
        shelfLifeUnit = data.detail.expireDateUnit != undefined ? data.detail.expireDateUnit : "";
        if (shelfLifeUnit === 1) {
          shelfLifeUnit = "YEAR";
        } else if (shelfLifeUnit === 2) {
          shelfLifeUnit = "MONTH";
        } else {
          shelfLifeUnit = "DAY";
        }
        //有效期时间
        shelfLife = data.detail.expireDateNo != undefined ? data.detail.expireDateNo : 0;
      } else {
        shelfLifeFlag = "N";
      }
      let unit = data.unit;
      let stockUnitID = data.detail.stockUnit;
      var unitres = cb.rest.invokeFunction("GZTBDM.frontDesignerFunction.getUnitBySql", { unit: unit }, function (err, res) {}, viewModel, { async: false });
      var stockUnitRes = cb.rest.invokeFunction("GZTBDM.frontDesignerFunction.getUnitBySql", { unit: stockUnitID }, function (err, res) {}, viewModel, { async: false });
      var unitCode = unitres.result.res[0].code;
      var stockUnit = stockUnitRes.result.res[0].code;
      var mainUnitCount = "1";
      if (data.productAssistUnitExchanges != null) {
        mainUnitCount = data.productAssistUnitExchanges[0].mainUnitCount;
      }
      let bodyMap = {
        sku: data.code,
        customerId: customerId,
        skuDescr1: data.name,
        skuDescr2: data.detail.shortName,
        activeFlag: "Y",
        easyCode: data.detail.mnemonicCode,
        skuGroup7: "0",
        freightClass: data.pc_product_userDefine002,
        shelfLifeFlag: shelfLifeFlag, //有效期控制
        shelfLifeUnit: shelfLifeUnit, //有效期单位
        shelfLife: shelfLife, //有效期
        serialNoCatch: "Y",
        overRcvPercentage: 100,
        kitFlag: "N",
        secondSerialNoCatch: "Y",
        printMedicineQcReport: "Y",
        reservedField02: data.enableAssistUnit, //是否启用辅计量标记
        reservedField03: unitCode, //主单位  1460944928342802453
        reservedField04: stockUnit, //库存单位
        reservedField05: unitCode == stockUnit ? "1" : mainUnitCount, //换算率
        reservedField06: data.code, //物料编码
        reservedField07: "0",
        reservedField10: "0",
        reservedField11: "0",
        reservedField12: "0",
        reservedField17: "N"
      };
      let headerList = [];
      headerList.push(bodyMap);
      let hederData = {
        header: headerList
      };
      let body = {
        data: hederData
      };
      let method = "putSKU";
      let paramData = {
        data: body,
        method: method
      };
      if (bodyMap.customerId != "") {
        var wmsResult = cb.rest.invokeFunction("GT101792AT1.API.sendWMSByApi", { paramData: paramData }, function (err, res) {}, viewModel, { async: false });
        if (wmsResult.result != undefined && wmsResult.result.jsonResponse != undefined && wmsResult.result.jsonResponse.Response != undefined) {
          let sendWMSResult = wmsResult.result.jsonResponse;
          let Response = sendWMSResult.Response.return;
          if (Response.returnCode != "0000") {
            cb.utils.alert("Ys推送WMS物料失败：" + JSON.stringify(Response.returnDesc), "error");
            return;
          }
        } else {
          cb.utils.alert("Ys推送WMS物料失败：" + JSON.stringify(wmsResult), "error");
          return;
        }
      }
    }
    //推易溯
    if (data.pc_product_userDefine002 != "Y3" && data.pc_product_userDefine002 != "03" && data.pc_product_userDefine002 != "Y1") {
      let packageData = {
        packageUnitName: "", //赋码单位名称（箱、托等）
        level: "", //级别（单位关联到几级，如箱托关联，为2级）
        qty: "", //下级数量（包装比例，如：1托里面有几箱）
        price: "" //商品价格(Ys市场价)
      };
      let extAttr = {
        tempName: "自定义属性",
        name: "SKU_ID",
        value: data.id // 物料id
      };
      let extAttr2 = {
        tempName: "自定义属性",
        name: "毛重",
        value: data.weight // 物料id
      };
      let extAttrList = [];
      extAttrList.push(extAttr);
      let packageList = [];
      if (data.weight != undefined) {
        extAttrList.push(extAttr2);
      }
      var brandName = "";
      if (data.brand_Name == undefined) {
        brandName = "无";
      } else {
        brandName = data.brand_Name;
      }
      let barCode = "";
      if (data.detail != undefined && data.detail.barCode != undefined) {
        barCode = data.detail.barCode;
      }
      let shelfLifeUnit = "";
      let shelfLife = "";
      if (data.detail != undefined && data.detail.expireDateUnit != undefined) {
        shelfLifeUnit = data.detail.expireDateUnit != 6 ? data.detail.expireDateUnit : 3;
        shelfLife = data.detail.expireDateNo;
      }
      let product = {
        gs1Code: barCode, // 条形码
        code: data.code, //产品代码
        name: productName, //产品名称
        brandName: brandName, //品牌
        shelfLifeUnit: shelfLifeUnit, //保质期单位
        shelfLife: shelfLife, //保质期
        packageList: packageList,
        extAttrList: extAttrList // 拓展属性
      };
      let productList = [];
      productList.push(product);
      let biz_content = {
        productList: productList,
        isCover: 1 //值为0不覆盖,不传或其他值为覆盖(int)
      };
      let method = "product";
      //请求参数
      let requestParam = {
        method: method,
        biz_content: biz_content
      };
      // 调用公共方法向易溯发数据
      var ysResult = cb.rest.invokeFunction("GT101792AT1.API.sendYsByApi", { requestParam: requestParam }, function (err, res) {}, viewModel, { async: false });
      if (ysResult.result.ysContent.code != "0") {
        cb.utils.alert("Ys推送易溯错误：" + JSON.stringify(ysResult.result.ysContent.errMsg), "error");
        return;
      }
    }
    cb.utils.alert("Ys推送易溯、WMS成功", "success");
  }
});