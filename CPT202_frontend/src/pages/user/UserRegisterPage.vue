<template>
  <div id="userRegisterPage">
    <!-- Using colorful particle background, can set different color combinations -->
    <MultiColorParticlesBg
      class="particles-background"
      :colors="['#2F54EB', '#EB2F96', '#FAAD14', '#13C2C2', '#52C41A']"
      :quantity="1080"
    />

    <div class="form-card">
      <h2 class="title">{{ $t('message.welcomeToMelodyHub') }}</h2>
      <p class="subtitle">{{ $t('message.createAccount') }}</p>

      <a-form
        :model="formState"
        name="basic"
        autocomplete="off"
        @finish="handleSubmit"
        class="register-form"
        layout="vertical"
      >
        <div class="form-label">{{ $t('message.emailLabel') }}</div>
        <a-form-item
          name="email"
          :rules="[
            { required: true, message: $t('message.enterEmail') },
            { type: 'email', message: 'Please enter a valid email address' },
          ]"
        >
          <div class="input-with-button">
            <IInput
              v-model="formState.email"
              :placeholder="$t('message.enterEmail')"
              class="custom-input"
            />
            <a-button
              type="primary"
              class="send-code-button"
              :disabled="sendCodeDisabled"
              @click="sendVerificationCode"
            >
              {{ sendCodeDisabled ? sendCodeText : $t('message.sendCode') }}
            </a-button>
          </div>
        </a-form-item>

        <div class="form-label">{{ $t('message.passwordLabel') }}</div>
        <a-form-item
          name="userPassword"
          :rules="[
            { required: true, message: $t('message.enterPassword') },
            { min: 8, message: 'Password must be at least 8 characters' },
          ]"
        >
          <IInput
            v-model="formState.userPassword"
            type="password"
            :placeholder="$t('message.enterPassword')"
            class="custom-input"
          />
        </a-form-item>

        <div class="form-label">{{ $t('message.confirmPasswordLabel') }}</div>
        <a-form-item
          name="checkPassword"
          :rules="[
            { required: true, message: $t('message.enterConfirmPassword') },
            { min: 8, message: 'Confirm password must be at least 8 characters' },
          ]"
        >
          <IInput
            v-model="formState.checkPassword"
            type="password"
            :placeholder="$t('message.enterConfirmPassword')"
            class="custom-input"
          />
        </a-form-item>

        <div class="form-label">{{ $t('message.verificationCodeLabel') }}</div>
        <a-form-item
          name="code"
          :rules="[{ required: true, message: $t('message.enterVerificationCode') }]"
        >
          <IInput
            v-model="formState.code"
            :placeholder="$t('message.enterVerificationCode')"
            class="custom-input"
          />
        </a-form-item>

        <!-- Privacy policy agreement checkbox -->
        <a-form-item
          name="privacyAgreement"
          :rules="[{ required: true, message: 'Please agree to the Terms and Privacy Policy' }]"
        >
          <a-checkbox v-model:checked="formState.privacyAgreement" class="privacy-checkbox">
            I have read and agree to the 
            <a @click.prevent="showTermsModal" class="terms-link">Terms of Service, Privacy Policy, Code of User Conduct</a>
          </a-checkbox>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" class="submit-button">
            {{ $t('message.registerButton') }} →
          </a-button>
        </a-form-item>
      </a-form>

      <div class="login-link">
        {{ $t('message.hasAccount') }}
        <RouterLink to="/user/login" class="link">{{ $t('message.login') }}</RouterLink>
      </div>

      <!-- Add language switch button -->
      <div class="language-switch">
        <a @click="changeLanguage" class="language-link">
          {{ locale === 'en' ? '中文' : 'English' }}
        </a>
      </div>
    </div>
  </div>

  <!-- Combined Terms Modal -->
  <a-modal
    v-model:visible="termsModalVisible"
    title="Terms and Policies"
    :footer="null"
    @cancel="termsModalVisible = false"
    width="700px"
  >
    <div class="terms-content">
      <h1>Privacy Policy</h1>
      <div>Updated: <strong>2025/5/17</strong></div>
      <div>Effective Date: <strong>2025/5/17</strong></div>

      <h2>Introduction</h2>
      <p>
        <i>MusicRepo</i> is a product provided by <i>Liwei.Xu</i> (hereinafter referred to as "we" or "us").
        When you use our services, we may collect and use your relevant information. Through this Privacy Policy, we aim to explain how we collect, use, store, and share this information when you use our services, as well as how we provide you with access to, update, control, and protect such information.
        This Privacy Policy is closely related to the <i>MusicRepo</i> services you use, and we hope you read it carefully and make appropriate choices as guided by this policy. We strive to explain the technical terms involved in this Privacy Policy in a concise manner and provide links for further clarification to aid your understanding.
      </p>
      <p><strong>By using or continuing to use our services, you are deemed to agree to our collection, use, storage, and sharing of your relevant information in accordance with this Privacy Policy.</strong></p>
      <p>If you have any questions about this Privacy Policy or related matters, please contact us at <strong>Liwei.Xu22@student.xjtlu.edu.cn</strong>.</p>

      <h2>1. Information We Collect</h2>
      <p>We or our third-party partners may collect, store, and use the following information related to you when providing services. If you do not provide such information, you may not be able to register as our user or use certain services we offer, or achieve the intended effect of those services.</p>

      <ul>
        <li><strong>Personal Information</strong>: Information you provide to us when registering an account or using our services, such as phone number, email address, etc.</li>
      </ul>

      <h2>2. Storage of Information</h2>
      <strong>2.1 Storage Method and Duration</strong>
      <ul>
        <li>We store your information securely, including local storage (e.g., app-based caching), databases, and server logs.</li>
        <li>Generally, we only retain your personal information for the period necessary to fulfill the purposes of the service or as required by laws and regulations.</li>
      </ul>

      <strong>2.2 Storage Location</strong>
      <ul>
        <li>In accordance with laws and regulations, we store personal information collected within China in mainland China.</li>
        <li>Currently, we do not transmit or store your personal information across borders. If cross-border transmission or storage is required in the future, we will inform you of the purpose, recipient, security measures, and potential risks, and obtain your consent.</li>
      </ul>

      <strong>2.3 Notice on Service Termination</strong>
      <ul>
        <li>If our product or service ceases operation, we will notify you via push notifications, announcements, etc., and delete or anonymize your personal information within a reasonable period, except as otherwise provided by laws and regulations.</li>
      </ul>

      <h2>3. Information Security</h2>
      <p>
      We adopt various security technologies and procedures to prevent information loss, misuse, unauthorized access, or disclosure. For example, in some services, we use encryption technologies (such as SSL) to protect the personal information you provide. However, please understand that due to technical limitations and the presence of potential malicious means, even with maximum efforts to strengthen security measures, we cannot guarantee absolute security of your information. You need to be aware that the system and communication networks you use to access our services may encounter problems due to factors beyond our control.
      </p>

      <h2>4. How We Use Information</h2>
      <p>The information we collect during the process of providing services may be used for the following purposes:</p>
      <ul>
        <li>To provide you with services;</li>
        <li>To authenticate identity, provide customer service, ensure security, detect fraud, archive and back up, and ensure the security of our products and services;</li>
        <li>To help us design new services and improve existing ones;</li>
        <li>To better understand how you access and use our services, and to respond to your personalized needs, such as language settings, location settings, personalized help, and instructions;</li>
        <li>To provide you with more relevant advertising instead of general ads;</li>
        <li>To evaluate and improve the effectiveness of advertising and promotional campaigns in our services;</li>
        <li>To certify software or manage software updates;</li>
        <li>To involve you in surveys regarding our products and services.</li>
      </ul>

      <h2>5. Information Sharing</h2>
      <p>
      Currently, we do not proactively share or transfer your personal information to third parties. If such sharing or transfer becomes necessary, or you request us to do so, we or the third party will seek your explicit consent.
      </p>
      <p>
      To deliver advertisements and evaluate or optimize ad effectiveness, we may share some data with advertisers or their agents. These partners are required to strictly adhere to our privacy protection measures, including but not limited to handling data based on agreements, commitment letters, and data handling policies, avoiding identification of individuals, and ensuring privacy protection.
      </p>
      <p>
      We do not share personally identifiable information (such as your name or email address) with our partners unless you explicitly authorize us to do so.
      </p>
      <p>
      We do not publicly disclose the personal information we collect. If public disclosure is necessary, we will inform you of the purpose, type of information to be disclosed, and any sensitive data involved, and obtain your explicit consent.
      </p>
      <p>
      As our business develops, we may undergo mergers, acquisitions, or asset transfers. In such cases, we will inform you of the situation and continue to protect or require the new controller to protect your personal information in accordance with standards no less stringent than those in this Privacy Policy.
      </p>
      <p>
      In addition, in accordance with relevant laws, regulations, and national standards, we may share, transfer, or publicly disclose personal information without your prior consent under the following circumstances:
      </p>
      <ul>
        <li>Related to national security or defense;</li>
        <li>Related to public safety, public health, or major public interests;</li>
        <li>Related to criminal investigations, prosecutions, trials, and enforcement of judgments;</li>
        <li>When it is difficult to obtain consent but necessary to protect the life, property, and other major legal rights of the data subject or others;</li>
        <li>When the personal information is voluntarily disclosed by the subject to the public;</li>
        <li>When the personal information is collected from legally disclosed sources such as legal news reports or government information disclosures.</li>
      </ul>

      <h2>6. Your Rights</h2>
      <p>
      During your use of our services, we may provide appropriate settings depending on the specific product to allow you to inquire about, delete, correct, or withdraw your personal information. You can follow the provided instructions to perform such operations. We also provide complaint and reporting channels, and your feedback will be addressed promptly. If you are unable to exercise your rights through the above methods, you can contact us via the contact information provided in this Privacy Policy, and we will respond in accordance with applicable laws and regulations.
      </p>
      <p>When you decide to stop using our products or services, you can request to delete your account. After deletion, we will delete or anonymize your personal information, except as otherwise required by laws or regulations.</p>

      <h2>7. Changes</h2>
      <p>
      We may revise this Privacy Policy from time to time. When changes occur, we will notify you through updates and inform you of the effective date of the new policy. Please read the updated Privacy Policy carefully. <strong>By continuing to use our services, you agree to our handling of your personal information in accordance with the updated Privacy Policy.</strong>
      </p>

      <h2>8. Protection of Minors</h2>
      <p>
      We encourage parents or guardians to guide minors under the age of 18 in using our services. We recommend that minors encourage their parents or guardians to read this Privacy Policy, and that they seek their consent and guidance before submitting any personal information.
      </p>
    </div>
  </a-modal>

  <!-- Agreement Reminder Modal -->
  <a-modal
    v-model:visible="agreementReminderVisible"
    title="Attention"
    :footer="null"
    @cancel="agreementReminderVisible = false"
  >
    <div class="reminder-content">
      <p>Please read and agree to our Terms of Service, Privacy Policy, and Code of User Conduct to continue.</p>
    </div>
    <template #footer>
      <a-button type="primary" @click="handleAgreePrivacy">I Agree</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
// For receiving form input values
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { userRegisterUsingPost } from '@/api/userController.ts'
import { sendVerificationCodeUsingPost } from '@/api/emailController.ts'
import { message } from 'ant-design-vue'
// Import colorful particle background component
import MultiColorParticlesBg from '@/components/ui/particles-bg/MultiColorParticlesBg.vue'
// Import i18n
import { useI18n } from 'vue-i18n'
// Import custom input component
import IInput from '@/components/ui/input/IInput.vue'

const { t, locale } = useI18n()

// Language switch method
const changeLanguage = () => {
  locale.value = locale.value === 'en' ? 'zh' : 'en'
}

const formState = reactive({
  email: '',
  userPassword: '',
  checkPassword: '',
  code: '',
  userAccount: '',
  privacyAgreement: false
})

// Get router instance
const router = useRouter()
const loginUserStore = useLoginUserStore()

// Verification code button state management
const sendCodeDisabled = ref(false)
const sendCodeText = ref('Send')
const countdown = ref(60)
let timer: number | null = null

// Modal visibility states
const termsModalVisible = ref(false)
const agreementReminderVisible = ref(false)

// Modal display method - only need one now
const showTermsModal = () => {
  termsModalVisible.value = true
}

// User clicks agree in the privacy policy reminder
const handleAgreePrivacy = () => {
  formState.privacyAgreement = true
  agreementReminderVisible.value = false
}

