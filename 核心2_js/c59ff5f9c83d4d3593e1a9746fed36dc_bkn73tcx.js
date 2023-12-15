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
    // 根据合同编号查询项目（判断是否为总包干合同）
    let sqlxmdetail = "select id,classifyid from bd.project.ProjectVO where dr=0 and code='" + bg.ziduan2 + "'";
    // 根据合同编号查询项目金额等详细信息（部门金额等生成应收事项）
    let sqlxm =
      "select defineCharacter.attrext2 define2,defineCharacter.attrext6 define6,defineCharacter.attrext7 define7,defineCharacter.attrext8 define8,defineCharacter.attrext9 define9,defineCharacter.attrext10 define10,defineCharacter.attrext14 define12,defineCharacter.attrext15 define13 from bd.project.ProjectVO where code='" +
      bg.ziduan2 +
      "'";
    var resxm = ObjectStore.queryByYonQL(sqlxm, "ucfbasedoc"); // 根据合同编号查询项目金额等详 细信息
    var resxmdetail = ObjectStore.queryByYonQL(sqlxmdetail, "ucfbasedoc"); // 根据合同编号查询项目（判断是否为总包干合同）
    if (resxm.length > 0 && resxmdetail.length > 0) {
      let defines = resxm[0];
      // 查询客户
      let sqlkh = "select id from aa.merchant.Merchant where name='" + resxm[0].define2 + "'";
      var reskh = ObjectStore.queryByYonQL(sqlkh, "productcenter");
      if (reskh.length > 0) {
        // 查询部门
        let sql = "select dept_code from GT59740AT1.GT59740AT1.deptConfig where dr=0 and sh_dept_code='" + bg.dept_code + "'";
        var deptCodeRes = ObjectStore.queryByYonQL(sql);
        if (deptCodeRes.length > 0) {
          let money = 0.0;
          //判断是否为总包干合同
          if (resxmdetail[0].classifyid == "2710655493510400") {
            // 是总包干合同
            let sqlbg1 = "";
            let sqlbg2 = "";
            if (bg.dept_code == "D") {
              sqlbg1 =
                "select isEnd from GT59740AT1.GT59740AT1.RJ001 where dr=0 and ziduan2='" +
                bg.ziduan2 +
                "'" +
                " and dept_name like '材料部' and document_status in ('3','4')  and update_data leftlike '" +
                qianshouri +
                "'";
              sqlbg2 =
                "select isEnd from GT59740AT1.GT59740AT1.RJ001 where dr=0 and ziduan2='" +
                bg.ziduan2 +
                "'" +
                " and dept_name like '材料部' and document_status in ('1','2') and qianshouri leftlike '" +
                qianshouri +
                "'";
            } else {
              sqlbg1 =
                "select isEnd from GT59740AT1.GT59740AT1.RJ001 where dr=0 and ziduan2='" +
                bg.ziduan2 +
                "'" +
                " and dept_code='" +
                bg.dept_code +
                "'  and document_status in ('3','4') and update_data leftlike '" +
                qianshouri +
                "'";
              sqlbg2 =
                "select isEnd from GT59740AT1.GT59740AT1.RJ001 where dr=0 and ziduan2='" +
                bg.ziduan2 +
                "'" +
                " and dept_code='" +
                bg.dept_code +
                "'  and document_status in ('1','2') and qianshouri leftlike '" +
                qianshouri +
                "'";
            }
            let resSqlbg1 = ObjectStore.queryByYonQL(sqlbg1, "developplatform");
            let resSqlbg2 = ObjectStore.queryByYonQL(sqlbg2, "developplatform");
            var resbg = new Array();
            resSqlbg1.forEach((item) => {
              resbg.push(item);
            });
            resSqlbg2.forEach((item) => {
              resbg.push(item);
            });
            let isys = false;
            if (resbg.length > 0) {
              a: for (let k = 0; k < resbg.length; k++) {
                if (resbg[k].isEnd == "1") {
                  if (bg.dept_code == "A1") {
                    money = defines.define7 != undefined ? defines.define7 : 0.0;
                  } else if (bg.dept_code == "D") {
                    money = defines.define8 != undefined ? defines.define8 : 0.0;
                  } else if (bg.dept_code == "B") {
                    money = defines.define9 != undefined ? defines.define9 : 0.0;
                  } else if (bg.dept_code == "C") {
                    money = defines.define10 != undefined ? defines.define10 : 0.0;
                  } else if (bg.dept_code == "A2") {
                    money = defines.define12 != undefined ? defines.define12 : 0.0;
                  } else if (bg.dept_code == "F") {
                    // 路桥部
                    money = defines.define13 != undefined ? defines.define13 : 0.0;
                  }
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
            // 不是包干合同，直接用汇总好的金额生成应收
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
                message: "合同" + bg.ziduan2 + "对应月" + vouchdate + "报告生成应收单失败,失败原因：" + data.messages[0]
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