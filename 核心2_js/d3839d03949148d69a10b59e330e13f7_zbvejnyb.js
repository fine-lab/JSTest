let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var id = param.data[0].id;
    var xainxuid = " select * from GT64724AT4.GT64724AT4.Playwithdetail where id='" + id + "'";
    var xiangmu12 = ObjectStore.queryByYonQL(xainxuid);
    var xiangmubianhao = xiangmu12[0].xiangmubianhao;
    var gongyingshangbianma_code = xiangmu12[0].gongyingshangbianma;
    var xiangid = xiangmu12[0].id;
    var shuidian1;
    var shijicaigoujiage1;
    //实际采购价格
    shijicaigoujiage1 = xiangmu12[0].shijicaigoujiage;
    //税点
    shuidian1 = xiangmu12[0].shuidian1;
    if (shijicaigoujiage1 == null) {
      shijicaigoujiage1 = 0;
    }
    if (shuidian1 == null) {
      shuidian1 = 0;
    }
    // 采购税费折扣
    var caigoushuifeidikou12 = shijicaigoujiage1 * shuidian1 * 0.01;
    var zhangqi = " select sum(caiwudakuanjine) caiwudakuanjine,sum(dakuanjine) dakuanjine from GT64724AT4.GT64724AT4.zhangqi where Playwithdetail_id='" + xiangid + "'";
    var reszhangqi = ObjectStore.queryByYonQL(zhangqi);
    // 计算申请打款金额汇总
    var shenqing;
    // 计算已付金额汇总
    var yifu;
    if (reszhangqi.length > 0) {
      shenqing = reszhangqi[0].caiwudakuanjine;
      yifu = reszhangqi[0].dakuanjine;
    } else {
      shenqing = 0;
      yifu = 0;
    }
    // 计算未付金额
    var weifu;
    weifu = shijicaigoujiage1 - yifu;
    if (weifu == null) {
      weifu = 0;
    }
    let func1 = extrequire("GT64724AT4.backDefaultGroup.token");
    let resxiangmu = func1.execute(param);
    let token = resxiangmu.access_token;
    //根据项目编码查询物料相关信息
    let reqwlListurl = "https://www.example.com/" + token + "&id=" + xiangmubianhao;
    let contenttype = "application/json;charset=UTF-8";
    let message = "";
    let header = {
      "Content-Type": contenttype
    };
    let xiangmurst = "";
    let xiangmumingcheng = "";
    let custResponse = postman("GET", reqwlListurl, JSON.stringify(header), JSON.stringify(null));
    let custresponseobj = JSON.parse(custResponse);
    if ("200" == custresponseobj.code) {
      xiangmurst = custresponseobj.data;
      xiangmumingcheng = xiangmurst.name.zh_CN;
    } else {
      throw new Error("未查询到项目档案中" + contenttype + "项目编码");
    }
    //根据供应商编码查询物料相关信息
    let reqwlListurl1 = "https://www.example.com/" + token + "&id=" + gongyingshangbianma_code;
    let contenttype1 = "application/json;charset=UTF-8";
    let header1 = {
      "Content-Type": contenttype1
    };
    let gongyingshangrst = "";
    let gongyingshangName = "";
    let custResponse1 = postman("GET", reqwlListurl1, JSON.stringify(header1), JSON.stringify(null));
    let custresponseobj1 = JSON.parse(custResponse1);
    if ("200" == custresponseobj1.code) {
      gongyingshangrst = custresponseobj1.data;
      gongyingshangName = gongyingshangrst.name.zh_CN;
    } else {
      throw new Error("未在供应商档案中查询到" + contenttype1 + "此编码供应商");
    }
    // 更新项目执行明细
    var updateWrapperzhang = new Wrapper();
    updateWrapperzhang.eq("id", xiangid);
    var toUpdatezhang = { charuziduan37: shenqing, ziduan28: yifu, xiangmu: xiangmumingcheng, gongyingshangmingcheng: gongyingshangName, caigoushuifeidikou: caigoushuifeidikou12, weifujine: weifu };
    var updatereszhangqi = ObjectStore.update("GT64724AT4.GT64724AT4.Playwithdetail", toUpdatezhang, updateWrapperzhang, "1cffde62");
    var sql =
      "select sum(shijihezuojine),sum(shijicaigoujiage),sum(ziduan34),sum(xiaoguochengben),sum(caigoushuifeidikou) from GT64724AT4.GT64724AT4.Playwithdetail where dr=0 and xiangmubianhao='" +
      xiangmubianhao +
      "'";
    var res = ObjectStore.queryByYonQL(sql);
    return {};
  }
}
exports({ entryPoint: MyTrigger });