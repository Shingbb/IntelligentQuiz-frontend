<template>
  <div id="addQuestionPage">
    <h2 style="margin-bottom: 32px">设置题目</h2>
    <a-form
      :model="questionContent"
      :style="{ width: '480px' }"
      label-align="left"
      auto-label-width
      @submit="handleSubmit"
    >
      <a-form-item label="应用 id">
        {{ appId }}
      </a-form-item>
      <a-form-item label="题目列表" :content-flex="false" :merge-props="false">
        <!-- 提供底部添加题目的功能按钮 -->
        <a-button @click="addQuestion(questionContent.length)">
          底部添加题目
        </a-button>
        <!-- 遍历已有的题目，提供编辑和删除功能 -->
        <!-- 遍历每道题目 -->
        <div v-for="(question, index) in questionContent" :key="index">
          <a-space size="large">
            <h3>题目 {{ index + 1 }}</h3>
            <!-- 提供在当前题目前添加新题目的功能按钮 -->
            <a-button size="small" @click="addQuestion(index + 1)">
              添加题目
            </a-button>
            <!-- 提供删除当前题目的功能按钮 -->
            <a-button
              size="small"
              status="danger"
              @click="deleteQuestion(index)"
            >
              删除题目
            </a-button>
          </a-space>
          <!-- 题目标题输入框 -->
          <a-form-item field="posts.post1" :label="`题目 ${index + 1} 标题`">
            <a-input v-model="question.title" placeholder="请输入标题" />
          </a-form-item>
          <!-- 题目选项操作区域 -->
          <!--  题目选项 -->
          <a-space size="large">
            <h4>题目 {{ index + 1 }} 选项列表</h4>
            <!-- 提供在选项列表底部添加新选项的功能按钮 -->
            <a-button
              size="small"
              @click="addQuestionOption(question, question.options.length)"
            >
              底部添加选项
            </a-button>
          </a-space>
          <!-- 遍历当前题目的选项，提供编辑和删除功能 -->
          <a-form-item
            v-for="(option, optionIndex) in question.options"
            :key="optionIndex"
            :label="`选项 ${optionIndex + 1}`"
            :content-flex="false"
            :merge-props="false"
          >
            <!-- 选项的 key 输入框 -->
            <a-form-item label="选项 key">
              <a-input v-model="option.key" placeholder="请输入选项 key" />
            </a-form-item>
            <!-- 选项的值输入框 -->
            <a-form-item label="选项值">
              <a-input v-model="option.value" placeholder="请输入选项值" />
            </a-form-item>
            <!-- 选项的结果输入框 -->
            <a-form-item label="选项结果">
              <a-input v-model="option.result" placeholder="请输入选项结果" />
            </a-form-item>
            <!-- 选项的得分输入框 -->
            <a-form-item label="选项得分">
              <a-input-number
                v-model="option.score"
                placeholder="请输入选项得分"
              />
            </a-form-item>
            <!-- 选项操作区域，提供添加和删除选项的功能按钮 -->
            <a-space size="large">
              <a-button
                size="mini"
                @click="addQuestionOption(question, optionIndex + 1)"
              >
                添加选项
              </a-button>
              <a-button
                size="mini"
                status="danger"
                @click="deleteQuestionOption(question, optionIndex as any)"
              >
                删除选项
              </a-button>
            </a-space>
          </a-form-item>
          <!-- 题目选项结尾 -->
        </div>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 120px">
          提交
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, watchEffect, withDefaults } from "vue";
import API from "@/api";
import { useRouter } from "vue-router";
import {
  addQuestionUsingPost,
  editQuestionUsingPost,
  listQuestionVoByPageUsingPost,
} from "@/api/questionController";
import message from "@arco-design/web-vue/es/message";

interface Props {
  appId: string;
}

const props = withDefaults(defineProps<Props>(), {
  appId: () => {
    return "";
  },
});

const router = useRouter();

// 题目内容结构（理解为题目列表）
const questionContent = ref<API.QuestionContentDTO[]>([]);

/**
 * 添加题目
 * @param index
 */
const addQuestion = (index: number) => {
  questionContent.value.splice(index, 0, {
    title: "",
    options: [],
  });
};

/**
 * 删除题目
 * @param index
 */
const deleteQuestion = (index: number) => {
  questionContent.value.splice(index, 1);
};

/**
 * 添加题目选项
 *  此函数用于在给定问题的选项数组中指定位置插入一个新的选项对象。
 *  如果问题的选项数组不存在，则先创建一个空数组。
 *
 * @param question API.QuestionContentDTO 类型的问题对象，包含问题的详细信息。
 *  * @param index number 类型的参数，表示新选项将插入的位置。
 */
const addQuestionOption = (question: API.QuestionContentDTO, index: number) => {
  // 检查question.options是否存在，如果不存在，则初始化为一个空数组
  if (!question.options) {
    question.options = [];
  }
  // 在指定位置插入一个新的选项对象，对象的key和value初始值为空字符串
  question.options.splice(index, 0, {
    key: "",
    value: "",
  });
};

/**
 * 删除题目选项
 *
 * 该函数用于从一个题目对象中删除指定索引的选项。如果题目对象的options属性不存在，
 * 则先初始化为一个空数组，然后再进行删除操作。
 *
 * @param question API.QuestionContentDTO 题目对象，包含选项列表
 * @param index number 要删除的选项的索引位置
 */
const deleteQuestionOption = (
  question: API.QuestionContentDTO,
  index: number
) => {
  // 检查question.options是否存在，如果不存在则初始化为一个空数组
  if (!question.options) {
    question.options = [];
  }
  // 使用splice方法从选项数组中删除指定索引的选项
  question.options.splice(index, 1);
};

const oldQuestion = ref<API.QuestionVO>();

/**
 * 加载数据
 */
const loadData = async () => {
  if (!props.appId) {
    return;
  }
  const res = await listQuestionVoByPageUsingPost({
    appId: props.appId as any,
    current: 1,
    pageSize: 1,
    sortField: "createTime",
    sortOrder: "descend",
  });
  if (res.data.code === 0 && res.data.data?.records) {
    oldQuestion.value = res.data.data?.records[0];
    if (oldQuestion.value) {
      questionContent.value = oldQuestion.value.questionContent ?? [];
    }
  } else {
    message.error("获取数据失败，" + res.data.message);
  }
};

// 获取旧数据
watchEffect(() => {
  loadData();
});

/**
 * 提交
 */
const handleSubmit = async () => {
  if (!props.appId || !questionContent.value) {
    return;
  }
  let res: any;
  // 如果是修改
  if (oldQuestion.value?.id) {
    res = await editQuestionUsingPost({
      id: oldQuestion.value.id,
      questionContent: questionContent.value,
    });
  } else {
    // 创建
    res = await addQuestionUsingPost({
      appId: props.appId as any,
      questionContent: questionContent.value,
    });
  }
  if (res.data.code === 0) {
    message.success("操作成功，即将跳转到应用详情页");
    setTimeout(() => {
      router.push(`/app/detail/${props.appId}`);
    }, 3000);
  } else {
    message.error("操作失败，" + res.data.message);
  }
};
</script>
