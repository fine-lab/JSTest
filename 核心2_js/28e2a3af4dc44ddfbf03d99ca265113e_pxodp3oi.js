let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let accbookCode = param.accbookCode; //#调用方id
    //从数据库中取配置
    let queryRst = ObjectStore.queryByYonQL("select * from AT1703B12408A00002.AT1703B12408A00002.YS_U8dsSqquence where ys_code='" + accbookCode + "'", "developplatform");
    if (queryRst.length == 0) {
      //出错了
      return { ds_sequence: 0 };
    }
    return queryRst[0];
    let dsMap = new Map();
    dsMap.set("GL010003", { ds_sequence: 1, code: "GL010003", name: "河南国立控股有限公司_主账簿", id: "youridHere", accsubjectchart: "1582791003173552128" });
    dsMap.set("GL030003", { ds_sequence: 1, code: "GL030003", name: "郑州爱尔森机械设备有限公司_主账簿", id: "youridHere", accsubjectchart: "1582791003173552128" });
    dsMap.set("GL040001", { ds_sequence: 1, code: "GL040001", name: "河南米科斯机械设备有限公司_主账簿", id: "youridHere", accsubjectchart: "1582791003173552128" });
    dsMap.set("GL050001", { ds_sequence: 1, code: "GL050001", name: "河南国立米科斯科技有限公司_主账簿", id: "youridHere", accsubjectchart: "1582791003173552128" });
    dsMap.set("GL060001", { ds_sequence: 1, code: "GL060001", name: "河南百特设备机械有限公司_主账簿", id: "youridHere", accsubjectchart: "1582791003173552128" });
    dsMap.set("GL070003", { ds_sequence: 1, code: "GL070003", name: "河南国立百特环保科技有限公司_主账簿", id: "youridHere", accsubjectchart: "1582791003173552128" });
    dsMap.set("GL090003", { ds_sequence: 1, code: "GL090003", name: "河南国立百斯特游乐设备有限公司_主账簿", id: "youridHere", accsubjectchart: "1582791003173552128" });
    dsMap.set("GL020006", { ds_sequence: 1, code: "GL020006", name: "乌兹别克斯坦分公司_主账簿", id: "youridHere", accsubjectchart: "1582791003173552128" });
    dsMap.set("GL120002", { ds_sequence: 1, code: "GL120002", name: "河南国立咕哩文化传媒有限公司_主账簿", id: "youridHere", accsubjectchart: "1582791003173552128" });
    dsMap.set("GL140001", { ds_sequence: 1, code: "GL140001", name: "河南国立进出口有限公司_主账簿", id: "youridHere", accsubjectchart: "1582791003173552128" });
    dsMap.set("GL100001", { ds_sequence: 1, code: "GL100001", name: "郑州悦立网络科技有限公司_主账簿", id: "youridHere", accsubjectchart: "1582791003173552128" });
    return dsMap.get(accbookCode);
  }
}
exports({ entryPoint: MyTrigger });