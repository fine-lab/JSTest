let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取参数
    var page = request.page;
    var size = request.size;
    var cs_is_or_not = request.isService;
    //查询服务报价
    var query_sql =
      "select cs_service_class.class_sort as class_sort,is_alone,unit_Price as serviceUnitPrice,is_by_user as serviceIsByUser,include_licenses as serviceIncludeLicenses,cs_service_class.code as serviceClassCode,cs_service_class.cs_product.name as productName,cs_service_class.cs_product as productId,cs_service_class as serviceClassId,cs_service_class.name as serviceClassName,id,name,code,base_price,cs_service_class.is_by_user as is_by_user,cs_service_class.unit_price as unit_price,cs_service_class.include_licenses as include_licenses,cs_is_or_not as isService from GT6990AT161.GT6990AT161.cs_service_doc left join GT6990AT161.GT6990AT161.cs_service_class t1 on cs_service_class = t1.id left join GT6990AT161.GT6990AT161.cs_product t2 on cs_product = t2.id where 1=1 ";
    var res = ObjectStore.queryByYonQL(query_sql);
    return { result: res };
  }
}
exports({ entryPoint: MyAPIHandler });