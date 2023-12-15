let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    if (param.return.verifystate != 0) {
      return {};
    }
    if (param.return.hetonghao == undefined || param.return.hetonghao == "") {
      var zzjg = param.return.zhidanrensuoshuzuzhi; //组织
      var zzbm = param.return.zhidanrensuoshubumen; //部门
      var ywx = "ZZ"; //业务
      var docid = param.return.id; //id
      var type = "GT57366AT51.GT57366AT51.AQTZZ"; //单据URI
      var cardname = "f5b4af18List";
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
            throw new Error("未找到对应城市简称");
          }
        } else {
          throw new Error("未找到对应城市简称");
        }
      }
      docstart = ch + ywx + year;
      docsql =
        "select distinct substr(hetonghao,length(hetonghao)-3,4) xuliehao from " +
        type +
        " where hetonghao  like   '" +
        docstart +
        "' and  INSTR(hetonghao,'" +
        docstart +
        "')=1  and id<>'" +
        docid +
        "' and substr(hetonghao,length(hetonghao)-4,1)='-' and length(hetonghao)>10  order by hetonghao";
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
        hetonghao: alldoc
      };
      var ress = ObjectStore.updateById(type, object, cardname);
      return {};
    }
  }
}
exports({ entryPoint: MyTrigger });