<template>
  <div class="flex h-full gap-6">
    <div
      class="w-2/5 min-w-[380px] flex flex-col glass-effect rounded-3xl border border-white/50 shadow-lg overflow-hidden"
    >
      <div
        class="p-5 border-b border-slate-100/50 flex justify-between items-center shrink-0 bg-gradient-to-r from-white/50 to-blue-50/30"
      >
        <h2 class="text-xl font-black gradient-text">{{ t('groups.title') }}</h2>
        <Button icon="pi pi-refresh" class="p-button-sm p-button-rounded" @click="loadData" />
      </div>

      <div class="px-5 py-3 border-b border-slate-100/50 bg-white/50">
        <input
          v-model="search"
          type="text"
          :placeholder="t('groups.search')"
          class="w-full p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
        />
      </div>

      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <div v-if="loading" class="p-4 space-y-4">
          <div v-for="i in 5" :key="i" class="h-20 bg-slate-100 rounded-xl animate-pulse"></div>
        </div>

        <div
          v-else-if="filteredGroups.length === 0"
          class="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center"
        >
          <i class="pi pi-users text-5xl mb-4 opacity-20"></i>
          <p class="font-medium text-slate-500">{{ t('groups.empty') }}</p>
        </div>

        <div v-else>
          <div
            v-for="group in filteredGroups"
            :key="group.id"
            @click="selectGroup(group.id)"
            :class="[
              'p-5 border-b border-slate-50 cursor-pointer transition-all relative group hover-lift',
              selectedGroup?.id === group.id
                ? 'bg-gradient-to-r from-blue-50 to-purple-50/30'
                : 'hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50/20',
            ]"
          >
            <div class="flex justify-between items-start mb-1">
              <span class="text-sm font-bold text-slate-900">{{ group.name }}</span>
              <span class="text-[10px] font-bold uppercase tracking-tighter px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                {{ group.memberCount }}
              </span>
            </div>
            <p class="text-xs text-slate-500">{{ t('groups.membersCount') }}: {{ group.memberCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <div
      class="flex-1 glass-effect rounded-3xl border border-white/50 shadow-lg overflow-hidden flex flex-col"
    >
      <template v-if="selectedGroup && editModel">
        <div class="p-8 border-b border-slate-100 bg-slate-50/30 shrink-0">
          <h1 class="text-3xl font-black text-slate-900 leading-tight mb-4">{{ t('groups.editTitle') }}</h1>

          <div class="space-y-4 max-w-2xl">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">{{ t('groups.name') }}</label>
              <InputText v-model="editModel.name" class="w-full" />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">{{ t('groups.members') }}</label>
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
                    <span class="text-xs text-slate-500">{{ slotProps.option.email }}</span>
                  </div>
                </template>
              </MultiSelect>
            </div>

            <div class="pt-2">
              <Button
                :label="t('groups.save')"
                icon="pi pi-check"
                :loading="saving"
                @click="saveGroup"
              />
            </div>
          </div>
        </div>
      </template>

      <div v-else class="flex-1 flex flex-col items-center justify-center text-slate-300 bg-slate-50/20">
        <div class="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-inner mb-6">
          <i class="pi pi-users text-5xl opacity-20"></i>
        </div>
        <p class="text-lg font-bold text-slate-400">{{ t('groups.select') }}</p>
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
