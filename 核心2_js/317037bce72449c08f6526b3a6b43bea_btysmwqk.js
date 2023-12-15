let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var value1 = request.xinghao;
    //库存
    var sql1 =
      "select rukushijian,cangku,kuwei,pinpai,xinghao,pihao,zaikuliang,keyongliang,chandi,mpq,baozhuang,jiage,bibie,bibie.name,shuilv,shuilv.name,suoshuren,suoshuren.name,beizhu from GT71043AT2.GT71043AT2.demand_inquiry_15 t left join demand_inquiry_09_id t1 on t.demand_inquiry_09_id=t1.id where demand_inquiry_09_id.xinghao like '" +
      value1 +
      "'";
    //渠道库存
    var sql2 =
      "select lurushijian,youxiaoqi,kekaodu,yinmidu,pinpai,xinghao,shuliang,dc,jiage,bizhong,bizhong.name,shuilv,shuilv.name,suoshuren,suoshuren.name,new20 from GT71043AT2.GT71043AT2.demand_inquiry_14 t left join demand_inquiry_09_id t1 on t.demand_inquiry_09_id=t1.id where demand_inquiry_09_id.xinghao like '" +
      value1 +
      "'";
    //销售报价
    var sql3 =
      "select lurushijian,pinpai,xinghao,shuliang,moq,mpq,pihao,jiaoqiyaoqiu,demand_inquiry_01_1_id.xiaoshou xiaoshou,demand_inquiry_01_1_id.xiaoshou.name xiaoshou_name from GT71043AT2.GT71043AT2.demand_inquiry_02_1 t left join demand_inquiry_01_1_id t1 on t.demand_inquiry_01_1_id=t1.id where xinghao like '" +
      value1 +
      "'";
    //销售单
    var sql4 =
      "select lurushijian,pinpai,xinghao,shuliang,pihao,mubiaojia,demand_inquiry_01_1_id.huobi huobi,demand_inquiry_01_1_id.huobi.name huobi_name,demand_inquiry_01_1_id.pingtai pingtai,demand_inquiry_01_1_id.xiaoshou xiaoshou,demand_inquiry_01_1_id.xiaoshou.name xiaoshou_name from GT71043AT2.GT71043AT2.demand_inquiry_02_1 t left join demand_inquiry_01_1_id t1 on t.demand_inquiry_01_1_id=t1.id where xinghao like '" +
      value1 +
      "'";
    //采购单
    var sql5 =
      "select xunjialurushijian,ziduan3,xinghao,shuliang,pihao,jiage,bibie,bibie.name,shuilv,shuilv.name,caigou,caigou.name,new26 from GT71043AT2.GT71043AT2.demand_inquiry_03_1 t left join demand_inquiry_02_1_id t1 on t.demand_inquiry_02_1_id=t1.id where xinghao like '" +
      value1 +
      "'";
    //历史询价
    var sql8 =
      "select xunjialurushijian,gongkaigongyingshang,kekaodu,demand_inquiry_enumeration_09,xinghao,shuliang,jiage,bibie,bibie.name,shuilv,shuilv.name,moq,mpq,ziduan18,zhangqi,ceshi,caigou,caigou.name,beizhu from GT71043AT2.GT71043AT2.demand_inquiry_07 t where xinghao like '" +
      value1 +
      "'and xunjiazhuangtai !=4";
    var sql6 =
      "select xunjialurushijian,gongkaigongyingshang,kekaodu,demand_inquiry_enumeration_09,xinghao,shuliang,jiage,bibie,bibie.name,shuilv,shuilv.name,moq,mpq,ziduan18,jiaohuofangshi,zhangqi,ceshi,caigou,caigou.name from GT71043AT2.GT71043AT2.demand_inquiry_03_1 t left join demand_inquiry_02_1_id t1 on t.demand_inquiry_02_1_id=t1.id where xinghao like '" +
      value1 +
      "'";
    //历史需求
    var sql9 =
      "select openriqi,kehumingchen,kehumingchen.name,kehulianxiren,kehuliaohao,pinpai,xinghao,miaoshu,shuliang,pihaoyaoqiu,mubiaojia,youxiaoqi,xuqiuleibie from GT71043AT2.GT71043AT2.demand_inquiry_04 t where xinghao like '" +
      value1 +
      "'";
    var sql7 =
      "select lurushijian,kehuliaohao,pinpai,xinghao,miaoshu,shuliang,pihaoyaoqiu,mubiaojia,jiaoqiyaoqiu,beizhu,demand_inquiry_01_1_id.kehumingchen kehumingchen,demand_inquiry_01_1_id.kehumingchen.name kehumingchen_name,demand_inquiry_01_1_id.kehulianxiren kehulianxiren,demand_inquiry_01_1_id.xuqiuzhenshidu xuqiuzhenshidu,demand_inquiry_01_1_id.xuqiuleibie xuqiuleibie from GT71043AT2.GT71043AT2.demand_inquiry_02_1 t left join demand_inquiry_01_1_id t1 on t.demand_inquiry_01_1_id=t1.id where xinghao like '" +
      value1 +
      "'";
    var res1 = ObjectStore.queryByYonQL(sql1);
    var res2 = ObjectStore.queryByYonQL(sql2);
    var res3 = ObjectStore.queryByYonQL(sql3);
    var res4 = ObjectStore.queryByYonQL(sql4);
    var res5 = ObjectStore.queryByYonQL(sql5);
    var res6 = ObjectStore.queryByYonQL(sql6);
    var res7 = ObjectStore.queryByYonQL(sql7);
    var res8 = ObjectStore.queryByYonQL(sql8);
    var res9 = ObjectStore.queryByYonQL(sql9);
    return { res1: res1, res2: res2, res3: res3, res4: res4, res5: res5, res6: res6, res7: res7, res8: res8, res9: res9 };
  }
}
exports({ entryPoint: MyAPIHandler });