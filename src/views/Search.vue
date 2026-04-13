<template>
  <div class="h-full rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 flex flex-col gap-6">
    <div class="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4">
      <div>
        <p class="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Explore</p>
        <h1 class="text-2xl font-semibold tracking-tight text-zinc-900">{{ $t('titles.search') }}</h1>
      </div>
      <div class="w-full sm:w-80">
        <input
          type="text"
          :placeholder="$t('main.search')"
          class="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-zinc-600"
        />
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <div class="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-5">
        <p class="text-sm font-semibold text-zinc-700 mb-2">{{ $t('pages.search.desc') }}</p>
        <p class="text-xs text-zinc-500">
          W tym miejscu pojawia sie lista wynikow i filtry wyszukiwania.
        </p>
      </div>
      <div class="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-5">
        <p class="text-sm font-semibold text-zinc-700 mb-2">Szybkie podpowiedzi</p>
        <p class="text-xs text-zinc-500">Uzyj filtrow po dacie, nadawcy i statusie wiadomosci.</p>
      </div>
    </div>
  </div>
</template>
