<template>
  <div class="flex h-full gap-6">
    <!-- Users List -->
    <div
      class="w-2/5 min-w-[400px] flex flex-col glass-effect rounded-3xl border border-white/50 shadow-lg overflow-hidden"
    >
      <div
        class="p-5 border-b border-slate-100/50 flex justify-between items-center shrink-0 bg-gradient-to-r from-white/50 to-blue-50/30"
      >
        <h2 class="text-xl font-black gradient-text">Zarządzanie użytkownikami</h2>
        <Button
          icon="pi pi-plus"
          label="Dodaj"
          class="p-button-sm p-button-rounded hover-lift"
          @click="showCreateDialog = true"
        />
      </div>
      <div class="px-5 py-3 border-b border-slate-100/50 bg-white/50">
        <input
          v-model="search"
          type="text"
          placeholder="Szukaj użytkowników..."
          class="w-full p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
        />
      </div>

      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <div v-if="loading" class="p-4 space-y-4">
          <div v-for="i in 5" :key="i" class="h-20 bg-slate-100 rounded-xl animate-pulse"></div>
        </div>
        <div
          v-else-if="filteredUsers.length === 0"
          class="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center"
        >
          <i class="pi pi-users text-5xl mb-4 opacity-20"></i>
          <p class="font-medium text-slate-500">Brak użytkowników</p>
        </div>
        <div v-else>
          <div
            v-for="user in filteredUsers"
            :key="user.id"
            @click="selectedUser = user"
            :class="[
              'p-5 border-b border-slate-50 cursor-pointer transition-all relative group hover-lift',
              selectedUser?.id === user.id
                ? 'bg-gradient-to-r from-blue-50 to-purple-50/30'
                : 'hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50/20',
            ]"
          >
            <div
              v-if="selectedUser?.id === user.id"
              class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-slate-600 to-slate-700 rounded-r-full"
            ></div>
            <div class="flex justify-between items-start mb-1">
              <div class="flex items-center gap-2">
                <div
                  :class="[
                    'w-2 h-2 rounded-full flex-shrink-0',
                    user.isActive ? 'bg-green-600' : 'bg-red-600',
                  ]"
                ></div>
                <span class="text-sm font-bold text-slate-900">
                  {{ user.name }} {{ user.surname }}
                </span>
              </div>
              <span
                :class="[
                  'text-[10px] font-bold uppercase tracking-tighter px-2 py-1 rounded-full',
                  getRoleBadgeClass(user.role),
                ]"
              >
                {{ getRoleLabel(user.role) }}
              </span>
            </div>
            <p class="text-xs text-slate-500">{{ user.email }}</p>
            <p class="text-[10px] text-slate-400 mt-1">
              Utworzono: {{ formatDate(user.createdAt) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- User Details / Edit Panel -->
    <div
      class="flex-1 glass-effect rounded-3xl border border-white/50 shadow-lg overflow-hidden flex flex-col"
    >
      <template v-if="selectedUser">
        <div class="p-8 border-b border-slate-100 bg-slate-50/30 shrink-0">
          <div class="flex justify-between items-start mb-6">
            <h1 class="text-3xl font-black text-slate-900 leading-tight">
              {{ selectedUser.name }} {{ selectedUser.surname }}
            </h1>
            <div class="flex gap-2">
              <Button
                icon="pi pi-pencil"
                class="p-button-outlined p-button-sm rounded-xl hover-lift"
                v-tooltip.top="'Edytuj'"
                @click="openEditDialog"
              />
              <Button
                :icon="selectedUser.isActive ? 'pi pi-ban' : 'pi pi-check'"
                :class="[
                  'p-button-outlined p-button-sm rounded-xl hover-lift',
                  selectedUser.isActive ? 'p-button-warning' : 'p-button-success',
                ]"
                v-tooltip.top="selectedUser.isActive ? 'Dezaktywuj' : 'Aktywuj'"
                @click="toggleStatus"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-outlined p-button-danger p-button-sm rounded-xl hover-lift"
                v-tooltip.top="'Usuń'"
                @click="confirmDelete"
              />
            </div>
          </div>

          <div class="flex items-center gap-4">
            <Avatar
              :label="selectedUser.name[0] + selectedUser.surname[0]"
              shape="circle"
              size="xlarge"
              class="bg-gradient-to-br from-slate-100 to-gray-100 text-slate-700 font-bold shadow-md hover-glow"
            />
            <div class="flex-1">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-xs text-slate-500 font-medium">Email</p>
                  <p class="text-sm font-bold text-slate-900">{{ selectedUser.email }}</p>
                </div>
                <div>
                  <p class="text-xs text-slate-500 font-medium">Rola</p>
                  <p class="text-sm font-bold text-slate-900">
                    {{ getRoleLabel(selectedUser.role) }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-slate-500 font-medium">Status</p>
                  <p
                    :class="[
                      'text-sm font-bold',
                      selectedUser.isActive ? 'text-green-600' : 'text-red-600',
                    ]"
                  >
                    {{ selectedUser.isActive ? 'Aktywny' : 'Nieaktywny' }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-slate-500 font-medium">Data utworzenia</p>
                  <p class="text-sm font-bold text-slate-900">
                    {{ formatDate(selectedUser.createdAt) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <div
        v-else
        class="flex-1 flex flex-col items-center justify-center text-slate-300 bg-slate-50/20"
      >
        <div
          class="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-inner mb-6"
        >
          <i class="pi pi-user text-5xl opacity-20"></i>
        </div>
        <p class="text-lg font-bold text-slate-400">
          Wybierz użytkownika, aby wyświetlić szczegóły
        </p>
      </div>
    </div>
  </div>

  <!-- Create User Dialog -->
  <Dialog
    v-model:visible="showCreateDialog"
    header="Dodaj nowego użytkownika"
    :modal="true"
    :style="{ width: '500px' }"
    class="p-fluid"
  >
    <div class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-slate-700 mb-1">Imię</label>
        <InputText id="name" v-model="newUser.name" placeholder="Imię" />
      </div>
      <div>
        <label for="surname" class="block text-sm font-medium text-slate-700 mb-1">Nazwisko</label>
        <InputText id="surname" v-model="newUser.surname" placeholder="Nazwisko" />
      </div>
      <div>
        <label for="email" class="block text-sm font-medium text-slate-700 mb-1">Email</label>
        <InputText id="email" v-model="newUser.email" type="email" placeholder="Email" />
      </div>
      <div>
        <label for="password" class="block text-sm font-medium text-slate-700 mb-1">Hasło</label>
        <Password
          id="password"
          v-model="newUser.password"
          placeholder="Hasło"
          :feedback="false"
          toggleMask
        />
      </div>
      <div>
        <label for="role" class="block text-sm font-medium text-slate-700 mb-1">Rola</label>
        <Dropdown
          id="role"
          v-model="newUser.role"
          :options="roleOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Wybierz rolę"
        />
      </div>
      <div class="flex items-center gap-2">
        <InputSwitch id="isActive" v-model="newUser.isActive" />
        <label for="isActive" class="text-sm font-medium text-slate-700">Aktywny</label>
      </div>
    </div>
    <template #footer>
      <Button
        label="Anuluj"
        icon="pi pi-times"
        @click="showCreateDialog = false"
        class="p-button-text"
      />
      <Button label="Utwórz" icon="pi pi-check" @click="handleCreateUser" :loading="creating" />
    </template>
  </Dialog>

  <!-- Edit User Dialog -->
  <Dialog
    v-model:visible="showEditDialog"
    header="Edytuj użytkownika"
    :modal="true"
    :style="{ width: '500px' }"
    class="p-fluid"
  >
    <div class="space-y-4" v-if="editUser">
      <div>
        <label for="edit-name" class="block text-sm font-medium text-slate-700 mb-1">Imię</label>
        <InputText id="edit-name" v-model="editUser.name" placeholder="Imię" />
      </div>
      <div>
        <label for="edit-surname" class="block text-sm font-medium text-slate-700 mb-1"
          >Nazwisko</label
        >
        <InputText id="edit-surname" v-model="editUser.surname" placeholder="Nazwisko" />
      </div>
      <div>
        <label for="edit-email" class="block text-sm font-medium text-slate-700 mb-1">Email</label>
        <InputText id="edit-email" v-model="editUser.email" type="email" placeholder="Email" />
      </div>
      <div>
        <label for="edit-role" class="block text-sm font-medium text-slate-700 mb-1">Rola</label>
        <Dropdown
          id="edit-role"
          v-model="editUser.role"
          :options="roleOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Wybierz rolę"
        />
      </div>
      <div class="flex items-center gap-2">
        <InputSwitch id="edit-isActive" v-model="editUser.isActive" />
        <label for="edit-isActive" class="text-sm font-medium text-slate-700">Aktywny</label>
      </div>
    </div>
    <template #footer>
      <Button
        label="Anuluj"
        icon="pi pi-times"
        @click="showEditDialog = false"
        class="p-button-text"
      />
      <Button label="Zapisz" icon="pi pi-check" @click="handleUpdateUser" :loading="updating" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  type UserDetailModel,
  type CreateUserDto,
  type UpdateUserDto,
} from '../services/user.service';

const { t } = useI18n();
const users = ref<UserDetailModel[]>([]);
const selectedUser = ref<UserDetailModel | null>(null);
const loading = ref(true);
const search = ref('');
const showCreateDialog = ref(false);
const showEditDialog = ref(false);
const creating = ref(false);
const updating = ref(false);

const newUser = ref<CreateUserDto>({
  name: '',
  surname: '',
  email: '',
  password: '',
  role: 'STUDENT',
  isActive: true,
});

const editUser = ref<UpdateUserDto | null>(null);

const roleOptions = [
  { label: 'Administrator', value: 'ADMIN' },
  { label: 'Wykładowca', value: 'LECTURER' },
  { label: 'Student', value: 'STUDENT' },
];

const filteredUsers = computed(() => {
  if (!search.value.trim()) return users.value;
  const term = search.value.trim().toLowerCase();
  return users.value.filter((user) => {
    const name = user.name?.toLowerCase() || '';
    const surname = user.surname?.toLowerCase() || '';
    const email = user.email?.toLowerCase() || '';
    return name.includes(term) || surname.includes(term) || email.includes(term);
  });
});

const getRoleLabel = (role: string) => {
  const option = roleOptions.find((r) => r.value === role);
  return option?.label || role;
};

const getRoleBadgeClass = (role: string) => {
  switch (role) {
    case 'ADMIN':
      return 'bg-purple-100 text-purple-700';
    case 'LECTURER':
      return 'bg-blue-100 text-blue-700';
    case 'STUDENT':
      return 'bg-green-100 text-green-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
};

const formatDate = (date: string | Date | undefined) => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
};

const loadUsers = async () => {
  loading.value = true;
  try {
    users.value = await getAllUsers();
  } catch (error) {
    console.error('Failed to load users:', error);
  } finally {
    loading.value = false;
  }
};

const handleCreateUser = async () => {
  creating.value = true;
  try {
    const user = await createUser(newUser.value);
    users.value.push(user);
    showCreateDialog.value = false;
    newUser.value = {
      name: '',
      surname: '',
      email: '',
      password: '',
      role: 'STUDENT',
      isActive: true,
    };
  } catch (error: any) {
    alert(error.message || 'Failed to create user');
  } finally {
    creating.value = false;
  }
};

const openEditDialog = () => {
  if (!selectedUser.value) return;
  editUser.value = {
    name: selectedUser.value.name,
    surname: selectedUser.value.surname,
    email: selectedUser.value.email,
    role: selectedUser.value.role,
    isActive: selectedUser.value.isActive,
  };
  showEditDialog.value = true;
};

const handleUpdateUser = async () => {
  if (!selectedUser.value || !editUser.value) return;
  updating.value = true;
  try {
    const updated = await updateUser(selectedUser.value.id, editUser.value);
    const index = users.value.findIndex((u) => u.id === selectedUser.value!.id);
    if (index !== -1) {
      users.value[index] = updated;
      selectedUser.value = updated;
    }
    showEditDialog.value = false;
  } catch (error: any) {
    alert(error.message || 'Failed to update user');
  } finally {
    updating.value = false;
  }
};

const confirmDelete = async () => {
  if (!selectedUser.value) return;
  if (
    !confirm(
      `Czy na pewno chcesz usunąć użytkownika ${selectedUser.value.name} ${selectedUser.value.surname}?`
    )
  )
    return;

  try {
    await deleteUser(selectedUser.value.id);
    users.value = users.value.filter((u) => u.id !== selectedUser.value!.id);
    selectedUser.value = null;
  } catch (error: any) {
    alert(error.message || 'Failed to delete user');
  }
};

const toggleStatus = async () => {
  if (!selectedUser.value) return;
  try {
    await toggleUserStatus(selectedUser.value.id);
    selectedUser.value.isActive = !selectedUser.value.isActive;
    const index = users.value.findIndex((u) => u.id === selectedUser.value!.id);
    if (index !== -1) {
      users.value[index].isActive = selectedUser.value.isActive;
    }
  } catch (error: any) {
    alert(error.message || 'Failed to toggle user status');
  }
};

onMounted(loadUsers);
</script>
