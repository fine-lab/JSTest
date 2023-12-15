viewModel.on("customInit", function (data) {
  let mytime = setInterval(() => {
    viewModel.execute("refresh");
  }, 15000);
});
viewModel.get("coop_assets_1683755530998775811") &&
  viewModel.get("coop_assets_1683755530998775811").on("afterSetDataSource", function (data) {
    //表格--设置数据源后
    //定义一些常量
    const x_PI = (3.14159265358979324 * 3000.0) / 180.0;
    const PI = 3.1415926535897932384626;
    const a = 6378245.0;
    const ee = 0.00669342162296594323;
    function out_of_china(lng, lat) {
      return lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271 || false;
    }
    function transformlat(lng, lat) {
      let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
      ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0;
      ret += ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) / 3.0;
      ret += ((160.0 * Math.sin((lat / 12.0) * PI) + 320 * Math.sin((lat * PI) / 30.0)) * 2.0) / 3.0;
      return ret;
    }
    function transformlng(lng, lat) {
      let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
      ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0;
      ret += ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) / 3.0;
      ret += ((150.0 * Math.sin((lng / 12.0) * PI) + 300.0 * Math.sin((lng / 30.0) * PI)) * 2.0) / 3.0;
      return ret;
    }
    function gcj02towgs84(lng, lat) {
      if (out_of_china(lng, lat)) {
        return { lng: lng, lat: lat };
      } else {
        let dlat = transformlat(lng - 105.0, lat - 35.0);
        let dlng = transformlng(lng - 105.0, lat - 35.0);
        let radlat = (lat / 180.0) * PI;
        let magic = Math.sin(radlat);
        magic = 1 - ee * magic * magic;
        let sqrtmagic = Math.sqrt(magic);
        dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
        dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
        let mglat = lat + dlat;
        let mglng = lng + dlng;
        return { lng: lng * 2 - mglng, lat: lat * 2 - mglat };
      }
    }
    let objs = [];
    for (let i = 0; i < data.length; i++) {
      let datai = data[i];
      let obj = {};
      obj.id = datai.id;
      let longitude = datai.assess_longitude;
      let latitude = datai.assess_latitude;
      let tdt = gcj02towgs84(longitude * 1, latitude * 1);
      obj.WGS84_lng = tdt.lng;
      obj.WGS84_lat = tdt.lat;
      objs.push(obj);
    }
    cb.rest.invokeFunction("GT39696AT9.MaintainerData.bachUpCoop", { data: objs }, function (err, res) {
      console.log("res", res);
    });
  });