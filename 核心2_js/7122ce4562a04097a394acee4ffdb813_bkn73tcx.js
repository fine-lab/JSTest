let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let updateWrapper = new Wrapper();
    updateWrapper.eq("ziduan1", request.project_no);
    updateWrapper.eq("baogaobianma", request.report_no);
    // 待更新字段内容
    let toUpdate = { baogaojine: request.report_money };
    // 执行更新
    let resupdate = ObjectStore.update("GT59740AT1.GT59740AT1.RJ01", toUpdate, updateWrapper, "7b4816ae");
    if (resupdate.length > 0) {
      let res = resupdate[0];
      let func1 = extrequire("GT99994AT1.frontDesignerFunction.getApiToken");
      let resToken = func1.execute();
      let token = resToken.access_token;
      let khUrl = "https://www.example.com/" + token;
      let yssxSaveurl = "https://www.example.com/" + token;
      let xmurl = "https://www.example.com/" + token;
      let contenttype = "application/json;charset=UTF-8";
      let message = "";
      let header = {
        "Content-Type": contenttype
      };
      let xmbody = {
        code: res.ziduan2,
        pageIndex: 1,
        pageSize: 10
      };
      let xmResponse = postman("POST", xmurl, JSON.stringify(header), JSON.stringify(xmbody));
      let xmresponseobj = JSON.parse(xmResponse);
      if ("200" == xmresponseobj.code) {
        let xmrst = xmresponseobj.data;
        let xmrecordList = xmrst.recordList;
        if (xmrecordList.length > 0) {
          let defines = xmrecordList[0].defineCharacter;
          let khbody = {
            "merchantAppliedDetail.stopstatus": false,
            pageIndex: 1,
            pageSize: 10,
            name: defines.attrext2
          };
          let khResponse = postman("POST", khUrl, JSON.stringify(header), JSON.stringify(khbody));
          let khresponseobj = JSON.parse(khResponse);
          if ("200" == khresponseobj.code) {
            let khrst = khresponseobj.data;
            let khrecordList = khrst.recordList;
            if (khrecordList.length > 0) {
              let kh = khrecordList[0];
              let now = new Date();
              //指定几个月后
              var nowstr = now.getFullYear() + "-";
              if (now.getMonth() + 1 < 10) {
                nowstr = nowstr + "0" + (now.getMonth() + 1) + "-";
              } else {
                nowstr = nowstr + (now.getMonth() + 1) + "-";
              }
              if (now.getDate() < 10) {
                nowstr = nowstr + "0" + now.getDate() + " 00:00:00";
              } else {
                nowstr = nowstr + now.getDate() + " 00:00:00";
              }
              let oarDetailList = [];
              let oarDetail = {
                taxRate: 6,
                oriSum: res.baogaojine,
                oriMoney: MoneyFormatReturnBd(res.baogaojine / 1.06, 2),
                natMoney: MoneyFormatReturnBd(res.baogaojine / 1.06, 2),
                natSum: res.baogaojine,
                _status: "Insert"
              };
              oarDetailList.push(oarDetail);
              let yssxBody = {
                data: {
                  code: res.baogaobianma,
                  accentity_code: "001",
                  vouchdate: nowstr,
                  billtype: "2",
                  basebilltype_code: "arap_oar",
                  tradetype_code: "arap_oar_other",
                  exchRate: 1,
                  exchangeRateType_code: "01",
                  currency_name: "人民币",
                  customer: kh.id,
                  customer_name: kh.name,
                  project_code: res.ziduan2,
                  dept_code: res.dept_code,
                  oriSum: res.baogaojine,
                  natSum: res.baogaojine,
                  _status: "Insert",
                  oarDetail: oarDetailList
                }
              };
              let yssxResponse = postman("POST", yssxSaveurl, JSON.stringify(header), JSON.stringify(yssxBody));
              let yssxresponseobj = JSON.parse(yssxResponse);
              if ("200" == yssxresponseobj.code) {
                return { res: "报告金额修改成功,并成功生成应收事项" };
              }
            } else {
              return { res: "合同号对应的项目档案中委托单位在客户档案中未找到", khbody, xmbody, res };
            }
          }
        } else {
          return { res: "合同编号在项目档案中未找到" };
        }
      }
    } else {
      return { res: "该报告未找到" };
    }
  }
}
exports({ entryPoint: MyAPIHandler });