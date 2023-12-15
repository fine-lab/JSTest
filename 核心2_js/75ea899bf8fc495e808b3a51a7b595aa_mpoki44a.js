let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let sql =
      "select riqi,ziduan1 as tianqi,chugongrenshu_A as chugongrenshu,beizhu from GT3AT2.GT3AT2.zhoubaogongshi1 where gystianbao_id in(" +
      "select id from GT3AT2.GT3AT2.gystianbao where  huibaoshijian >= '" +
      request.huibaoshijianS +
      "' and huibaoshijian <='" +
      request.huibaoshijianE +
      "' and shigongdanweigongyingshang = " +
      request.shigongdanweigongyingshang +
      " and suoshuzuzhi='" +
      request.suoshuzuzhi +
      "' and xiangmu='" +
      request.xiangmu +
      "' and dr = 0 ) and dr = 0 order by riqi ";
    let res = ObjectStore.queryByYonQL(sql);
    let sql2 =
      "select ziduan1 as danti,cbsxiangmujieduan as cbsxiangmujieduan_A,cbsxiangmujieduan.name as cbsxiangmujieduan_A_name,renwubiaoqian_A as renwubiaoqian, wanchengjindu,kaishishijian,jihuawanchengshijian,wanchengshijian,shifuwancheng,qingkuangshuoming,jiedianrenwu as jiedian,renwunarong as renwu,wanchengjindu as wanchengjindu  from GT3AT2.GT3AT2.zhipairenwuneirong " +
      "  where gystianbao_id in(" +
      "select id from GT3AT2.GT3AT2.gystianbao where  huibaoshijian >= '" +
      request.huibaoshijianS +
      "' and huibaoshijian <='" +
      request.huibaoshijianE +
      "' and shigongdanweigongyingshang = " +
      request.shigongdanweigongyingshang +
      " and suoshuzuzhi='" +
      request.suoshuzuzhi +
      "' and xiangmu='" +
      request.xiangmu +
      "' and dr = 0 ) and dr = 0";
    let res2 = ObjectStore.queryByYonQL(sql2);
    let sql3 =
      "select   tianbaoren as tianbaoren_A,tianbaoren.name as tianbaoren_A_name,ziduan4 as fangyiqingkuang,beizhu, " +
      " from GT3AT2.GT3AT2.gerenzhoubao where tianbaoriqi >= '" +
      request.huibaoshijianS +
      "' and tianbaoriqi <='" +
      request.huibaoshijianE +
      "' and org_id='" +
      request.suoshuzuzhi +
      "' and xiangmu='" +
      request.xiangmu +
      "' and dr = 0 ";
    let res3 = ObjectStore.queryByYonQL(sql3);
    let sql4 =
      "select cbsxiangmujieduan,cbsxiangmujieduan.name as cbsxiangmujieduan_name, tianbaoren,tianbaoren.name as tianbaoren_name,tianbaoriqi, t1.dantileibiemingchen.danti as dantileibie,t1.shigongjinzhanqingkuang as insetnew5,t1.renwuwanchenglv as renwuwanchenglv,t1.beizhu as new6   from GT3AT2.GT3AT2.shigongjinzhanqigk left join GT3AT2.GT3AT2.shigongjinzhanxiangqing t1 on id=t1.shigongjinzhanqigk_id " +
      " where tianbaoriqi >= '" +
      request.huibaoshijianS +
      "' and tianbaoriqi <='" +
      request.huibaoshijianE +
      "' and org_id='" +
      request.suoshuzuzhi +
      "' and xiangmu='" +
      request.xiangmu +
      "' and dr = 0 and t1.dr=0 ";
    let res4 = ObjectStore.queryByYonQL(sql4);
    //开发阶段可以将sql返回前端，正式使用后，一定要将sql返回值去除
    return { data: res, renwu: res2, aqfy: res3, sgjz: res4 };
  }
}
exports({ entryPoint: MyAPIHandler });