import $ from 'jquery'
import axios from 'axios'
import { decrypt } from './dist/decrypt';
import ThreeMap from './ThreeMap';

// axios.get('./map/china.json').then(res=>{
//     console.log(res);
// })
$.get('./map/line.json',data=>{
    // data乱码
    console.log(data);
    // 解码
    // const mapData=decrypt.decode(data)
    // console.log(data);
    const map = new ThreeMap(data);
})
