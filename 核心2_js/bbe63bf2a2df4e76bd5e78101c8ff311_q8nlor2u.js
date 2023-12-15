let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let code_array = request.code_array;
    let access_token = request.access_token;
    let my_util = new Object();
    {
      my_util.queryPz = function (param) {
        let func1 = extrequire("AT15CFB6F808300003.zcUtil.postOpenApi");
        let res = func1.execute(param);
        return res;
      };
      //查询组织对应的账簿
      my_util.getAccbookCode = function (orgid) {
        let sql = "select * from 	bd.virtualaccbody.VirtualAccbody where id='" + orgid + "'";
        let res = ObjectStore.queryByYonQL(sql, "finbd");
        if (res.length > 0) {
          return res[0].code;
        } else {
          return "";
        }
      };
      my_util.updatePzStatus = function (param) {
        let id = param.id;
        let pingzheng_status = param.pingzheng_status;
        let pingzheng_code = param.pingzheng_code;
        var object = { id: id, pingzheng_status: pingzheng_status + "", pingzheng_code: pingzheng_code + "" };
        var res = ObjectStore.updateById("AT15CFB6F808300003.AT15CFB6F808300003.zc_daiobochayi", object, "eab1692d");
        return res;
      };
    }
    let func1 = extrequire("AT15CFB6F808300003.zcPeizhi.myconfig");
    let config = func1.execute();
    let table_config = config.table_config;
    let table_chayi_main = table_config.chayi_main_uri;
    let table_chayi_sub = table_config.chayi_sub_uri;
    let result = {};
    for (let i = 0; i < code_array.length; i++) {
      let res_main = ObjectStore.queryByYonQL("select * from " + table_chayi_main + " where code = " + code_array[i]);
      if (res_main.length != 0) {
        let accbookCode = my_util.getAccbookCode(res_main[0].org_id);
        let pingzheng_code = res_main[0].pingzheng_code;
        if (pingzheng_code != null && pingzheng_code != "") {
          var query_pz_parm = {
            url: "https://www.example.com/",
            param: {
              accbookCode: accbookCode,
              billcodeMin: pingzheng_code,
              billcodeMax: pingzheng_code
            },
            access_token: access_token
          };
          let queryPz_result = my_util.queryPz(query_pz_parm);
          if (queryPz_result.code == 200) {
            let pz_array = queryPz_result.data.recordList;
            if (pz_array.length > 0) {
              result = {
                code: -3,
                message: "单号 " + res_main[0].code + "相应差异单已生成凭证,不能弃审",
                pz_array: pz_array
              };
              return result;
            } else {
              let updateParm = {
                id: res_main[0].id,
                pingzheng_status: 0,
                pingzheng_code: ""
              };
              result.updateParm = updateParm;
              my_util.updatePzStatus(updateParm);
            }
          }
        }
      }
    }
    result = { code: 200, message: "可以进行弃审" };
    return result;
  }
}
exports({ entryPoint: MyAPIHandler });