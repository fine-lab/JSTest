let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func = extrequire("GT99994AT1.api.getWayUrl");
    let funcres = func.execute(null);
    var httpurl = funcres.gatewayUrl;
    let func1 = extrequire("GT99994AT1.frontDesignerFunction.getApiToken");
    let res = func1.execute(null);
    let token = res.access_token;
    let yssxSaveurl = httpurl + "/yonbip/fi/oar/save?access_token=" + token;
    let contenttype = "application/json;charset=UTF-8";
    let message = "";
    let header = {
      "Content-Type": contenttype
    };
    let bg = request.bg;
    let qianshouri = request.qianshouri;
    qianshouri = substring(qianshouri, 0, 7);
    let vouchdate = getCurrentMonthLast(qianshouri);
    let saveResult = {};
    let sqlxmdetail = "select id,classifyid from bd.project.ProjectVO where dr=0 and code='" + bg.ziduan2 + "'";
    let sqlxm = "select defineCharacter.attrext2 define2,defineCharacter.attrext6 define6 from bd.project.ProjectVO where code='" + bg.ziduan2 + "'";
    var resxm = ObjectStore.queryByYonQL(sqlxm, "ucfbasedoc");
    var resxmdetail = ObjectStore.queryByYonQL(sqlxmdetail, "ucfbasedoc");
    if (resxm.length > 0 && resxmdetail.length > 0) {
      let defines = resxm[0];
      let sqlkh = "select id from aa.merchant.Merchant where name='" + resxm[0].define2 + "'";
      var reskh = ObjectStore.queryByYonQL(sqlkh, "productcenter");
      if (reskh.length > 0) {
        let sql = "select dept_code from GT59740AT1.GT59740AT1.deptConfig where dr=0 and sh_dept_code='" + bg.dept_code + "'";
        var deptCodeRes = ObjectStore.queryByYonQL(sql);
        if (deptCodeRes.length > 0) {
          let money = 0.0;
          //判断是否为总包干合同
          if (resxmdetail[0].classifyid == "2710655493510400") {
            let sqlbg = "select isEnd from GT59740AT1.GT59740AT1.RJ001 where ziduan2='" + bg.ziduan2 + "'";
            let resbg = ObjectStore.queryByYonQL(sqlbg, "developplatform");
            let isys = false;
            if (resbg.length > 0) {
              a: for (let k = 0; k < resbg.length; k++) {
                if (resbg[k].isEnd == "1") {
                  money = defines.define6;
                  isys = true;
                  break a;
                }
              }
            }
            if (!isys) {
              saveResult = {
                code: "999",
                message: "合同" + bg.ziduan2 + "对应月" + vouchdate + "报告未完结,不可生成应收"
              };
              return { saveResult };
            }
          } else {
            money = bg.baogaojine;
          }
          let oarDetailList = [];
          let oarDetail = {
            taxRate: 6,
            oriSum: money,
            oriMoney: MoneyFormatReturnBd(money / 1.06, 2),
            natMoney: MoneyFormatReturnBd(money / 1.06, 2),
            natSum: money,
            _status: "Insert"
          };
          oarDetailList.push(oarDetail);
          let yssxBody = {
            data: {
              accentity_code: "RJ",
              vouchdate: vouchdate,
              billtype: "2",
              basebilltype_code: "arap_oar",
              tradetype_code: "SH",
              exchRate: 1,
              exchangeRateType_code: "01",
              currency_name: "人民币",
              customer: reskh[0].id,
              customer_name: resxm[0].define2,
              project_code: bg.ziduan2,
              dept_code: deptCodeRes[0].dept_code,
              oriSum: money,
              natSum: money,
              _status: "Insert",
              oarDetail: oarDetailList
            }
          };
          let yssxResponse = postman("POST", yssxSaveurl, JSON.stringify(header), JSON.stringify(yssxBody));
          let yssxresponseobj = JSON.parse(yssxResponse);
          if ("200" == yssxresponseobj.code) {
            //更新报告应收
            let data = yssxresponseobj.data;
            if (data.sucessCount === 1) {
              saveResult = {
                code: "200",
                message: "合同" + bg.ziduan2 + "对应月" + vouchdate + "报告生成应收单成功"
              };
            } else {
              saveResult = {
                code: "999",
                message: "合同" + bg.ziduan2 + "对应月" + vouchdate + "报告生成应收单失败"
              };
            }
          } else {
            saveResult = {
              code: "999",
              message: "合同" + bg.ziduan2 + "对应月" + vouchdate + "所有报告已生成应收单异常"
            };
          }
        } else {
          saveResult = {
            code: "999",
            message: "合同" + bg.ziduan2 + "对应部门" + bg.dept_code + "在YS未找到关联部门"
          };
        }
      } else {
        saveResult = {
          code: "999",
          message: "合同" + bg.ziduan2 + "对应的项目档案中委托单位在客户档案中未找到"
        };
      }
    } else {
      saveResult = {
        code: "999",
        message: "合同" + bg.ziduan2 + "合同编号在项目档案中未找到"
      };
    }
    return { saveResult };
    function getCurrentMonthLast(datestr) {
      var date = new Date(datestr);
      var currentMonth = date.getMonth();
      var nextMonth = ++currentMonth;
      var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
      var oneDay = 1000 * 60 * 60 * 24;
      var lastTime = new Date(nextMonthFirstDay - oneDay);
      var month = parseInt(lastTime.getMonth() + 1);
      var day = lastTime.getDate();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      return date.getFullYear() + "-" + month + "-" + day;
    }
  }
}
exports({ entryPoint: MyAPIHandler });