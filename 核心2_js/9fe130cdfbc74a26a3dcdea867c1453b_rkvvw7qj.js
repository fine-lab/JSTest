let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    debugger;
    var data = param.data[0];
    var orderDetails = data.st_purinrecordlist;
    //声明一个数组，存放后台的字段
    var datalos;
    var temp = new Array();
    var titleArray = new Array(); //表体1：物料分类汇总
    var titleJSON = {}; //声明一个临时的空JSON对象，用来中转数据
    orderDetails.forEach((dataod) => {
      if (dataod._selected == true) {
        datalos = dataod;
        //调用yonsql，取得表体字段
        let sql = "select * from st.purinrecord.PurInRecords where mainid =" + dataod.id;
        var dataLine = ObjectStore.queryByYonQL(sql)[0]; //这个dataLine就是表体字段
        temp.push(dataod.id);
        debugger;
        //选中多少个表，数组中就会记录子表1（物料分类汇总）多少条数据
        let materialClassifySumJSON = {}; //声明一个临时的空JSON对象，用来中转数据
        var materialClassifySumArray = new Array(); //表体1：物料分类汇总
        //在json对象中添加键值对数据
        //总数量
        materialClassifySumJSON.num = dataod.qty / 1000;
        materialClassifySumJSON.Original_number = dataod.code;
        materialClassifySumJSON.commodity = dataod.product;
        materialClassifySumJSON.commodity_name = dataod.product_cName;
        materialClassifySumJSON.creation_time = dataod.createTime;
        materialClassifySumArray.push(materialClassifySumJSON); //将json数据填入数组
        var objectlist = {
          //账户名
          account_name: datalos.org_name,
          //账户号
          account_number: "六和账户号",
          //实付运费
          actual_freight: "0",
          //代办人
          agent: datalos.creator,
          //创建人
          founder: datalos.creator,
          //物流公司
          materialcompany_name: "圆通速递",
          //原始单据类型
          original_document_type: "2",
          remarks: "六和运费结算单备注",
          //状态
          state: "已审核",
          //总运费
          total_freight: 1,
          //总数量
          total_num: dataod.qty / 1000,
          //车牌号
          transport_vehicles: "鲁B",
          //更新人
          updatedby: datalos.creator,
          //子表明细内容
          document_details01List: materialClassifySumArray
        };
        titleArray.push(objectlist);
      }
    });
    var object = { object: titleArray };
    var base_path = "https://www.example.com/";
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = { "Content-Type": hmd_contenttype };
    //拿到access_token
    let func = extrequire("udinghuo.backDefaultGroup.getOpenApiToken");
    let res = func.execute("");
    var token2 = res.access_token;
    let apiResponse = postman("post", base_path.concat("?access_token=" + token2), JSON.stringify(header), JSON.stringify(object));
    var obj = JSON.parse(apiResponse);
    if (obj.code == 999) {
      throw new Error("id为" + temp + "的【采购入库单】插入了【运费结算单】实体失败" + ",失败原因为:" + obj.message);
    } else {
      throw new Error("已经将id为" + temp + "的【采购入库单】插入了【运费结算单】实体");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });