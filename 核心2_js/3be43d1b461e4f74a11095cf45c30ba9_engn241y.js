let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0];
    let status = data._status;
    let shifulishidanju = data.shifulishidanju;
    var htcode = data.hetongbianma;
    var docid = data.id; //id
    var docsql; //单据查询SQL
    var docres; //单据查询结果
    var alldoc; //合同编号
    var lsh; //流水号
    var docstart; //合同号前缀
    var lbcode;
    var lxcode;
    var type = "AT163DA72808680006.AT163DA72808680006.TDYY_HT_LR"; //单据URI
    if (htcode === null || htcode === undefined) {
      var zzcode = "TX"; //编码前两位固定TX
      var date = new Date();
      var yearcode = date.getFullYear().toString().substring(0, 4); //年份
      var hetongbianma = data.hetongbianma; //合同编码
      var shifouguanlianhetong = data.shifouguanlianhetong; //是否关联合同
      var guanlianhetong_hetongmingcheng = data.guanlianhetong_hetongmingcheng; //关联合同名称
      var qiandingdanweicode = data.qiandingdanweicode; //签订单位code 01
      var hetongleibiecode = data.hetongleibiecode; //合同类别code
      var hetongleixingcode = data.hetongleixingcode; //合同类型code
      if (hetongleibiecode != null) {
        lbcode = substring(hetongleibiecode, hetongleibiecode.length - 1, hetongleibiecode.length);
      }
      if (hetongleixingcode != null) {
        lxcode = substring(hetongleixingcode, hetongleixingcode.length - 2, hetongleixingcode.length);
      }
      if (lbcode === null || lbcode === undefined) {
        lbcode = data.item421mf; //合同编码用类别code
      }
      if (lxcode === null || lxcode === undefined) {
        lxcode = data.item578ij; //合同编码用类型code
      }
      docstart = join([zzcode, lbcode, lxcode, yearcode], "-");
      if (shifouguanlianhetong === "Y") {
        //如果有原合同，合同编码=原合同编码+2位流水号
        if (guanlianhetong_hetongmingcheng !== null || guanlianhetong_hetongmingcheng !== undefined) {
          var guanlianhetong_hetongbianma = data.guanlianhetong_hetongbianma; //原合同编码
          docsql =
            "select  hetongbianma a, substring(hetongbianma,1,length(hetongbianma)-6) b, substr(hetongbianma,length(hetongbianma)-1) hetongbianma from " +
            type +
            " where hetongbianma like '" +
            guanlianhetong_hetongbianma +
            "' and length(hetongbianma)>16 and id<>'" +
            docid +
            "' order by hetongbianma ";
          docres = ObjectStore.queryByYonQL(docsql);
          var count = 1;
          if (docres !== null && docres.length > 0) {
            for (var i = 0; i < docres.length; i++) {
              if (docres[i].b == guanlianhetong_hetongbianma) {
                let l = parseInt(docres[i].hetongbianma);
                if (count == l) {
                  count = count + 1;
                } else {
                  lsh = prefixInteger(count, 2);
                  continue;
                }
              }
            }
          } else {
            lsh = "01";
          }
          if (lsh == undefined || lsh == "") {
            lsh = prefixInteger(count, 2);
          }
          alldoc = join([guanlianhetong_hetongbianma, "BC", lsh], "-");
        } else {
          throw new Error("请选择原合同！");
        }
      } else {
        //没有就docstart+3位流水号（按照类别）
        if (hetongleibiecode !== null || hetongleibiecode !== undefined) {
          if (hetongleixingcode !== null || hetongleixingcode !== undefined) {
            docsql =
              "select  hetongbianma a, substring(hetongbianma,4,1) b, substr(hetongbianma,length(hetongbianma)-2) hetongbianma from " +
              type +
              " where hetongbianma like '" +
              docstart +
              "' and length(hetongbianma)<=16 and id<>'" +
              docid +
              "' order by hetongbianma ";
            docres = ObjectStore.queryByYonQL(docsql);
            var count = 1;
            if (docres !== null && docres.length > 0) {
              for (var i = 0; i < docres.length; i++) {
                let l = parseInt(docres[i].hetongbianma);
                if (count == l) {
                  count = count + 1;
                } else {
                  lsh = prefixInteger(count, 3);
                  continue;
                }
              }
            } else {
              lsh = "001";
            }
            if (lsh == undefined || lsh == "") {
              lsh = prefixInteger(count, 3);
            }
            alldoc = join([docstart, lsh], "-");
          } else {
            throw new Error("请选择原合同类型！");
          }
        } else {
          throw new Error("请选择原合同类别！");
        }
      }
      var object = {
        id: docid,
        hetongbianma: alldoc
      };
      var ress = ObjectStore.updateById(type, object, "476fa6c7");
    }
    var object = {
      id: docid,
      hetongbianma: alldoc
    };
    var htlrres = ObjectStore.selectById(type, object);
    var htbm = htlrres.hetongbianma; //合同编码
    var requestdata = {};
    requestdata["bianma"] = htbm;
    requestdata["data"] = data;
    requestdata["apps"] = "0";
    let func = extrequire("AT163DA72808680006.backDesignerFunction.bipdiaonc");
    let res = func.execute(requestdata);
  }
}
exports({ entryPoint: MyTrigger });