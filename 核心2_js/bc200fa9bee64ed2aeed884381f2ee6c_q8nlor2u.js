let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let code_array = request.code_array;
    let result = {
      code: 200,
      message: "未找到下游单据,可以进行反审",
      data: {
        parm: request
      }
    };
    let diaoru_code = code_array;
    let func1 = extrequire("AT15CFB6F808300003.zcPeizhi.myconfig");
    let config = func1.execute();
    let table_chayi_main = config.table_config.chayi_main_uri;
    let mcode_chayi_list = config.model_template_config.mcode_chayi_list;
    let str_in_code = "(";
    for (let i = 0; i < diaoru_code.length; i++) {
      if (i == 0) {
        str_in_code = str_in_code + "'" + diaoru_code[i] + "'";
      } else {
        str_in_code = str_in_code + ", '" + diaoru_code[i] + "'";
      }
      str_in_code = str_in_code + ")";
    }
    //根据id查询相关调入差异单,查询主表
    var chayi_mian = ObjectStore.queryByYonQL("select * from " + table_chayi_main + " where diaoru_code in " + str_in_code);
    if (chayi_mian.length == 0) {
      return result;
    } else {
      result.data.chayi_mian = chayi_mian;
      for (let i = 0; i < chayi_mian.length; i++) {
        let verifystate = chayi_mian[i].verifystate;
        if (verifystate != 0) {
          let result = {
            code: -1,
            message: "单号" + chayi_mian[i].diaoru_code + "调入单 生成的下游单据差异单" + chayi_mian[i].code + " 已经审核，不能弃审该调入单"
          };
          return result;
        }
      }
      result.message = "";
      //删除未生审核差异单数据
      for (let i = 0; i < chayi_mian.length; i++) {
        var res = ObjectStore.deleteById(table_chayi_main, { id: chayi_mian[i].id }, mcode_chayi_list);
        result.message = result.message + " 已删除单号" + chayi_mian[i].code + "差异单";
      }
    }
    return result;
  }
}
exports({ entryPoint: MyAPIHandler });