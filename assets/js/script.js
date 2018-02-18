const data = dataset;

console.log(data)

const app = new Vue({
  el: '#container',
  data: data,
  methods: {
    getClass: (t,s,c) => [t, s == undefined ? 'small' : s, c],
    getImg: (i) => i != undefined ? './assets/img/' + i : false
  }
})