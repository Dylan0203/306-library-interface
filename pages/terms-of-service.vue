<template>
  <div>
    <main id="main-content" class="p-4 max-w-4xl mx-auto">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 md:p-8">
        <h1
          class="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white"
        >
          服務條款
        </h1>

        <div class="prose dark:prose-invert max-w-none">
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            最後更新日期: {{ lastUpdated }}
          </p>

          <section class="mb-8">
            <h2
              class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white"
            >
              1. 接受條款
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4">
              歡迎使用 306 圖書館借閱系統(以下簡稱「本系統」)。使用本系統即表示您同意遵守以下服務條款。如果您不同意這些條款,請勿使用本系統。
            </p>
          </section>

          <section class="mb-8">
            <h2
              class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white"
            >
              2. 服務說明
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4">
              本系統提供以下服務:
            </p>
            <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
              <li class="mb-2">瀏覽圖書館可借閱書籍</li>
              <li class="mb-2">線上借閱書籍</li>
              <li class="mb-2">查看個人借閱記錄</li>
              <li class="mb-2">線上歸還書籍</li>
              <li class="mb-2">圖書資訊查詢</li>
            </ul>
            <p class="text-gray-700 dark:text-gray-300 mb-4">
              我們保留隨時修改、暫停或終止服務的權利,恕不另行通知。
            </p>
          </section>

          <section class="mb-8">
            <h2
              class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white"
            >
              3. 帳戶註冊與使用
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4">
              使用本系統需要透過 Google 帳戶登入。您同意:
            </p>
            <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
              <li class="mb-2">提供真實、準確的個人資訊</li>
              <li class="mb-2">保護您的帳戶安全,不與他人共享</li>
              <li class="mb-2">對使用您帳戶進行的所有活動負責</li>
              <li class="mb-2">如發現帳戶被未經授權使用,立即通知我們</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2
              class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white"
            >
              4. 借閱規則
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4">使用借閱服務時:</p>
            <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
              <li class="mb-2">
                每位使用者可同時借閱的書籍數量由圖書館管理員設定
              </li>
              <li class="mb-2">借閱期限依書籍類型而定</li>
              <li class="mb-2">逾期歸還可能會影響您的借閱權限</li>
              <li class="mb-2">您有責任妥善保管借閱的書籍</li>
              <li class="mb-2">
                如遺失或損壞書籍,您需要負責賠償或購買相同書籍
              </li>
              <li class="mb-2">請按照系統指示完成歸還流程</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2
              class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white"
            >
              5. 使用限制
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4">
              使用本系統時,您不得:
            </p>
            <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
              <li class="mb-2">使用自動化工具或機器人存取系統</li>
              <li class="mb-2">嘗試未經授權存取系統或資料</li>
              <li class="mb-2">干擾或破壞系統的正常運作</li>
              <li class="mb-2">上傳惡意軟體或病毒</li>
              <li class="mb-2">冒充他人或提供虛假資訊</li>
              <li class="mb-2">從事任何非法活動</li>
              <li class="mb-2">濫用借閱功能或惡意預約</li>
            </ul>
            <p class="text-gray-700 dark:text-gray-300 mb-4">
              違反上述規定可能導致帳戶暫停或終止。
            </p>
          </section>

          <section class="mb-8">
            <h2
              class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white"
            >
              6. 智慧財產權
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4">
              本系統的所有內容,包括但不限於文字、圖片、介面設計、程式碼、商標和標誌,均受智慧財產權法保護。未經授權,您不得複製、修改、分發或使用這些內容。
            </p>
          </section>

          <section class="mb-8">
            <h2
              class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white"
            >
              7. 免責聲明
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4">
              本系統按「現狀」提供,我們不保證:
            </p>
            <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
              <li class="mb-2">服務不會中斷或無錯誤</li>
              <li class="mb-2">所有書籍資訊完全準確</li>
              <li class="mb-2">系統完全安全或不受病毒影響</li>
              <li class="mb-2">滿足您的特定需求</li>
            </ul>
            <p class="text-gray-700 dark:text-gray-300 mb-4">
              我們不對因使用或無法使用本系統而造成的任何直接、間接、附帶、特殊或後果性損害負責。
            </p>
          </section>

          <section class="mb-8">
            <h2
              class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white"
            >
              8. 資料隱私
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4">
              我們重視您的隱私。有關我們如何收集、使用和保護您的個人資料,請參閱我們的
              <NuxtLink
                to="/privacy-policy"
                class="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                隱私權政策
              </NuxtLink>
              。
            </p>
          </section>

          <section class="mb-8">
            <h2
              class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white"
            >
              9. 服務變更與終止
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4">
              我們保留以下權利:
            </p>
            <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
              <li class="mb-2">隨時修改或更新本服務條款</li>
              <li class="mb-2">暫停或終止您的帳戶(如違反條款)</li>
              <li class="mb-2">變更、暫停或終止服務的任何部分</li>
              <li class="mb-2">修改借閱規則和政策</li>
            </ul>
            <p class="text-gray-700 dark:text-gray-300 mb-4">
              重大變更時,我們會在系統上發布通知。繼續使用服務即表示您接受更新後的條款。
            </p>
          </section>

          <section class="mb-8">
            <h2
              class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white"
            >
              10. 爭議解決
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4">
              如對本服務條款或服務使用有任何爭議,應首先嘗試透過友好協商解決。如無法達成協議,雙方同意將爭議提交至中華民國法院管轄。
            </p>
          </section>

          <section class="mb-8">
            <h2
              class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white"
            >
              11. 適用法律
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4">
              本服務條款受中華民國法律管轄並依其解釋。
            </p>
          </section>

          <section class="mb-8">
            <h2
              class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white"
            >
              12. 聯絡我們
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4">
              如對本服務條款有任何疑問,請聯絡:
            </p>
            <ul class="list-none pl-0 mb-4 text-gray-700 dark:text-gray-300">
              <li class="mb-2">
                <strong>系統管理員:</strong> 306 Library Team
              </li>
              <li class="mb-2">
                <strong>聯絡電子郵件:</strong>
                <a
                  href="mailto:developer@odd.team"
                  class="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  developer@odd.team
                </a>
              </li>
            </ul>
          </section>

          <div
            class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20 -mx-6 md:-mx-8 px-6 md:px-8 pb-6"
          >
            <p class="text-sm text-gray-700 dark:text-gray-300 mb-2">
              <strong>重要提醒:</strong>
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              使用本系統即表示您已閱讀、理解並同意遵守本服務條款及隱私權政策。如果您不同意任何條款,請立即停止使用本系統。
            </p>
          </div>
        </div>

        <!-- Back to Home Button -->
        <div class="mt-8 flex justify-center">
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            ← 返回首頁
          </NuxtLink>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// Page metadata
useHead({
  title: "服務條款 - 306 Library System",
  meta: [
    {
      name: "description",
      content: "306 圖書館借閱系統服務條款 - 了解使用本系統的規則與條件",
    },
  ],
});

// Last updated date
const lastUpdated = "2025年10月22日";
</script>