// Send verification code
const sendVerificationCode = async () => {
  if (!formState.email) {
    message.error(t('message.enterEmail'))
    return
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formState.email)) {
    message.error(t('message.invalidEmail'))
    return
  }

  try {
    const res = await sendVerificationCodeUsingPost({
      email: formState.email,
    })

    if (res.data.code === 0) {
      message.success(t('message.codeSent'))
      startCountdown()
    } else {
      message.error(t('message.sendCodeFailed') + res.data.message)
    }
  } catch (error) {
    message.error(t('message.sendCodeFailed'))
  }
}

// Countdown functionality
const startCountdown = () => {
  sendCodeDisabled.value = true
  countdown.value = 60
  sendCodeText.value = `${countdown.value}s`

  timer = window.setInterval(() => {
    countdown.value--
    sendCodeText.value = `${countdown.value}s`

    if (countdown.value <= 0) {
      clearInterval(timer as number)
      sendCodeDisabled.value = false
      sendCodeText.value = 'Send'
    }
  }, 1000)
}

/**
 * Submit form
 * @param values
 */
const handleSubmit = async (values: any) => {
  // Check if user has agreed to privacy policy
  if (!formState.privacyAgreement) {
    agreementReminderVisible.value = true
    return
  }

  // Check if the two passwords match
  if (values.userPassword != values.checkPassword) {
    message.error(t('message.passwordMismatch'))
    return
  }

  // Build registration request data
  const registerData = {
    userAccount: values.email, // Use email as account
    userPassword: values.userPassword,
    checkPassword: values.checkPassword,
    email: values.email,
    code: values.code,
  }

  try {
    // First register
    const res = await userRegisterUsingPost(registerData)

    // Registration successful
    if (res.data.code === 0 && res.data.data) {
      // Get user account from registration response
      const userAccount = res.data.data.userAccount

      message.success(t('message.registerSuccess'))
      // Redirect to avatar upload page and pass user account
      router.push({
        path: '/user/upload-avatar',
        query: { userAccount: userAccount },
      })
    } else {
      message.error(t('message.registerFailed') + res.data.message)
    }
  } catch (error) {
    message.error(t('message.registerFailed'))
  }
}
</script>

