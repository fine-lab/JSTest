let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var ywx = "ZC";
    if (param.return.hetongleixing == "2511807157702912") {
      ywx = "ZC";
    }
    if (param.return.hetongleixing == "2647813791388160") {
      ywx = "JZS";
    }
    if (param.return.xuliehao == undefined || param.return.xuliehao == "") {
      var zzjg = param.return.zhidanrenzuzhi; //组织
      var zzbm = param.return.zhidanrensuoshubumen; //部门
      var docid = param.return.id; //id
      var type = "GT57419AT54.GT57419AT54.AQTZC"; //单据URI
      var cardname = "7b47cdbeList";
      var ch; //城市
      var chsql; //查询城市SQL
      var chres; //查询城市结果
      var date = new Date();
      var year = date.getFullYear().toString().substring(2, 4); //年份
      var docstart; //合同号前缀TJZZ22
      var docsql; //单据查询SQL
      var docres; //单据查询结果
      var lsh; //流水号
      var alldoc; //合同号
      if (zzbm != undefined && zzbm == "2415630627787008") {
        //市场部
        ch = "SC";
      } else {
        if (zzjg != undefined) {
          chsql = "select jianchen from GT90840AT64.GT90840AT64.orgsname where org_id='" + zzjg + "'";
          chres = ObjectStore.queryByYonQL(chsql);
          if (chres.length > 0) {
            ch = chres[0].jianchen;
          } else {
            ch = "TJ";
          }
        } else {
          ch = "TJ";
        }
      }
      docstart = ch + ywx + year;
      docsql =
        "select distinct substr(xuliehao,length(xuliehao)-3,4) xuliehao from " +
        type +
        " where xuliehao like '" +
        docstart +
        "'  and INSTR(xuliehao,'" +
        docstart +
        "')=1  and id<>'" +
        docid +
        "' and substr(xuliehao,length(xuliehao)-4,1)='-' and length(xuliehao)>10 order by xuliehao";
      docres = ObjectStore.queryByYonQL(docsql);
      var count = 1;
      if (docres.length > 0) {
        for (var i = 0; i < docres.length; i++) {
          let l = parseInt(docres[i].xuliehao);
          if (count == l) {
            count = count + 1;
          } else {
            lsh = prefixInteger(count, 4);
            alldoc = docstart + "-" + lsh;
            continue;
          }
        }
      } else {
        alldoc = docstart + "-0001";
      }
      if (lsh == undefined || lsh == "") {
        lsh = prefixInteger(count, 4);
        alldoc = docstart + "-" + lsh;
      }
      var object = {
        id: docid,
        xuliehao: alldoc
      };
      var ress = ObjectStore.updateById(type, object, cardname);
      return {};
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });