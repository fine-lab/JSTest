let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    debugger;
    var data = param.data[0];
    var orderDetails = data.st_salesoutlist;
    //声明一个数组，存放后台的字段
    var datalos;
    var temp = new Array();
    var titleArray = new Array(); //表体1：物料分类汇总
    var totalsummary = new Array(); //物流公司汇总
    //设置一个map数组;
    //如果有物流公司将该物流公司放入map中,key存储物流公司，value存放数组下标;并且记住titleArray数组的下标;
    //第二次的时候，区key和当前物流公司比较，不为空，则区数组下标进行赋值
    var titleJSON = {}; //声明一个临时的空JSON对象，用来中转数据
    orderDetails.forEach((dataod) => {
      if (dataod._selected == true) {
        datalos = dataod;
        //调用yonsql，取得表体字段
        let sql = "select * from st.salesout.SalesOuts where mainid =" + dataod.id;
        var dataLine = ObjectStore.queryByYonQL(sql)[0]; //这个dataLine就是表体字段
        temp.push(dataod.id);
        debugger;
        var biaoji = 0;
        if (totalsummary.length > 0) {
          var b = totalsummary.length;
          for (var i = 0; i < b; i++) {
            if (totalsummary[i] == dataod.headDefine.define3_name) {
              //用以前的数组计算
              //子表的数据会一直累加
              //主表的数据会发生变化
              //选中多少个表，数组中就会记录子表1（物料分类汇总）多少条数据
              let materialClassifySumJSON = {}; //声明一个临时的空JSON对象，用来中转数据
              var materialClassifySumArray = new Array(); //表体1：物料分类汇总
              //在json对象中添加键值对数据
              //总数量
              materialClassifySumJSON.num = dataod.qty / 1000;
              materialClassifySumJSON.Original_number = dataod.code;
              materialClassifySumJSON.commodity = dataLine.product;
              materialClassifySumJSON.commodity_name = dataod.product_cName;
              materialClassifySumJSON.creation_time = dataod.createTime;
              //原始单据id
              materialClassifySumJSON.orginalsid = dataod.id;
              materialClassifySumArray.push(materialClassifySumJSON); //将json数据填入数组
              //子表的数据已经修改完善
              var mm = titleArray[i];
              var ss = mm.document_details01List;
              titleArray[i].document_details01List.push(materialClassifySumJSON);
              //修改总表的数据
              //总运费要变
              titleArray[i].total_freight = titleArray[i].total_freight + dataod.headDefine.define2;
              //总数量也要变
              titleArray[i].total_num = titleArray[i].total_num + dataod.totalQuantity / 1000;
              totalsummary.push(dataod.headDefine.define3_name);
              biaoji = 1;
            }
          }
        }
        if (biaoji == 0) {
          //选中多少个表，数组中就会记录子表1（物料分类汇总）多少条数据
          let materialClassifySumJSON = {}; //声明一个临时的空JSON对象，用来中转数据
          var materialClassifySumArray = new Array(); //表体1：物料分类汇总
          //在json对象中添加键值对数据
          //总数量
          materialClassifySumJSON.num = dataod.qty / 1000;
          materialClassifySumJSON.Original_number = dataod.code;
          materialClassifySumJSON.commodity = dataLine.product;
          materialClassifySumJSON.commodity_name = dataod.product_cName;
          materialClassifySumJSON.creation_time = dataod.createTime;
          materialClassifySumJSON.plate_number = dataod.cLogisticsCarNum;
          materialClassifySumJSON.orginalsid = dataod.id;
          materialClassifySumArray.push(materialClassifySumJSON); //将json数据填入数组
          var res = AppContext();
          var obj = JSON.parse(res);
          var data = obj.currentUser;
          var userid = data.id;
          try {
            var define3 = dataod.headDefine.define3_name;
          } catch (e) {
            throw new Error("数据不完善，请检查物流公司或者总运费或车牌号");
          }
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
            materialcompany_name: dataod.headDefine.define3_name,
            materialcompany: dataod.headDefine.define3,
            //组织id
            ordid: userid,
            //原始单据类型
            original_document_type: "1",
            remarks: "六和运费结算单备注",
            //状态
            state: "已审核",
            //总运费
            total_freight: dataod.headDefine.define2,
            //总数量
            total_num: dataod.totalQuantity / 1000,
            //车牌号
            transport_vehicles: dataod.cLogisticsCarNum,
            //更新人
            updatedby: datalos.creator,
            //子表明细内容
            document_details01List: materialClassifySumArray
          };
          totalsummary.push(dataod.headDefine.define3_name);
          titleArray.push(objectlist);
        }
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
    debugger;
    let apiResponse = postman("post", base_path.concat("?access_token=" + token2), JSON.stringify(header), JSON.stringify(object));
    var obj = JSON.parse(apiResponse);
    if (obj.code == 999) {
      throw new Error("id为" + temp + "的【销售出库单单】插入了【运费结算单】实体失败" + ",失败原因为:" + obj.message);
    }
    if (obj.code == 310083) {
      throw new Error("id为" + temp + "的【销售出库单单】插入了【运费结算单】实体失败" + ",失败原因为:" + obj.message);
    } else {
      var object = { id: "youridHere", name: "value" };
      var rescfd = ObjectStore.updateById("st.salesout.SalesOut", object);
      throw new Error("已经将id为" + temp + "的【采购入库单】插入了【运费结算单】实体");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });