let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    const baseLine = 0.5;
    var data = new Object();
    data.categories = new Array();
    var categories = ObjectStore.queryByYonQL("select  id, type，color  from GT67489AT305.GT67489AT305.CoCategory");
    categories.forEach(function (obj) {
      let categorie = new Object();
      categorie.id = obj.id;
      categorie.name = obj.type;
      data.categories.push(categorie);
    });
    var orgs = ObjectStore.queryByYonQL("select id,name,zhucezijin,CoType,version from GT67489AT305.GT67489AT305.StockRegister");
    var orgMap = new Map();
    var nodes = new Array();
    orgs.forEach(function (obj) {
      var node = new Object();
      node.id = obj.id;
      node.name = obj.name;
      node.value = obj.zhucezijin + "万元";
      node.symbolSize = Math.log10(obj.zhucezijin) * 10; //(obj.zhuceziben/5000)<10?obj.zhuceziben:(obj.zhuceziben/5000);
      node.category = data.categories.findIndex((item) => {
        return item.id == obj.CoType;
      });
      node.CoType = obj.CoType;
      nodes.push(node);
      orgMap.set(obj.id, obj);
    });
    data.nodes = nodes;
    var relations = ObjectStore.queryByYonQL("select id,chuzifang,chuzibili,beitouzifang from GT67489AT305.GT67489AT305.stockRelation");
    return { relations };
    var links = new Array();
    relations.forEach(function (obj) {
      var line = new Object();
      line.source = obj.chuzifang;
      line.target = obj.beitouzifang;
      var lineStyle = new Object();
      lineStyle.color = "source";
      lineStyle.curveness = 0.3;
      line.symbol = ["none", "arrow"]; // 轴线两端箭头，两个值，none表示没有箭头，arrow表示有箭头
      line.symbolSize = [10, 10]; // 轴线两端箭头大小，数值一表示宽度，数值二表示高度;
      var zj = orgMap.get(obj.beitouzifang).zhucezijin;
      lineStyle.zj = zj;
      lineStyle.width = Math.log10(obj.chuzibili * zj) * baseLine;
      line.lineStyle = lineStyle;
      links.push(line);
    });
    data.links = links;
    return { data };
  }
}
exports({ entryPoint: MyAPIHandler });