let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let deptCode = request.deptCode; //部门编码
    let tongjiyuefen = request.tongjiyuefen; //统计月份
    let header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    let func = extrequire("GT99994AT1.api.getWayUrl");
    let funcres = func.execute(null);
    var httpurl = funcres.gatewayUrl;
    let func1 = extrequire("GT99994AT1.frontDesignerFunction.getApiToken");
    let res = func1.execute(null);
    let token = res.access_token;
    let url = httpurl + "/yonbip/fi/api/report/allAuxiliaryBalanceQuery?access_token=" + token;
    let arrayDept = new Array();
    let deptUrl = httpurl + "/yonbip/digitalModel/basedoc/dept/list?access_token=" + token;
    let arrayDeptCode = new Array();
    arrayDeptCode.push(deptCode);
    let deptBody = {
      data: {
        code: arrayDeptCode
      }
    };
    let apiDeptResponse = postman("POST", deptUrl, JSON.stringify(header), JSON.stringify(deptBody));
    let apiDeptResponseobj = JSON.parse(apiDeptResponse);
    let datadept = apiDeptResponseobj.data;
    arrayDept.push(datadept[0].id);
    let auxIdsMap = {
      dept: arrayDept
    };
    let body = {
      accbook_id: "youridHere",
      startperiod: substring(tongjiyuefen, 0, 7),
      endperiod: substring(tongjiyuefen, 0, 7),
      auxiliary: "dept",
      auxIdsMap: auxIdsMap,
      startaccsubject: "410101",
      endaccsubject: "410127",
      displayflag: "2",
      page: 1,
      pageSize: 100
    };
    let apiResponse = postman("POST", url, JSON.stringify(header), JSON.stringify(body));
    let apiResponseobj = JSON.parse(apiResponse);
    //人工成本总金额
    let labour = 0;
    //制造费用总金额
    let manufacturer = 0;
    //本期发生额
    if (apiResponseobj.code == "200" && apiResponseobj.data != undefined) {
      let list = apiResponseobj.data.list;
      let aName1 = '{"kemumingcheng":';
      let accsubject2 = "[";
      for (var i = 0; i < list.length; i++) {
        if (list[i].currentperiodamt_fc_debit > 0) {
          let aName = list[i].accsubject_name;
          let deptCode = list[i].accsubject_code;
          let fName = list[i].firstaccsubject_name;
          //本期发生原币贷方金额
          let cCredit = list[i].currentperiodamt_fc_debit;
          if (aName == "工资" || aName == "公积金" || aName == "社保") {
            labour = labour + cCredit;
          } else {
            manufacturer = manufacturer + cCredit;
          }
          let kemumingcheng = fName + "_" + aName;
          accsubject2 += aName1 + '"' + kemumingcheng + '","kemubianma":' + '"' + deptCode + '","dangqifashenge":' + '"' + cCredit + '"}';
          if (i < list.length - 1) {
            accsubject2 += ",";
          }
        }
      }
      if (substring(accsubject2, accsubject2.length - 1, accsubject2.length) == ",") {
        accsubject2 = substring(accsubject2, 0, accsubject2.length - 1);
      }
      let accsubject3 = accsubject2 + "]";
      let result1 = JSON.parse(accsubject3);
      return { result1, labour, manufacturer };
    }
  }
}
exports({ entryPoint: MyAPIHandler });