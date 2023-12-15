let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var merge = request;
    if (null == merge || 0 == merge.length) {
      return;
    }
    var xiaoshoudingdanhao = merge[0].orderCode;
    var deliveryCode = merge[0].deliveryCode;
    var keystr = xiaoshoudingdanhao + deliveryCode;
    var ob = { makeCode: keystr };
    // 查询旧数据
    var res01 = ObjectStore.selectByMap("AT16E453BA16A80002.AT16E453BA16A80002.watchHead", ob);
    var printNumber = null;
    // 删除旧数据
    if (res01.length > 0) {
      printNumber = res01[0].dayincishu;
      var obj = { makeCode: res01[0].makeCode };
      ObjectStore.deleteByMap("AT16E453BA16A80002.AT16E453BA16A80002.watchHead", obj, "SynchronousPrintingList");
    }
    var object = {
      makeCode: keystr, // 组合code
      kehumingchen: merge[0].agentName, // 客户名称
      kehubianma: merge[0].agentCode, // 客户编码
      shouhuodizhi: merge[0].cReceiveAddress, // 收货地址
      shouhuodianhua: merge[0].cReceiveMobile, // 收货电话
      yewuyuan: merge[0].corpContactUserName, // 业务员
      beizhu: merge[0].memo, // 备注
      xiaoshoudingdanhao: xiaoshoudingdanhao, // 销售订单号
      deliveryCode: deliveryCode, // 销售发货单号
      xiaoshouriqi: merge[0].createDate, // 销售日期
      fahuoriqi: merge[0].mainProduceDate, // 发货日期
      // 暂时不取 不存
      dayincishu: printNumber, // 打印次数
      zhidanren: merge[0].creator_a, // 制单人
      jianhuoren: merge[0].creator_b, // 拣货人
      fuheren: merge[0].creator, // 复核人
      fahuoren: merge[0].creator, // 发货人
      surfaceBodyList: merge
    };
    if (null != printNumber) {
      object.dayincishu = String(parseInt(printNumber) + 1);
    } else {
      object.dayincishu = "1";
    }
    return ObjectStore.insert("AT16E453BA16A80002.AT16E453BA16A80002.watchHead", object, "SynchronousPrintingList");
  }
}
exports({
  entryPoint: MyAPIHandler
});