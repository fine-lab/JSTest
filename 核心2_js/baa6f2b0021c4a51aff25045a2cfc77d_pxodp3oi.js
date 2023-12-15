// 国立测试 - 脚本
// 导入 AbstractAPIHandler 类
let AbstractAPIHandler = require("AbstractAPIHandler");
// 创建 MyAPIHandler 类，继承 AbstractAPIHandler
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 定义 SQL 查询语句，从数据库中选择特定的字段和条件，   where 需求产品二级空值  从 06广告费用业务分摊表单 取出需求产品、产品明细
    let sql =
      "select id,syb,xuqiuchanpin,chanpinmingchen  from AT17DBCECA09580004.AT17DBCECA09580004.ggfyft  where syb in ('1573823532355289110') and  xuqiuchanpin in ('配件') and xqej in ('非主营设备')  limit  100";
    // 查询数据库并获取结果
    var res = ObjectStore.queryByYonQL(sql);
    // 定义一个空数组用于存储要更新的数据
    var updateData = [];
    // 遍历查询结果
    res.forEach((item, index) => {
      // 构建第二条 SQL 查询语句，从另一个表中检索相关数据，构建的需求产品和物料档案的关系表（更新需求产品）
      let sql1 = "select erjiid, sanjiid from AT16ACB41608F0000B.AT16ACB41608F0000B.qyupdateProduct where zuzhiid='" + item.syb + "' and xuqiuchanpinid='" + item.xuqiuchanpin + "'";
      // 查询数据库并获取结果，
      var res1 = ObjectStore.queryByYonQL(sql1);
      // 检查是否有结果
      if (res1 && res1.length > 0) {
        // 获取所需数据并添加到 updateData 数组中
        let xqej = res1[0].erjiid; // 2级获取字段值
        updateData.push({ id: item.id, xqej: xqej }); // 将字段值添加到数组中
      }
    });
    // 批量更新数据库中的记录， 数据表： GL_询盘线索单
    var res = ObjectStore.updateBatch("AT17DBCECA09580004.AT17DBCECA09580004.ggfyft", updateData);
    // 返回结果对象
    return { res };
  }
}
// 导出 MyAPIHandler 类，供其他模块使用
exports({ entryPoint: MyAPIHandler });