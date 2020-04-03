<template>
  <div id="job" v-loading="loading">
    <el-button style="margin-bottom:1rem" type="primary" plain @click="addEl">添加</el-button>
    <div v-if="lists.length > 0">
      <div style="margin-top:1rem;margin-bottom:1rem">
        当前时间
        <span v-text="ttime"></span>
      </div>
      <el-form
        :inline="true"
        label-width="80px"
        :key="'index'+index"
        :span="24"
        v-for="(list,index) in lists"
      >
        <el-form-item>
          <el-dropdown @command="selectWeek" :hide-on-click="false">
            <el-button type="primary">
              <span v-text="getWeek(list.week)"></span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="[index,wi]" v-for="(w,wi) in week" :key="'wi_'+wi">{{w}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>

        <el-form-item label="时间" style="width:20rem">
          <el-time-picker v-model="list.time" placeholder="任意时间点"/>
        </el-form-item>

        <el-form-item label="做啥" style="width:20rem">
          <el-input v-model="list.job"></el-input>
        </el-form-item>

        <el-form-item label="操作">
          <!-- <el-button :type="getType([list.needExe,0])" @click="setStatus([list._id,false])">关闭</el-button>
          <el-button :type="getType([list.needExe,1])" @click="setStatus([list._id,true])">开启</el-button>-->
          <el-button @click="del(list._id)">删除</el-button>
        </el-form-item>
      </el-form>
      <el-button @click="change">保存</el-button>
    </div>
    <audio ref="audio1" :src="audio_url">您的浏览器不支持 audio 标签。</audio>
  </div>
</template>

<script>
import { add, remove, update, find } from "../db/jobCURD";
import { getRunTime, getRetnW } from "../util/index";
import { getToken } from "../util/auto";

export default {
  name: "job",
  data() {
    return {
      audio_url: "",
      ttime: "",
      loading: true,
      week: {
        "0": "每天",
        "1": "星期一",
        "2": "星期二",
        "3": "星期三",
        "4": "星期四",
        "5": "星期五",
        "6": "星期六",
        "7": "星期日"
      },
      lists: [],
      lists_bak: [],
      job: null,
      tok:
        "24.3d43e4667033d3b58fb1bdd1a77cee4f.2592000.1588339023.282335-19206228",
      week_num: "0"
    };
  },
  mounted() {
    this.loading = true;
    this.init();
    this.week_num = getRetnW();
  },
  methods: {
    runJob() {
      var date = new Date();
      this.ttime = getRunTime(date);

      for (let i = 0; i < this.lists.length; i++) {
        let t = getRunTime(this.lists[i].time);

        let needExeJob = false;
        if (t == this.ttime && this.week_num == this.lists[i].week) {
          needExeJob = true;
        }

        if (t == this.ttime && this.lists[i].week == "0") {
          needExeJob = true;
        }
        if (needExeJob) {
          console.log("执行任务");
          this.tok = getToken();
          console.log("token:", this.tok);
          this.audio_url =
            "http://tsn.baidu.com/text2audio?lan=zh&ctp=1&cuid=abcdxxx&tex=" +
            this.lists[i].job +
            "&per=0&spd=5&pit=5&aue=3&tok=" +
            this.tok;
          let audio = new Audio();
          audio.src = this.audio_url;
          audio.play();
        }
      }
    },
    setStatus(item) {
      let v = this.lists.find(list => {
        return (list._id = item[0]);
      });
      if (v) {
        if (v.needExe != item[1]) {
          update({ _id: v._id }, { needExe: item[1] }).then(res => {
            if (res > 0) {
              this.init();
            }
          });
        }
      }
    },
    init() {
      this.lists_bak = [];
      this.lists = [];
      find({}).then(lists => {
        this.loading = false;

        console.log("lists:", lists);
        this.lists = lists;
        if (this.lists.length > 0) {
          this.lists_bak = lists;
          this.lists.sort((a, b) => {
            return a.week - b.week;
          });
          clearInterval(this.job); // 清除定时器
          this.job = null;
          this.job = setInterval(this.runJob, 1000);
          console.log("ok");
          this.$emit("init", this.lists);
        }
      });
    },
    getType(item) {
      console.log(item);
      if (item[0] && item[1] == 1) {
        return "success";
      }

      if (!item[0] && item[1] == 0) {
        return "success";
      }
    },
    selectWeek(item) {
      for (let i = 0; i < this.lists.length; i++) {
        if (i == item[0]) {
          this.lists[i].week = item[1];
        }
      }
    },
    getWeek(num) {
      return this.week[num];
    },
    addEl() {
      this.lists.push({
        time: new Date(),
        week: "0",
        job: "",
        needExe: true,
        _id: Number(new Date().getTime())
      });
    },
    del(_id) {
      this.loading = true;
      console.log(_id);
      if (!isNaN(_id)) {
        //清除本地的就行了
        this.lists.splice(this.lists.find(item => item._id === _id), 1);
        this.loading = false;
      } else {
        //删除db
        remove({ _id }).then(res => {
          if (res > 0) {
            this.init();
          }
        });
      }
    },
    insert(data) {
      add(data).then(res => {
        console.log("res -- ", res);
      });
    },
    change() {
      this.loading = true;
      for (let i = 0; i < this.lists.length; i++) {
        let new_list = this.lists[i];
        if (!new_list.job) {
          continue;
        }

        let _id = new_list._id;
        console.log("需要更新", isNaN(_id));
        if (isNaN(_id)) {
          update({ _id }, new_list).then(res => {});
        } else {
          new_list._id = "ActingCute_" + this.lists[i]._id;
          this.insert(new_list);
        }
      }
      this.init();
    }
  }
};
</script>

<style>
</style>
