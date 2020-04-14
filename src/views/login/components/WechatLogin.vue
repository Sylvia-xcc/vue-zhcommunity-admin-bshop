<template>
    <div class="flex align-center flex-direction">
        <div class="text-xxl text-bold">微信
            <span class="text-red">扫一扫</span>
        </div>
        <div class="text-xxl text-bold padding-top-xs">快速登录</div>
        <el-image
            class="margin-tb"
            style="width: 200px; height: 200px;border: 1px solid #eee;"
            :src="qrcode"
            fit="fit"
            v-if="!login"
        ></el-image>
        <div class="sureCon margin-tb" v-else>
            <i class="el-icon-success text-green text-sl"></i>
            <div class="margin-top-xs">扫描成功</div>
            <div class="text-sm">请在手机端确认登录</div>
        </div>
    </div>
</template>

// <script src="https://unpkg.com/mqtt/dist/mqtt.min.js"></script>
<script>
import mqtt from "mqtt";
import { wechatLogin } from "@/api/user";

let client = {};

const options = {
  clean: true, // 保留回话
  connectTimeout: 4000, // 超时时间
  clientId: "" // 认证信息
};
// client = mqtt.connect('ws://47.97.42.146:8083/mqtt', options)
export default {
  data() {
    return {
      qrcode: "",
      topic: "",
      clientId: "",
      login: false,
    };
  },
  created() {
    this.getQrcode();
  },
  methods: {
    getQrcode() {
      wechatLogin("pages/video/video-detail/video-detail").then(res => {
        this.qrcode = res.base64;
        this.topic = res.topic;
        this.clientId = res.clientId;
        options.clientId = res.clientId;
        client = mqtt.connect(
          "ws://47.97.42.146:8083/mqtt",
          options
        );
        this.mqttMsg();
      });
    },
    mqttMsg() {
      client.on("connect", e => {
        console.log("连接成功！！！");
        client.subscribe(this.topic, { qos: 0 }, error => {
          if (!error) {
            console.log("订阅成功");
          } else {
            console.log("订阅失败");
          }
        });
      });
      client.on("reconnect", error => {
        console.log("正在重连:", error);
      });

      client.on("error", error => {
        console.log("连接失败:", error);
      });
      // 接收消息处理
      client.on("message", (topic, message) => {
        console.log("收到来自", topic, "的消息", message.toString());
        let msg = JSON.parse(message.toString());
        if (msg.type == 1) {
          let token = msg.data.token;
          this.selfTopic = msg.data.selfTopic;
        //   this.sendMsg({type:1, data:true});
        let data = {type:1, data:true};
        client.publish(this.selfTopic, JSON.stringify(data), { qos: 1, rein: false },
            error => {
                console.log(error || "发布成功");
            }
        );
          this.$store .dispatch("user/loginQrcode", token) .then(res => {
            this.$router.push({ path: this.redirect || "/", query: this.otherQuery });
          });
        } else if (msg.type == 2) {
          this.login = msg.data;
        }
      });
    }
  },
  sendMsg(data) {
    client.publish(
      this.selfTopic,
      JSON.stringify(data),
      {
        qos: 1,
        rein: false
      },
      error => {
        console.log(error || "发布成功");
      }
    );
  }
};
</script>

<style lang="scss" scoped>
.sureCon {
  width: 200px;
  height: 200px;
  border: 1px solid #eee;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}
</style>

