<template>
  <footer class="bg-gray-100 text-gray-700 py-8 mt-12 border-t border-gray-300">
    <div class="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Логотип -->
      <div class="flex flex-col gap-2">
        <Logo />
        <p class="text-sm text-gray-600">
          Платформа для подачи и обработки заявлений и справок онлайн.
        </p>
      </div>

      <!-- Навигационные ссылки -->
      <div>
        <h4 class="font-semibold mb-2">Навигация</h4>
        <ul class="space-y-1 text-sm">
          <li><a href="/" class="hover:text-red-600">Главная</a></li>
          <li><a href="/requests" class="hover:text-red-600">Мои заявки</a></li>
          <li><a href="/templates" class="hover:text-red-600">Шаблоны</a></li>
          <li><a href="/support" class="hover:text-red-600">Помощь</a></li>
        </ul>
      </div>

      <!-- Доп. информация -->
      <div>
        <h4 class="font-semibold mb-2">Информация</h4>
        <ul class="space-y-1 text-sm">
          <li>
            Поддержка:
            <a href="mailto:support@edu-docs.kz" class="text-red-600"
              >support@edu-docs.kz</a
            >
          </li>
          <li>Время обработки: Пн–Пт, 09:00–18:00</li>
          <li>Подпись документов через ЭЦП</li>
        </ul>
      </div>
    </div>

    <div class="mt-6 border-t pt-4 text-center text-xs text-gray-500">
      © {{ new Date().getFullYear() }} EduDocs. Все права защищены.
    </div>
  </footer>
</template>

<script setup>
import Logo from './Logo.vue';

</script>
