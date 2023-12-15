let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var body = {
      pageIndex: "1",
      pageSize: 500
    };
    var requst = { uri: "/yonbip/digitalModel/staff/list", body: body };
    let func1 = extrequire("GT34544AT7.common.baseOpenApi");
    let res = func1.execute(requst);
    var result = [];
    var c = res.res.pageCount;
    for (i = 0; i < c; i++) {
      var body2 = {
        pageIndex: i,
        pageSize: 500
      };
      var requst2 = { uri: "/yonbip/digitalModel/staff/list", body: body };
      let func2 = extrequire("GT34544AT7.common.baseOpenApi");
      let res2 = func1.execute(requst);
      var common = res2.res.data.recordList;
      for (var i in common) {
        //替换键userId
        if (common[i].hasOwnProperty("user_id")) {
          common[i]["userId"] = common[i]["user_id"];
          delete common[i]["user_id"];
        }
        //替换键userName
        if (common[i].hasOwnProperty("name")) {
          common[i]["userName"] = common[i]["name"];
          delete common[i]["name"];
        }
        //替换键userMobile
        if (common[i].hasOwnProperty("mobile")) {
          common[i]["userMobile"] = common[i]["mobile"];
          delete common[i]["mobile"];
        }
        //替换键id
        if (common[i].hasOwnProperty("id")) {
          common[i]["staff_id"] = common[i]["id"];
          delete common[i]["id"];
        }
        //替换键code
        if (common[i].hasOwnProperty("code")) {
          common[i]["staff_code"] = common[i]["code"];
          delete common[i]["code"];
        }
        //替换键org_id
        if (common[i].hasOwnProperty("org_id")) {
          common[i]["staff_org_id"] = common[i]["org_id"];
          delete common[i]["org_id"];
        }
        //替换键org_id_name
        if (common[i].hasOwnProperty("org_id_name")) {
          common[i]["staff_org_name"] = common[i]["org_id_name"];
          delete common[i]["org_id_name"];
        }
        //替换键dept_id
        if (common[i].hasOwnProperty("dept_id")) {
          common[i]["staff_dept_id"] = common[i]["dept_id"];
          delete common[i]["dept_id"];
        }
        //替换键dept_id
        if (common[i].hasOwnProperty("dept_id_name")) {
          common[i]["staff_dept_name"] = common[i]["dept_id_name"];
          delete common[i]["dept_id_name"];
        }
        //替换键email
        if (common[i].hasOwnProperty("email")) {
          common[i]["userEmail"] = common[i]["email"];
          delete common[i]["email"];
        }
        //删除pubts
        if (common[i].hasOwnProperty("pubts")) {
          delete common[i]["pubts"];
        }
        result.push(common[i]);
      }
    }
    return result;
  }
}
exports({ entryPoint: MyTrigger });