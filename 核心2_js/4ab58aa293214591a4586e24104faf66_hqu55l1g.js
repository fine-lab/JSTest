let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var requestData = request.data;
    //查询销售组织信息
    let func1 = extrequire("GT80266AT1.backDefaultGroup.getOrgList");
    //销售组织code
    let orgListRes = func1.execute(requestData.orgCode);
    if (orgListRes.returnData == null || JSON.stringify(orgListRes.returnData) == "{}") {
      throw new Error("查询销售组织信息失败!编码为：" + requestData.orgCode);
    } else {
      requestData.org_id = orgListRes.returnData.id;
      requestData.org_id_name = orgListRes.returnData.name;
    }
    //查询客户详情
    let func2 = extrequire("GT80266AT1.backDefaultGroup.getCustList");
    let queryCustDetails = {
      orgId: requestData.org_id, //销售组织id
      code: requestData.agentCode //客户编码
    };
    let custDetailsRes = func2.execute(queryCustDetails);
    if (JSON.stringify(custDetailsRes.returnData) == "{}") {
      throw new Error("查询客户详情信息失败!编码为：" + requestData.agentCode);
    } else {
      requestData.agentClass = custDetailsRes.returnData.customerClass;
      requestData.agentId = custDetailsRes.returnData.id;
      requestData.agentId_name = custDetailsRes.returnData.name.zh_CN;
    }
    //查询部门树
    let func3 = extrequire("GT80266AT1.backDefaultGroup.getDeptTree");
    let queryDeptTree = {
      orgId: requestData.org_id, //销售组织id
      code: requestData.saleDepartmentCode //销售部门编码
    };
    let deptTreeRes = func3.execute(queryDeptTree);
    if (JSON.stringify(deptTreeRes.returnData) == "{}") {
      throw new Error("查询部门信息失败!编码为：" + requestData.saleDepartmentCode);
    } else {
      requestData.saleDepartmentId = deptTreeRes.returnData.id;
      requestData.saleDepartmentId_name = deptTreeRes.returnData.name;
    }
    //查询员工信息
    if (requestData.corpContactCode) {
      //查询员工信息
      let func4 = extrequire("GT80266AT1.backDefaultGroup.getStaffList");
      let queryStafList = {
        orgId: requestData.org_id, //销售组织id
        deptId: requestData.saleDepartmentId, //销售部门id
        staffCode: requestData.corpContactCode //销售业务员编码
      };
      let stafListRes = func4.execute(queryStafList);
      if (JSON.stringify(stafListRes.returnData) == "{}") {
        throw new Error("查询员工信息失败!编码为：" + requestData.corpContactCode);
      } else {
        requestData.corpContact = stafListRes.returnData.id;
        requestData.corpContact_name = stafListRes.returnData.name;
      }
    }
    //查询汇率类型信息
    let func5 = extrequire("GT80266AT1.backDefaultGroup.getRateTypeList");
    //销售组织code
    let rateTypeListRes = func5.execute(requestData.exchangeRateTypeCode);
    if (JSON.stringify(rateTypeListRes.returnData) == "{}") {
      throw new Error("查询汇率类型信息失败!编码为：" + requestData.exchangeRateTypeCode);
    } else {
      requestData.exchangeRateType = rateTypeListRes.returnData.id;
      requestData.exchangeRateType_name = rateTypeListRes.returnData.name;
    }
    //查询币种信息
    let func6 = extrequire("GT80266AT1.backDefaultGroup.getOrderPricesList");
    let orderPricesListRes = func6.execute(requestData.orderPricesCode);
    if (JSON.stringify(orderPricesListRes.returnData) == "{}") {
      throw new Error("查询币种信息失败!编码为：" + requestData.orderPricesCode);
    } else {
      requestData.orderPrices = orderPricesListRes.returnData.id;
      requestData.orderPrices_name = orderPricesListRes.returnData.name;
    }
    //查询开票客户详情
    let func7 = extrequire("GT80266AT1.backDefaultGroup.getCustList");
    let queryCustDetails1 = {
      orgId: requestData.org_id, //销售组织id
      code: requestData.invoiceAgentCode //开票客户编码
    };
    let custDetailsRes1 = func7.execute(queryCustDetails1);
    if (JSON.stringify(custDetailsRes1.returnData) == "{}") {
      throw new Error("查询开票客户详情信息失败!编码为：" + requestData.invoiceAgentCode);
    } else {
      requestData.invoiceAgent = custDetailsRes1.returnData.id;
      requestData.invoiceAgent_name = custDetailsRes1.returnData.name.zh_CN;
    }
    //依据会员出生日期计算年龄
    if (requestData.memberbirthday != null) {
      let memberbirthday = requestData.memberbirthday;
      var birArr = memberbirthday.split("-");
      var birYear = birArr[0];
      var birMonth = birArr[1];
      var birDay = birArr[2];
      var nowdata = new Date();
      var nowYear = nowdata.getFullYear();
      var nowMonth = nowdata.getMonth() + 1; //记得加1
      var nowDay = nowdata.getDate();
      var returnAge;
      var d = new Date(birYear, birMonth - 1, birDay);
      if (d.getFullYear() == birYear && d.getMonth() + 1 == birMonth && d.getDate() == birDay) {
        if (nowYear == birYear) {
          returnAge = 0; //
        } else {
          var ageDiff = nowYear - birYear; //
          if (ageDiff > 0) {
            if (nowMonth == birMonth) {
              var dayDiff = nowDay - birDay; //
              if (dayDiff < 0) {
                returnAge = ageDiff - 1;
              } else {
                returnAge = ageDiff;
              }
            } else {
              var monthDiff = nowMonth - birMonth; //
              if (monthDiff < 0) {
                returnAge = ageDiff - 1;
              } else {
                returnAge = ageDiff;
              }
            }
          } else {
            throw new Error("出生日期晚于今天数据有误!出生信息为：" + memberbirthday);
          }
        }
      } else {
        throw new Error("输入的出生日期格式错误!出生信息为：" + memberbirthday);
      }
      if (Number(returnAge) == -1) {
        throw new Error("出生日期晚于今天数据有误!出生信息为：" + memberbirthday);
      } else {
        //年龄
        requestData.memberage = returnAge;
      }
    }
    //是否下推
    requestData.pushdown = "false";
    //是否关闭
    requestData.isclose = "false";
    //是否开票
    requestData.isbilling = "false";
    let orderDetails = requestData.orderDetails;
    for (var i = 0; i < orderDetails.length; i++) {
      let bodyData = orderDetails[i];
      //查询税率
      let func8 = extrequire("GT80266AT1.backDefaultGroup.getTaxDetails");
      let taxDetailsRes = func8.execute(bodyData.taxRateCode);
      if (JSON.stringify(taxDetailsRes.detail) == "{}") {
        throw new Error("查询税率信息失败!编码信息为：" + bodyData.taxRateCode);
      } else {
        bodyData.taxRate = taxDetailsRes.detail.id;
        bodyData.taxRate_ntaxRate = taxDetailsRes.detail.ntaxRate;
        bodyData.taxRateNum = taxDetailsRes.detail.ntaxRate;
      }
      //库存组织、开票组织
      if (requestData.orgCode != bodyData.stockOrgCode) {
        throw new Error("查询库存组织信息失败！编码为：" + bodyData.stockOrgCode);
      } else {
        bodyData.stockOrgId = requestData.org_id;
        bodyData.stockOrgId_name = requestData.org_id_name;
      }
      if (requestData.orgCode != bodyData.settlementOrgCode) {
        throw new Error("查询开票组织信息失败！编码为：" + bodyData.settlementOrgCode);
      } else {
        bodyData.settlementOrgId = requestData.org_id;
        bodyData.settlementOrgId_name = requestData.org_id_name;
      }
      //获取物料id、skuid
      let func9 = extrequire("GT80266AT1.backDefaultGroup.getMaterList");
      let queryMaterList = {
        code: bodyData.agentProductCode, //商品code
        skucode: bodyData.skucode //sku编码
      };
      let materListRes = func9.execute(queryMaterList);
      if (JSON.stringify(materListRes.returnData) == "{}") {
        throw new Error("查询物料信息失败!编码信息为：" + bodyData.agentProductCode);
      } else {
        if (materListRes.returnData.skuid == null) {
          throw new Error("查询物料SKU信息失败!编码信息为：" + bodyData.skucode);
        } else {
          bodyData.skuId = materListRes.returnData.skuid;
          bodyData.skuId_code = bodyData.skucode;
          bodyData.free1 = materListRes.returnData.free1;
          bodyData.free2 = materListRes.returnData.free2;
          bodyData.free3 = materListRes.returnData.free3;
          bodyData.free4 = materListRes.returnData.free4;
          bodyData.free5 = materListRes.returnData.free5;
          bodyData.agentProductCode_code = bodyData.agentProductCode;
          bodyData.agentProductCode = materListRes.returnData.materid;
          bodyData.agentProductName = materListRes.returnData.matername.zh_CN;
          bodyData.masterUnit = materListRes.returnData.unit;
          bodyData.masterUnit_name = materListRes.returnData.unitName;
        }
      }
      //主计量单位
      let func10 = extrequire("GT80266AT1.backDefaultGroup.getUnitDetail");
      let unitListRes = func10.execute(bodyData.masterUnitCode);
      if (JSON.stringify(unitListRes.returnData) == "{}") {
        throw new Error("查询计量单位信息失败!编码信息为：" + bodyData.masterUnitCode);
      } else {
        if (unitListRes.returnData.id != bodyData.masterUnit) {
          throw new Error("物料主计量单位信息与物料档案不相符!编码信息为：" + bodyData.masterUnitCode);
        }
      }
      //销售单位、计量单位
      if (bodyData.masterUnitCode != bodyData.productAuxUnitCode) {
        throw new Error("销售单位与主计量单位不符！编码为：" + bodyData.productAuxUnitCode);
      } else {
        bodyData.productAuxUnitName = bodyData.masterUnit;
        bodyData.productAuxUnitName_name = bodyData.masterUnit_name;
      }
      if (bodyData.masterUnitCode != bodyData.productUnitCode) {
        throw new Error("计量单位与主计量单位不符！编码为：" + bodyData.productUnitCode);
      } else {
        bodyData.productUnitName = bodyData.masterUnit;
        bodyData.productUnitName_name = bodyData.masterUnit_name;
      }
      //仓库
      let func11 = extrequire("GT80266AT1.backDefaultGroup.getWarehouseList");
      let queryWarehouseList = {
        code: bodyData.stockCode,
        orgId: requestData.stockOrgId
      };
      let warehouseListRes = func11.execute(queryWarehouseList);
      if (JSON.stringify(warehouseListRes.returnData) == "{}") {
        throw new Error("查询仓库信息失败!编码信息为：" + bodyData.stockCode);
      } else {
        bodyData.stockName = warehouseListRes.returnData.id;
        bodyData.stockName_name = warehouseListRes.returnData.name;
      }
      //左右眼RL
      if (bodyData.define5 != null && bodyData.define5.length > 3) {
        throw new Error("【左右眼RL】字段长度不可大于3!异常数据为：" + bodyData.define5);
      }
      //单据日期、计划发货日期比较
      let date1 = new Date(requestData.vouchdate);
      let date2 = new Date(bodyData.consignTime);
      if (date1 > date2) {
        throw new Error("计划发货日期应该大于等于单据日期！");
      }
    }
    var object = {};
    for (var key in requestData) {
      if (key != "orderDetails") {
        object[key] = requestData[key];
      }
    }
    object.salesAdvanceOrder_bList = requestData.orderDetails;
    var res = ObjectStore.insert("GT80266AT1.GT80266AT1.salesAdvanceOrder", object, "34d58361");
    return res;
  }
}
exports({ entryPoint: MyAPIHandler });