<style scoped>
#userRegisterPage {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f5f5f5;
}

/* Particle background styles */
.particles-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

/* Form card styles */
.form-card {
  width: 100%;
  max-width: 450px;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
  overflow-y: auto;
  max-height: 90vh;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.register-form {
  width: 100%;
}

.custom-input {
  width: 100%;
  border-radius: 4px;
  transition: all 0.3s;
}

.input-with-button {
  display: flex;
  gap: 8px;
}

.input-with-button .custom-input {
  flex-grow: 1;
}

.send-code-button {
  border-radius: 4px;
  min-width: 60px;
  background-color: #1890ff;
}

.submit-button {
  width: 100%;
  height: 45px;
  border-radius: 4px;
  background-color: #000;
  border: none;
  font-weight: 500;
  font-size: 16px;
  margin-top: 20px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-button:hover {
  background-color: #333;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

.link {
  color: #1890ff;
  text-decoration: none;
  font-weight: 500;
}

.link:hover {
  text-decoration: underline;
}

/* Language switch button */
.language-switch {
  position: absolute;
  top: 15px;
  right: 15px;
}

.language-link {
  color: #1890ff;
  cursor: pointer;
  font-size: 14px;
}

.language-link:hover {
  text-decoration: underline;
}

/* Privacy policy styles */
.privacy-checkbox {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
  font-size: 12px;
  color: #666;
}

.terms-link {
  color: #1890ff;
  text-decoration: none;
  font-size: 12px;
}

.terms-link:hover {
  text-decoration: underline;
}

.terms-content {
  max-height: 400px;
  overflow-y: auto;
  padding: 10px 0;
}

.terms-content h3 {
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 600;
}

.terms-content h3:first-child {
  margin-top: 0;
}

.reminder-content {
  padding: 20px 0;
  text-align: center;
}
</style>
