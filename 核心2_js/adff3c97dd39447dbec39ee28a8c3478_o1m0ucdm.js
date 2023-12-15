let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //手动转换尝试插入  由于时间周期，且本功能是借用的，后期不调整，所以先写死
    //部分数据缺失的情况下用
    //来源系统标识
    let src_syscode = "1";
    if (request.define26 && request.define26 == "3") {
      src_syscode = request.define26;
    }
    //目前接口调用只支持一秒一次
    let object = {
      hetongzhuti: request.orgName, //orgname换成define3
      xjbrzz: request.orgId,
      supplierSupName: request.supplierId,
      lianhedanwei: request.define9,
      hetongmingchen: request.subject,
      hetonjine: request.taxMoney,
      caigouleixing: request.transtypeName,
      caigoubiaode: request.define2,
      billno: request.billno,
      htcreateTime: request.createTime,
      StaffNew: request.purPersonId,
      jingbanrenzuzhi: request.define3, //define3换成orgname
      jingbanrenbumen: request.deptId,
      shouzhifangxiang: request.define15,
      hetongleixing: request.define5,
      gongzhang: request.define6,
      farenzhang: request.define8,
      hetongzhang: request.define7,
      hetongyongyinfenshu: request.define12,
      jingbanshijian: request.subscribedate,
      hetongkaishishijian: request.actualvalidate,
      hetongjieshushijian: request.actualinvalidate,
      zyjjfs: request.define16,
      guanxia: request.define11,
      memo: request.memo,
      htzw: request.internalFileId,
      shiqianshenpiwenjian: request.externalFileId,
      yongyinriqi: request.define13,
      yinzhangguanliyuan: request.define14,
      stockStampFileId: request.stockStampFileId,
      beforeid2: request.beforeid,
      src_syscode: src_syscode,
      verifystate: "2",
      yifukuanjine: 0,
      shengyujine: request.taxMoney
    };
    if (object.hetonjine == null) {
      object.hetonjine = 0;
      object.shengyujine = 0;
    }
    let billno = {
      billno: request.billno
    };
    let backMsg;
    var result = ObjectStore.selectByMap("GT879AT352.GT879AT352.htxqc", billno);
    if (result.length == 0) {
      var x = ObjectStore.insert("GT879AT352.GT879AT352.htxqc", object);
      backMsg = {
        code: "0",
        msg: "插入成功"
      };
    } else {
      backMsg = {
        code: "1",
        msg: "重复插入,请联系管理员或自己去付款合同内删除上一次审批通过同步的付款单"
      };
    }
    return backMsg;
  }
}
exports({ entryPoint: MyAPIHandler });