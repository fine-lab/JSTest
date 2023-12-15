let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let wineLabelSql = "select * from GT80750AT4.GT80750AT4.wine_labels where status = '0' ";
    let wineLabels = ObjectStore.queryByYonQL(wineLabelSql);
    let updateData = [];
    wineLabels.forEach((self) => {
      let wine_body_id = self.wine_body_id;
      if (wine_body_id) {
        //搜索对应的酒体
        let wineBodySql = "select id,code,name from GT80750AT4.GT80750AT4.wine_body where status = '0' ";
        wineBodySql = `${wineBodySql} and id = 'youridHere' `;
        let wineBodys = ObjectStore.queryByYonQL(wineBodySql);
        if (wineBodys && wineBodys.length > 0) {
          let wine_body_name = wineBodys[0].name;
          if (wine_body_name) {
            let productClassSql = "select id,name from	pc.cls.PresentationClass";
            productClassSql = `${productClassSql} where name = '${wine_body_name}' `;
            let productClassData = ObjectStore.queryByYonQL(productClassSql, "productcenter");
            if (productClassData && productClassData.length > 0) {
              //更新内容
              var object = [{ id: self.id, wine_body_id_new: productClassData[0].id, wine_body_id_new_refname: productClassData[0].name }];
              //更新实体
              var res = ObjectStore.updateBatch("GT80750AT4.GT80750AT4.wine_labels", object);
            }
          }
        }
      }
    });
    return { code: 200, data: wineLabels };
  }
}
exports({ entryPoint: MyAPIHandler });