let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let base_path = "https://www.example.com/";
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    var body = {
      pageIndex: "1",
      pageSize: "10"
    };
    let func1 = extrequire("GT32330AT9.backDefaultGroup.getReceipt");
    let res = func1.execute(request);
    var token = res.access_token;
    //请求数据
    let apiResponse = postman("post", base_path.concat("?access_token=" + token), JSON.stringify(header), JSON.stringify(body));
    //拿到对象放到集合里，遍历存到实体里。
    let apiResponseJosn = JSON.parse(apiResponse);
    var receivebillList = apiResponseJosn.data;
    //以下集合要做遍历，最好加个if判断和加个按钮功能
    if (null == receivebillList) {
      return "抱歉信息错误!!";
    }
    for (var i = 0; i < receivebillList.recordList.length; i++) {
      var receivebill = receivebillList.recordList[i];
      //拼接实体需要的信息
      //保存收款信息到实体，要加载每个字段
      var object = {
        kj: receivebill.accentity_name,
        danjuriqi: substring(receivebill.vouchdate, 0, 10),
        danjubianhao: receivebill.code,
        kehu: receivebill.customer_name,
        fukuanyinxingzhanghu: receivebill.enterprisebankaccount_name,
        jiesuanfangshi: receivebill.settlemode_name,
        periodCode: receivebill.period_code,
        jiaoyileixing: receivebill.tradetype_name,
        bizhong: receivebill.currency_name,
        huilvleixing: receivebill.exchangeRateType_name,
        huilv: receivebill.exchRate,
        shoukuanjine: receivebill.oriSum,
        benbijine: receivebill.natSum,
        yue: receivebill.balance,
        yuzhanyongjine: receivebill.bookAmount,
        xiaoshouzuzhi: receivebill.org_name,
        bumen: receivebill.dept_name,
        yewuyuan: receivebill.operator_name,
        dingdanbianhao: receivebill.orderno,
        xiangmu: receivebill.project,
        hexiaozhuangtai: receivebill.writeoffstatus,
        pingzhengzhuangtai: receivebill.voucherstatus,
        benbiyue: receivebill.localbalance,
        shixiangleixing: receivebill.basebilltype,
        danjuzhuangtai: receivebill.auditstatus,
        kehuid: receivebill.customer
      };
      ObjectStore.insert("GT32330AT9.GT32330AT9.get_shoukuandan", object, "b5bf4eae");
    }
    return { res: apiResponseJosn };
  }
}
exports({ entryPoint: MyAPIHandler });