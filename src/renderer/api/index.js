export const Code = {
  //成功
  SUCCESS: 10000, //请求成功
}

const oauth_base_url_dev = "/apis"
const urlQa = ''
let excelUrl = ''
process.env.NODE_ENV === 'development' ? excelUrl = oauth_base_url_dev : excelUrl = urlQa

export const Service = {
  //TODI auth
  Login: excelUrl + '/oauth/2.0/token?grant_type=client_credentials&client_id=oITaFmaN0oxgbwH5PC7bOfsd&client_secret=QD0jhafwbleq4GrbYb31Eyd6x1NhGkdj',
}

