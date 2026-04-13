<template>
  <div class="flex h-full flex-col gap-4 xl:flex-row">
    <div
      class="w-full xl:w-[420px] xl:min-w-[420px] flex flex-col rounded-2xl border border-stone-200 bg-white overflow-hidden"
    >
      <div class="p-4 border-b border-stone-200 flex justify-between items-center shrink-0 bg-stone-50">
        <h2 class="text-lg font-semibold tracking-tight text-zinc-900">{{ t('groups.title') }}</h2>
        <Button icon="pi pi-refresh" class="p-button-sm p-button-rounded p-button-text text-zinc-600" @click="loadData" />
      </div>

      <div class="px-4 py-3 border-b border-stone-200 bg-white">
        <input
          v-model="search"
          type="text"
          :placeholder="t('groups.search')"
          class="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-zinc-600 transition-colors"
        />
      </div>

      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <div v-if="loading" class="p-4 space-y-3">
          <div v-for="i in 5" :key="i" class="h-20 bg-stone-100 rounded-lg animate-pulse"></div>
        </div>

        <div
          v-else-if="filteredGroups.length === 0"
          class="flex flex-col items-center justify-center h-full text-zinc-400 p-8 text-center"
        >
          <i class="pi pi-users text-4xl mb-3 opacity-30"></i>
          <p class="font-medium text-zinc-500">{{ t('groups.empty') }}</p>
        </div>

        <div v-else class="stagger-in">
          <div
            v-for="group in filteredGroups"
            :key="group.id"
            @click="selectGroup(group.id)"
            :class="[
              'p-4 border-b border-stone-200 cursor-pointer transition-colors relative',
              selectedGroup?.id === group.id ? 'bg-stone-100' : 'hover:bg-stone-50',
            ]"
          >
            <div
              v-if="selectedGroup?.id === group.id"
              class="absolute left-0 top-0 bottom-0 w-1 bg-zinc-900 rounded-r-full"
            ></div>
            <div class="flex justify-between items-start mb-1 gap-3">
              <span class="text-sm font-semibold text-zinc-900 truncate">{{ group.name }}</span>
              <span class="text-[10px] font-semibold uppercase tracking-tight px-2 py-1 rounded-full bg-zinc-900 text-white">
                {{ group.memberCount }}
              </span>
            </div>
            <p class="text-xs text-zinc-500">{{ t('groups.membersCount') }}: {{ group.memberCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1 rounded-2xl border border-stone-200 bg-white overflow-hidden flex flex-col min-h-0">
      <template v-if="selectedGroup && editModel">
        <div class="p-6 sm:p-7 border-b border-stone-200 bg-stone-50 shrink-0">
          <h1 class="text-2xl sm:text-3xl font-semibold text-zinc-900 leading-tight mb-5">
            {{ t('groups.editTitle') }}
          </h1>

          <div class="space-y-4 max-w-2xl">
            <div>
              <label class="block text-sm font-medium text-zinc-700 mb-1">{{ t('groups.name') }}</label>
              <InputText v-model="editModel.name" class="w-full" />
            </div>

            <div>
              <label class="block text-sm font-medium text-zinc-700 mb-1">{{ t('groups.members') }}</label>
              <MultiSelect
                v-model="editModel.userIds"
                :options="allUsers"
                optionLabel="email"
                optionValue="id"
                display="chip"
                filter
                class="w-full"
                :placeholder="t('groups.selectMembers')"
              >
                <template #option="slotProps">
                  <div class="flex flex-col">
                    <span class="text-sm font-medium">{{ slotProps.option.name }} {{ slotProps.option.surname }}</span>
                    <span class="text-xs text-zinc-500">{{ slotProps.option.email }}</span>
                  </div>
                </template>
              </MultiSelect>
            </div>

            <div class="pt-2">
              <Button :label="t('groups.save')" icon="pi pi-check" :loading="saving" @click="saveGroup" />
            </div>
          </div>
        </div>
      </template>

      <div v-else class="flex-1 flex flex-col items-center justify-center text-zinc-400 bg-stone-50/70 p-8">
        <div class="w-24 h-24 bg-white border border-stone-200 rounded-full flex items-center justify-center mb-5">
          <i class="pi pi-users text-4xl opacity-30"></i>
        </div>
        <p class="text-base sm:text-lg font-semibold text-zinc-500 text-center">{{ t('groups.select') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import MultiSelect from 'primevue/multiselect';
import {
  getAllGroups,
  updateGroup,
  type GroupDetailModel,
  type UpdateGroupDto,
} from '../services/group.service';
import { getAllUsers, type UserDetailModel } from '../services/user.service';

const { t } = useI18n();

const loading = ref(true);
const saving = ref(false);
const search = ref('');
const groups = ref<GroupDetailModel[]>([]);
const allUsers = ref<UserDetailModel[]>([]);
const selectedGroup = ref<GroupDetailModel | null>(null);
const editModel = ref<UpdateGroupDto | null>(null);

const filteredGroups = computed(() => {
  const term = search.value.trim().toLowerCase();
  if (!term) return groups.value;
  return groups.value.filter((g) => g.name.toLowerCase().includes(term));
});

async function loadData() {
  loading.value = true;
  try {
    const [groupResponse, usersResponse] = await Promise.all([getAllGroups(), getAllUsers()]);
    groups.value = groupResponse;
    allUsers.value = usersResponse;

    if (selectedGroup.value) {
      const refreshed = groups.value.find((g) => g.id === selectedGroup.value?.id) || null;
      if (refreshed) {
        selectedGroup.value = refreshed;
        editModel.value = {
          name: refreshed.name,
          userIds: refreshed.members.map((m) => m.id),
        };
      }
    }
  } finally {
    loading.value = false;
  }
}

function selectGroup(groupId: number) {
  const found = groups.value.find((g) => g.id === groupId) || null;
  selectedGroup.value = found;
  if (!found) {
    editModel.value = null;
    return;
  }

  editModel.value = {
    name: found.name,
    userIds: found.members.map((m) => m.id),
  };
}

async function saveGroup() {
  if (!selectedGroup.value || !editModel.value) return;
  saving.value = true;
  try {
    const updated = await updateGroup(selectedGroup.value.id, editModel.value);
    const idx = groups.value.findIndex((g) => g.id === updated.id);
    if (idx !== -1) {
      groups.value[idx] = updated;
    }
    selectedGroup.value = updated;
    editModel.value = {
      name: updated.name,
      userIds: updated.members.map((m) => m.id),
    };
  } finally {
    saving.value = false;
  }
}

onMounted(loadData);
</script>
