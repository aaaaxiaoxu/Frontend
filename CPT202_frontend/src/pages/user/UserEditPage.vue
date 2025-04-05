<template>
  <div id="userEditPage">
    <a-card title="Personal Information" style="width: 600px; margin: 50px auto">
      <a-form
        :model="userForm"
        name="userForm"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
        @finish="onFinish"
      >
        <!-- User Avatar -->
        <a-form-item label="Avatar" name="userAvatar">
          <div class="avatar-wrapper">
            <a-avatar :size="100" :src="userForm.userAvatar" />
            <div style="margin-top: 16px">
              <a-input 
                v-model:value="userForm.userAvatar" 
                placeholder="Enter avatar URL" 
                style="width: 100%"
              />
            </div>
          </div>
        </a-form-item>

        <!-- User Account (read-only) -->
        <a-form-item label="Account" name="userAccount">
          <a-input v-model:value="userForm.userAccount" disabled />
        </a-form-item>

        <!-- User Name -->
        <a-form-item 
          label="Username" 
          name="userName"
          :rules="[{ required: true, message: 'Please input your username!' }]"
        >
          <a-input v-model:value="userForm.userName" />
        </a-form-item>

        <!-- User Profile -->
        <a-form-item label="Profile" name="userProfile">
          <a-textarea 
            v-model:value="userForm.userProfile" 
            :rows="4" 
            placeholder="Tell us about yourself"
          />
        </a-form-item>

        <!-- User Role (read-only) -->
        <a-form-item label="Role" name="userRole">
          <a-tag :color="userForm.userRole === 'admin' ? 'green' : 'blue'">
            {{ userForm.userRole }}
          </a-tag>
        </a-form-item>

        <!-- Submit Button -->
        <a-form-item :wrapper-col="{ offset: 6, span: 16 }">
          <a-button type="primary" html-type="submit" :loading="loading">Save Changes</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts';
import { updateUserUsingPost } from '@/api/userController.ts';
import { useRouter, useRoute } from 'vue-router';


const router = useRouter();
const route = useRoute();

// Get login user store
const loginUserStore = useLoginUserStore();
const loading = ref(false);

// Initialize form with current user data
const userForm = reactive({
  id: loginUserStore.loginUser.id,
  userAccount: loginUserStore.loginUser.userAccount,
  userName: loginUserStore.loginUser.userName,
  userAvatar: loginUserStore.loginUser.userAvatar,
  userProfile: loginUserStore.loginUser.userProfile,
  userRole: loginUserStore.loginUser.userRole
});

// Submit form handler
const onFinish = async () => {
  try {
    loading.value = true;
    
    // Prepare update request
    const updateRequest = {
      id: userForm.id,
      userName: userForm.userName,
      userAvatar: userForm.userAvatar,
      userProfile: userForm.userProfile
    };
    
    // Call API to update user
    const res = await updateUserUsingPost(updateRequest);
    
    if (res.data.code === 0) {
      message.success('Your information has been updated successfully');
      
      // Update local user data
      await loginUserStore.fetchLoginUser();
      
      // Redirect to previous page or home page
      if (route.query.redirect) {
        // If there's a redirect query parameter, use it
        router.push(route.query.redirect as string);
      } else if (route.query.from) {
        // If there's a from query parameter, use it
        router.push(route.query.from as string);
      } else {
        // Otherwise, go back to the previous page or home if no history
        router.go(-1);
      }
    } else {
      message.error('Failed to update: ' + res.data.message);
    }
  } catch (error) {
    message.error('An error occurred: ' + error);
  } finally {
    loading.value = false;
  }
};

// Load user data when component mounts
onMounted(async () => {
  // Refresh user data from server
  await loginUserStore.fetchLoginUser();
  
  // Update form with fresh data
  Object.assign(userForm, {
    id: loginUserStore.loginUser.id,
    userAccount: loginUserStore.loginUser.userAccount,
    userName: loginUserStore.loginUser.userName,
    userAvatar: loginUserStore.loginUser.userAvatar,
    userProfile: loginUserStore.loginUser.userProfile,
    userRole: loginUserStore.loginUser.userRole
  });
});




</script>

<style scoped>
.avatar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#userEditPage {
  padding: 24px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 64px);
}
</style>