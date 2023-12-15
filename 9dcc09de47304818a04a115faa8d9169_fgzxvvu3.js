let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    debugger;
    let shenqinggongsi = param.data[0].shenqinggongsi; //申请公司
    let kehudaima = param.data[0].kehudaima; //客户代码
    let shenqingshouxine = param.data[0].shenqingshouxine; //申请授信额
    let kaishiriqi = param.data[0].kaishiriqi; //授信开始日期
    let zhongzhiriqi = param.data[0].zhongzhiriqi; //授信结束日期
    let zongyingshouzhang = param.data[0].zongyingshouzhang; //总应收账
    let meidaoqi = param.data[0].meidaoqi; //没到期
    let onethirtytian = param.data[0].onethirtytian; //1-30天
    let thirtysixtytian = param.data[0].thirtysixtytian; //30-60天
    let sixtytianyishang = param.data[0].sixtytianyishang; //60天以上
    let beizhu = param.data[0].beizhu; //备注
    let guanlianbianhao = param.data[0].code; //关联编号
    //当前单据更新
    var sql =
      "select * from AT169786521708000A.AT169786521708000A.BIP_Customer_Binding where shenqinggongsi = '" +
      shenqinggongsi +
      "' and kehudaima = '" +
      kehudaima +
      "' and guanlianbianhao = '" +
      guanlianbianhao +
      "'";
    var res = ObjectStore.queryByYonQL(sql);
    //历史对应关系
    var sql2 =
      "select * from AT169786521708000A.AT169786521708000A.BIP_Customer_Binding where shenqinggongsi = '" +
      shenqinggongsi +
      "' and kehudaima = '" +
      kehudaima +
      "' order by 'shouxinjieshuri'+0 desc LIMIT 1 "; //order by cast('shouxinjieshuri' as datetime) desc LIMIT 1
    var res2 = ObjectStore.queryByYonQL(sql2);
    if (res.length != 0) {
      var id = res[0].id;
      var id2 = res2[0].id;
      if ((id = id2)) {
        var object = {
          id: id,
          shenqinggongsi: shenqinggongsi,
          kehudaima: kehudaima,
          shouxine: shenqingshouxine,
          shouxinqishiri: kaishiriqi,
          shouxinjieshuri: zhongzhiriqi,
          zongyingshouzhang: zongyingshouzhang,
          meidaoqi: meidaoqi,
          onethirtytian: onethirtytian,
          thirtysixtytian: thirtysixtytian,
          sixtytianyishang: sixtytianyishang,
          beizhu: beizhu,
          guanlianbianhao: guanlianbianhao
        };
        var res3 = ObjectStore.updateById("AT169786521708000A.AT169786521708000A.BIP_Customer_Binding", object); //developplatform
        return { res3 };
      } else {
        throw new Error("历史不可修改");
      }
    } else {
      if (res2.length == 0) {
        var object = {
          shenqinggongsi: shenqinggongsi,
          kehudaima: kehudaima,
          shouxine: shenqingshouxine,
          shouxinqishiri: kaishiriqi,
          shouxinjieshuri: zhongzhiriqi,
          zongyingshouzhang: zongyingshouzhang,
          meidaoqi: meidaoqi,
          onethirtytian: onethirtytian,
          thirtysixtytian: thirtysixtytian,
          sixtytianyishang: sixtytianyishang,
          beizhu: beizhu,
          guanlianbianhao: guanlianbianhao
        };
        var res4 = ObjectStore.insert("AT169786521708000A.AT169786521708000A.BIP_Customer_Binding", object); //developplatform
        return { res4 };
      } else {
        var shouxinjieshuri = res2[0].shouxinjieshuri;
        if (kaishiriqi > shouxinjieshuri) {
          var object = {
            shenqinggongsi: shenqinggongsi,
            kehudaima: kehudaima,
            shouxine: shenqingshouxine,
            shouxinqishiri: kaishiriqi,
            shouxinjieshuri: zhongzhiriqi,
            zongyingshouzhang: zongyingshouzhang,
            meidaoqi: meidaoqi,
            onethirtytian: onethirtytian,
            thirtysixtytian: thirtysixtytian,
            sixtytianyishang: sixtytianyishang,
            beizhu: beizhu,
            guanlianbianhao: guanlianbianhao
          };
          var res5 = ObjectStore.insert("AT169786521708000A.AT169786521708000A.BIP_Customer_Binding", object); //developplatform
          return { res5 };
        } else {
          throw new Error("申请起始时间错误");
        }
      }
    }
  }
}
exports({ entryPoint: MyTrigger });