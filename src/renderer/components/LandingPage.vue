<template>
  <div id="wrapper">
    <div id="mytitle">
      <Titlebtn type="min"/>
      <Titlebtn type="max"/>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="当前任务" name="first">
        <div v-if="lists.length > 0">
          <el-table :data="lists" style="width: 100%">
            <el-table-column label="时间">
              <template slot-scope="scope">
                <span v-text="getTime(scope.row.time)"></span>
              </template>
            </el-table-column>
            <el-table-column prop="job" label="干啥"></el-table-column>
          </el-table>
        </div>
        <div v-else>还没有呢~</div>
      </el-tab-pane>
      <el-tab-pane label="任务列表" name="second">
        <Job @init="init"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { FormatGoTimeUnix, getRunTime, getRetnW } from "../util/index";

import { checkLoginDB } from "../util/auto";

import Job from "./Job";
import Titlebtn from "./Titlebtn.vue";

export default {
  name: "index",
  components: { Job, Titlebtn },
  data() {
    return {
      lists: [],
      activeName: "first"
    };
  },
  mounted() {
    if (process.env.NODE_ENV != "development") {
      new this.$vconsole();
    }
    checkLoginDB();
  },
  methods: {
    minbt() {
      var ipc = require("electron").ipcRenderer;
      console.log("hello vscode! min");
      ipc.send("window-min");
    },
    init(lists) {
      console.log("传值", lists);
      //提取今天的任务
      let w = getRetnW();
      console.log(w);
      this.lists = [];
      for (let i = 0; i < lists.length; i++) {
        let rw = lists[i].week;
        if (rw == "0" || rw == w) {
          this.lists.push(lists[i]);
        }
      }
    },
    getTime(time) {
      return getRunTime(time);
    }
  }
};
</script>

<style>
#mytitle {
  position: absolute;
  width: 100%;
  height: 52px;
  -webkit-app-region: drag;
  top: 0;
}

.el-tabs {
  margin-top: 60px;
  padding: 1rem;
}

body {
  margin: 0;
}

body:before {
  background: url(https://lovely.haibarai.com/bg1.jpg) no-repeat;
  background-size: cover;
  width: 100%;
  height: 100%;
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1; /*-1 可以当背景*/
  -webkit-filter: blur(3px);
  filter: blur(3px);
}
</style>
