let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var OddNumbers = request.OddNumbers;
    var date = request.Date;
    var dates = substring(date, 0, 7);
    //查询当前期间的组织；根据不同的组织去判断对应的账簿是否存在凭证号
    var mainSql = "select distinct organizationId from AT15F164F008080007.AT15F164F008080007.DetectOrder where dr = 0 and srpingzhenghao = '" + OddNumbers + "' and importData = '" + date + "'";
    var mainRes = ObjectStore.queryByYonQL(mainSql, "developplatform");
    if (mainRes.length == 0) {
      throw "根据当前的凭证号、会计期间查询检测订单为空";
    }
    for (var i = 0; i < mainRes.length; i++) {
      var orgId = mainRes[i].organizationId;
      //查询账簿
      var sampleSql = "select * from	epub.accountbook.AccountBook where accentity = '" + orgId + "'";
      var sampleRes = ObjectStore.queryByYonQL(sampleSql, "fiepub");
      if (sampleRes.length == 0) {
        throw "该单据的收样组织没有配置账簿，请维护";
      }
      //校验凭证号是否存在
      var zhbcode = sampleRes[0].id;
      var sql =
        "select distinct displayName,accBook,periodUnion from egl.voucher.VoucherBO where accBook = '" +
        zhbcode +
        "' and displayName = '记-" +
        OddNumbers +
        "' and periodUnion like '" +
        dates +
        "' order by periodUnion desc";
      var resa = ObjectStore.queryByYonQL(sql, "yonbip-fi-egl");
      if (resa.length != 0) {
        throw new Error("【" + dates + "】收入凭证号在此期间已经存在请删除后再进行清除凭证号!");
      }
    }
    //获取样本编号;
    var ponseSql = "select id,checkStatus from AT15F164F008080007.AT15F164F008080007.DetectOrder where dr = 0 and srpingzhenghao = '" + OddNumbers + "' and importData = '" + date + "'";
    var ponseRes = ObjectStore.queryByYonQL(ponseSql, "developplatform");
    return { codelist: ponseRes };
  }
}
exports({ entryPoint: MyAPIHandler });