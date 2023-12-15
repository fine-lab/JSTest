let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var ybresults = request.data;
    var id = ybresults[0].id;
    let func1 = extrequire("GT46163AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(request);
    var token = res.access_token;
    var deptId = request;
    var sql = "select * from GT46163AT1.GT46163AT1.price_adjust_wl where dr=0 and price_adjust_id=" + id;
    var wl = ObjectStore.queryByYonQL(sql);
    var reqsaveurl = "https://www.example.com/" + token;
    var contenttype = "application/json;charset=UTF-8";
    var message = "";
    var header = {
      "Content-Type": contenttype
    };
    var param = ybresults[0];
    var wlxq = wl[0];
    var jinhuojia = wlxq.jinhuojia === undefined ? 0.0 : wlxq.jinhuojia;
    var fanli = wlxq.fanli === undefined ? 0.0 : wlxq.fanli;
    var tijiachajia = wlxq.tijiachajia === undefined ? 0.0 : wlxq.tijiachajia;
    var hanshuijiage = jinhuojia - fanli + tijiachajia;
    var body = {
      data: {
        id: id,
        organizationCode: param.org_code,
        organizationId: param.org_name,
        adjustPriceDepartmentCode: "",
        adjustPriceDepartmentId: param.adjust_dept,
        adjustPricePersonCode: "",
        adjustPricePersonId: param.adjust_people,
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
            vendorCode: wlxq.vendor_code,
            vendorId: wlxq.Vendor,
            //物料单位
            productUnitCode: wlxq.zhujiliangbianma,
            productUnitId: "",
            currency_code: "CNY",
            currency: wlxq.bizhong,
            taxRateCode: wlxq.shuimu_code,
            taxRateId: wlxq.shuimubianma,
            productCode: wlxq.wl_code,
            product: wlxq.wuliao,
            oriUnitPrice: wlxq.wushuidanjia,
            taxRate: wlxq.shuilv,
            productskuCode: "SKU0001",
            productsku: 2145425650274560,
            quantityStart: wlxq.shuliangqi,
            //含税单价
            oriTaxUnitPrice: hanshuijiage,
            effectiveDate: wlxq.shengxiaoriqi,
            _status: "Insert",
            quantityEnd: wlxq.shuliangzhi,
            oriTaxUnitPriceOriginal: hanshuijiage,
            oriUnitPriceOriginal: wlxq.wushuidanjia,
            expiryDate: wlxq.ziduan22
          }
        ],
        applicableorganization: [
          {
            organizationCode: param.org_code,
            organizationId: param.org_name,
            _status: "Insert"
          }
        ],
        _status: "Insert"
      }
    };
    var custResponse = postman("post", reqsaveurl, JSON.stringify(header), JSON.stringify(body));
    var custresponseobj = JSON.parse(custResponse);
    if ("200" == custresponseobj.code) {
      let data = custresponseobj.data;
      let updateObject = { id: id, shifuxiatui: "1" };
      ObjectStore.updateById("GT46163AT1.GT46163AT1.price_adjust", updateObject);
    }
    return { data: custresponseobj, body: body, wl: wl };
  }
}
exports({ entryPoint: MyAPIHandler });