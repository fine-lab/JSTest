let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //差异单表单编码
    let template_code = "424b25a4";
    //差异单的数据模型表名
    let chayi_table_name = "GT13847AT1.GT13847AT1.zc_diaobochayi";
    let myYonqlUtil = new Object();
    //定义一些查询函数
    {
      myYonqlUtil.queryStoreInByCode = function (code) {
        let sql = " select * from st.storein.StoreIn where code = '" + code + "'";
        var res = ObjectStore.queryByYonQL(sql, "ustock");
        return res;
      };
    }
    var diaoru_code_array = request.diaoru_code_array;
    var code = "";
    for (let i = 0; i < diaoru_code_array.length; i++) {
      if (i == 0) {
        code = "'" + diaoru_code_array[0].code + "'";
      } else {
        code = code + "," + "'" + diaoru_code_array[i].code + "'";
      }
    }
    let query_chayidan_sql = " select * from " + chayi_table_name + " where from_bill in (" + code + ")";
    var res_select = ObjectStore.queryByYonQL(query_chayidan_sql);
    let res = {
      code: 0,
      message: "未查询到相应差异单数据，可直接弃审",
      des: "",
      data: {
        query_chayidan_sql: query_chayidan_sql,
        res_select: res_select
      }
    };
    if (res_select <= 0) {
      res.code = 0;
      res.message = "没有相应差异单";
    } else {
      //接着检查差异单是否生成凭证，如有凭证，禁止删除，没有删除相应的差异单
      for (let i = 0; i < res_select.length; i++) {
        let is_exit_pingzheng = res_select[i].asdf;
        if (is_exit_pingzheng) {
          res.message = "单据号" + res_select[i].code + "的单据存在相应凭证，不能弃审";
          return res;
        }
      }
      //删除相应的差异单
      for (let i = 0; i < res_select.length; i++) {
        var object = { id: res_select[i].id };
        var res_tmp = ObjectStore.deleteById(chayi_table_name, object, template_code);
      }
    }
    res = {
      code: 0,
      message: "相应差异单数据已删除",
      des: "",
      data: {
        res_select: res_select
      }
    };
    return res;
  }
}
exports({ entryPoint: MyAPIHandler });