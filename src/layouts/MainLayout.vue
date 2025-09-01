<template>
  <div class="min-h-screen flex bg-gradient-to-br from-sky-50 via-indigo-50 to-violet-50">
    <aside class="w-64 border-r border-slate-200/70 bg-white/70 backdrop-blur p-4">
      <NavBar />
    </aside>
    <main class="flex-1 p-6">
      <div class="max-w-6xl mx-auto">
        <router-view />
      </div>
    </main>
  </div>
</template>
