let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //公共变量定义
    let sql = ""; //待执行的SQL语句
    let url = ""; //待调用接口地址
    let body = ""; //接口调用入参
    let httpURL = "https://c2.yonyoucloud.com"; //域名升级，世贸生产域名变量
    sql = "select distinct orderCode,orderId from usp.signconfirmation.SignConfirmations where mainid.status=0";
    let resDismiss = ObjectStore.queryByYonQL(sql, "uscmpub");
    for (let i = 0; i < resDismiss.length; i++) {
      sql =
        "select orderId.code,orderId.headFreeItem.define13,sum(subQty),sum(oriSum) from voucher.order.OrderDetail where orderId.id = '" +
        resDismiss[i].orderId +
        "' group by orderId.code,orderId.headFreeItem.define13"; //
      let resOrder = ObjectStore.queryByYonQL(sql, "udinghuo");
      if (resOrder.length > 0 && resOrder[0].orderId_headFreeItem_define13 != undefined && resOrder[0].orderId_headFreeItem_define13 == "已生成") {
        //通过订单编号查询凭证信息
        //通过订单编号查询凭证信息
        let sqlvid = "select voucherId from egl.voucher.VoucherBodyBO where description like '" + resOrder[0].orderId_code + "'";
        let resvid = ObjectStore.queryByYonQL(sqlvid, "yonbip-fi-egl");
        if (apiResJson.code == 200) {
          let voucherId = resvid[0].voucherId;
          //删除凭证
          url = httpURL + "/iuap-api-gateway/yonbip/fi/voucher/del";
          body = { ids: [voucherId] }; //请求参数
          apiResponse = openLinker("POST", url, "AT17C47D1409580006", JSON.stringify(body));
        }
      }
      //自定义项初始值
      let sDefine14 = ""; //签收状态：未签收，已签收
      let sDefine12 = ""; //签收日期
      let sDefine16 = ""; //签收金额
      let sDefine15 = ""; //签收数量
      let sDefine13 = ""; //凭证生成状态：未生成，已生成
      if (resOrder.length > 0) {
        sql = "select orderId,sum(oriSum),sum(receivedQty) from usp.signconfirmation.SignConfirmations where orderId='" + resDismiss[i].orderId + "' and mainid.status=1 group by orderId"; //销售订单id=步骤1中查找到的销售订单id
        let resSign = ObjectStore.queryByYonQL(sql, "uscmpub");
        if (resSign.length > 0) {
          if (resSign[0].oriSum == resOrder[0].oriSum && resSign[0].receivedQty == resOrder[0].subQty) {
            let funFmtDt = extrequire("AT17C47D1409580006.testBackendJS.dateFormatP");
            let sCurrDate = funFmtDt.execute(new Date());
            sDefine14 = "已签收";
            sDefine12 = sCurrDate;
            sDefine16 = resSign[0].oriSum;
            sDefine15 = resSign[0].receivedQty;
            sDefine13 = "未生成";
          } else {
            sDefine14 = "未签收";
            sDefine12 = "";
            sDefine16 = resSign[0].oriSum;
            sDefine15 = resSign[0].receivedQty;
            sDefine13 = "未生成";
          }
        } else {
          sDefine14 = "";
          sDefine12 = "";
          sDefine16 = "";
          sDefine15 = "";
          sDefine13 = "";
        }
        url = httpURL + "/iuap-api-gateway/yonbip/sd/api/updateDefinesInfo";
        body = {
          billnum: "voucher_order",
          datas: [
            {
              id: resDismiss[i].orderId, //步骤1中的销售订单id  -orderId
              code: resDismiss[i].orderCode, //步骤1中的销售订单编号  -orderCode
              definesInfo: [
                {
                  define14: sDefine14,
                  define12: sDefine12,
                  define16: sDefine16,
                  define15: sDefine15,
                  define13: sDefine13,
                  isHead: true,
                  isFree: true
                }
              ]
            }
          ]
        }; //请求参数
        let apiResponse = openLinker("POST", url, "AT17C47D1409580006", JSON.stringify(body)); //TODO：注意填写应用编码
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });