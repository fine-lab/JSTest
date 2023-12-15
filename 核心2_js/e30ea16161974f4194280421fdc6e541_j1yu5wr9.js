let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let ybresults = request.data;
    let func1 = extrequire("GT46163AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(request);
    let token = res.access_token;
    let reqsaveurl = "https://www.example.com/" + token;
    let reqwlListurl = "https://www.example.com/" + token;
    let contenttype = "application/json;charset=UTF-8";
    let message = "";
    let header = {
      "Content-Type": contenttype
    };
    let isSuccess = true;
    for (var i = 0; i < ybresults.length; i++) {
      let param = ybresults[i];
      //根据物料编码查询物料相关信息
      let wlbody = {
        pageIndex: 0,
        pageSize: 0,
        code: param.wl_code
      };
      let rst = "";
      let wlcustResponse = postman("POST", reqwlListurl, JSON.stringify(header), JSON.stringify(wlbody));
      let wlcustresponseobj = JSON.parse(wlcustResponse);
      if ("200" == wlcustresponseobj.code) {
        rst = wlcustresponseobj.data;
      }
      var unitId = "";
      var rateId = "";
      let xqparam = rst.recordList;
      for (var j = 0; j < xqparam.length; j++) {
        if (xqparam[j].code === param.wl_code) {
          unitId = xqparam[j].detail.purchaseUnit;
          rateId = xqparam[j].detail.inTaxrate;
        }
      }
      let requniturl = "https://www.example.com/" + token + "&id=" + unitId;
      let xqrst = "";
      let unitResponse = postman("GET", requniturl, JSON.stringify(header), null);
      let unitresxqponseobj = JSON.parse(unitResponse);
      if ("200" == unitresxqponseobj.code) {
        xqrst = unitresxqponseobj.data;
      }
      let reqrateurl = "https://www.example.com/" + token + "&id=" + rateId;
      let raterst = "";
      let rateResponse = postman("GET", reqrateurl, JSON.stringify(header), null);
      let rateresponseobj = JSON.parse(rateResponse);
      if ("200" == rateresponseobj.code) {
        raterst = rateresponseobj.data;
      }
      var body = {
        data: {
          id: "",
          organizationCode: param.org_code,
          organizationId: "",
          adjustPriceDepartmentCode: param.adjust_dept_code === undefined ? "" : param.adjust_dept_code,
          adjustPriceDepartmentId: "",
          adjustPricePersonCode: param.adjust_people_code === undefined ? "" : param.adjust_people_code,
          adjustPricePersonId: "",
          priceFlag: 1,
          supplyType: 0,
          vouchdate: param.adjust_date,
          code: param.code,
          bustype_code: "A80A",
          bustype: "2373135716029191",
          remark: "备注",
          businessType: 0,
          adjustpricedetail: [
            {
              vendorCode: param.vendor_code,
              vendorId: "",
              //物料单位
              productUnitCode: xqrst.code,
              productUnitId: "",
              currency_code: "CNY",
              currency: "",
              taxRateCode: param.shuimu_code === undefined ? raterst.code : param.shuimu_code,
              taxRateId: raterst.id,
              productCode: param.wl_code,
              product: "",
              oriUnitPrice: param.wushuidanjia,
              taxRate: param.shuilv == "" || param.shuilv == undefined ? raterst.ntaxrate : param.shuilv,
              productskuCode: param.wuliaoskubianma,
              productsku: "",
              quantityStart: param.shuliangqi,
              //含税单价
              oriTaxUnitPrice: param.hanshuidanjia,
              effectiveDate: param.shengxiaoriqi,
              _status: "Insert",
              quantityEnd: param.shuliangzhi,
              oriTaxUnitPriceOriginal: param.hanshuidanjia,
              oriUnitPriceOriginal: param.wushuidanjia,
              expiryDate: param.ziduan22 === undefined ? "" : param.ziduan22
            }
          ],
          applicableorganization: [
            {
              organizationCode: param.org_code,
              organizationId: "",
              _status: "Insert"
            }
          ],
          _status: "Insert"
        }
      };
      var custResponse = postman("post", reqsaveurl, JSON.stringify(header), JSON.stringify(body));
      var custresponseobj = JSON.parse(custResponse);
      if ("200" == custresponseobj.code) {
        var data = custresponseobj.data;
        var updateObject = { id: param.id, isdown: "1" };
        ObjectStore.updateById("GT46163AT1.GT46163AT1.price_adjust_yz", updateObject);
      } else {
        isSuccess = false;
        continue;
        message = custresponseobj;
      }
    }
    return { isSuccess: isSuccess, message: message };
  }
}
exports({ entryPoint: MyAPIHandler });