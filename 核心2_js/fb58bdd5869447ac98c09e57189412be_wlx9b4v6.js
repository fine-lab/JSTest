let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    if (param.return.new25 == undefined || param.return.new25 == "") {
      var zzjg = param.return.zhidanrenzuzhi; //组织
      var zzbm = param.return.zhidanrenbumen; //部门
      var ywx = "TX"; //业务
      var docid = param.return.id; //id
      var type = "GT57255AT47.GT57255AT47.ATXZB"; //单据URI
      var cardname = "cd9398c2List";
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
        "select distinct substr(new25,length(new25)-3,4) xuliehao from " +
        type +
        " where new25 like '" +
        docstart +
        "'  and INSTR(new25,'" +
        docstart +
        "')=1  and id<>'" +
        docid +
        "' and substr(new25,length(new25)-4,1)='-' and length(new25)>10 order by new25";
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
        new25: alldoc
      };
      var ress = ObjectStore.updateById(type, object, cardname);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });