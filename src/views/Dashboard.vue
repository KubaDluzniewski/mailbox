<template>
  <div class="h-full rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
    <div class="max-w-4xl space-y-6">
      <div>
        <p class="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Overview</p>
        <h1 class="text-2xl font-semibold tracking-tight text-zinc-900">{{ $t('titles.dashboard') }}</h1>
        <p class="mt-2 text-sm text-zinc-600">{{ $t('pages.dashboard.desc') }}</p>
      </div>

      <div class="grid gap-4 sm:grid-cols-3">
        <div class="rounded-xl border border-stone-200 bg-stone-50 p-4">
          <p class="text-xs uppercase tracking-wide text-zinc-500">Inbox</p>
          <p class="mt-2 text-2xl font-semibold text-zinc-900">--</p>
        </div>
        <div class="rounded-xl border border-stone-200 bg-stone-50 p-4">
          <p class="text-xs uppercase tracking-wide text-zinc-500">Sent</p>
          <p class="mt-2 text-2xl font-semibold text-zinc-900">--</p>
        </div>
        <div class="rounded-xl border border-stone-200 bg-stone-50 p-4">
          <p class="text-xs uppercase tracking-wide text-zinc-500">Drafts</p>
          <p class="mt-2 text-2xl font-semibold text-zinc-900">--</p>
        </div>
      </div>
    </div>
  </div>
</template>
