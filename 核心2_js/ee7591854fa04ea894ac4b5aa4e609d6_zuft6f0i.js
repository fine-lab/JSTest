let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    return {};
    let code = param.data[0].code;
    try {
      let object = { pf_code: code };
      ObjectStore.deleteByMap("AT18FE5D761C880009.AT18FE5D761C880009.percentage", object, "yba827c203List");
    } catch (e) {
      console.log("单号" + code + "评分占比统计删除失败" + e.toString());
    }
    let sql = "select id,score1,score2,score3,score4,score5,score6,score7 from AT18FE5D761C880009.AT18FE5D761C880009.score where code=" + code;
    let scoreinfo = ObjectStore.queryByYonQL(sql, "developplatform");
    let data = scoreinfo[0];
    let id = data.id;
    let score1 = data.score1;
    let score2 = data.score2;
    let score3 = data.score3;
    let score4 = data.score4;
    let score5 = data.score5;
    let score6 = data.score6;
    let score7 = data.score7;
    let alldata = [];
    if (score1) {
      let score_service_link = this.getscore_service_link(id, 1);
      this.Add(alldata, score_service_link, code, score1); //添加数据
    }
    if (score2) {
      let score_service_link = this.getscore_service_link(id, 2);
      this.Add(alldata, score_service_link, code, score2); //添加数据
    }
    if (score3) {
      let score_service_link = this.getscore_service_link(id, 3);
      this.Add(alldata, score_service_link, code, score3); //添加数据
    }
    if (score4) {
      let score_service_link = this.getscore_service_link(id, 4);
      this.Add(alldata, score_service_link, code, score4); //添加数据
    }
    if (score5) {
      let score_service_link = this.getscore_service_link(id, 5);
      this.Add(alldata, score_service_link, code, score5); //添加数据
    }
    if (score6) {
      let score_service_link = this.getscore_service_link(id, 6);
      this.Add(alldata, score_service_link, code, score6); //添加数据
    }
    if (score7) {
      let score_service_link = this.getscore_service_link(id, 7);
      this.Add(alldata, score_service_link, code, score7); //添加数据
    }
    let gropdata = this.groupByMultipleFields(alldata, ["staff_id"]);
    let adddata = [];
    gropdata.map((item, index) => {
      let itemdata = item.data;
      let scoreall = 0.0; //得分
      itemdata.map((v, vindex) => {
        scoreall += v.score;
      });
      let proportion = this.getproportion(scoreall); //占比
      let info = {
        pf_code: code,
        proportion: proportion,
        staff_id: item.key,
        score: scoreall,
        score_id: id
      };
      adddata.push(info);
    });
    try {
      ObjectStore.insertBatch("AT18FE5D761C880009.AT18FE5D761C880009.percentage", adddata, "yba827c203List");
    } catch (e) {
      console.log("评分统计插入数据失败" + e.toString());
      throw new Error(e.toString());
    }
    return {};
  }
  Add(data, values, code, score) {
    values.forEach((item, index) => {
      let v = {};
      v.pf_code = code;
      v.staff_id = item.service_link;
      v.score = score;
      data.push(v);
    });
  }
  getscore_service_link(id, index) {
    let sql = "select service_link" + index + "  service_link from AT18FE5D761C880009.AT18FE5D761C880009.score_service_link" + index + " where fkid=" + id;
    return ObjectStore.queryByYonQL(sql, "developplatform");
  }
  getproportion(value) {
    let allfraction = 10.0;
    let result = Number(((value / allfraction) * 100).toFixed(2));
    return result;
  }
  groupByMultipleFields(arr, fields) {
    return Object.values(
      arr.reduce(function (result, obj) {
        // 生成分组的键值
        const key = fields.map((field) => obj[field]).join("|");
        // 根据分组键值将对象添加到对应的分组中
        if (!result[key]) {
          result[key] = { key: key, data: [] };
        }
        result[key].data.push(obj);
        return result;
      }, {})
    );
  }
}
exports({ entryPoint: MyTrigger });