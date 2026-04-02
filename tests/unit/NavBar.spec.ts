import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import NavBar from '../../src/components/NavBar.vue';

// Use basic stubs for components internally
const NavItemStub = { template: '<div class="nav-item-stub">{{ label }}</div>', props: ['label'] };

// Mocking useI18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

// Mock router
const mockRouter = { push: vi.fn() };
vi.mock('vue-router', () => ({
  useRouter: () => mockRouter,
  RouterLink: { template: '<a><slot /></a>' },
}));

// Mock stores
const mockUserStore = {
  user: { roles: ['User'] }, // Not an admin by default
  logout: vi.fn(),
};
const mockMessageStore = {
  inboxCount: 5,
  unreadCount: 2,
  draftsCount: 0,
  fetchCounts: vi.fn(),
};

vi.mock('../../src/store/user', () => ({
  useUserStore: () => mockUserStore,
}));

vi.mock('../../src/store/message', () => ({
  useMessageStore: () => mockMessageStore,
}));

vi.mock('pinia', () => ({
  storeToRefs: (store: any) => ({
    inboxCount: { value: store.inboxCount },
    unreadCount: { value: store.unreadCount },
    draftsCount: { value: store.draftsCount },
  }),
}));

describe('NavBar.vue', () => {
  it('renders standard navigation items', () => {
    const wrapper = mount(NavBar, {
      global: {
        components: { RouterLink: { template: '<a><slot /></a>' } },
        stubs: { NavItem: NavItemStub }
      }
    });
    
    // Check for standard items like received, sent, drafts
    expect(wrapper.text()).toContain('main.received');
    expect(wrapper.text()).toContain('main.sent');
    expect(wrapper.text()).toContain('main.drafts');
    // Admin links shouldn't be present
    expect(wrapper.text()).not.toContain('nav.users');
  });

  it('renders admin items when user is admin', async () => {
    mockUserStore.user.roles = ['ADMIN'];
    
    const wrapper = mount(NavBar, {
      global: {
        components: { RouterLink: { template: '<a><slot /></a>' } },
        stubs: { NavItem: NavItemStub }
      }
    });

    expect(wrapper.text()).toContain('nav.users');
    expect(wrapper.text()).toContain('nav.messageHistory');
  });

  it('calls logout when logout button is clicked', async () => {
    const wrapper = mount(NavBar, {
      global: {
        components: { RouterLink: { template: '<a><slot /></a>' } },
        stubs: { NavItem: NavItemStub }
      }
    });
    
    await wrapper.find('button.hover-lift').trigger('click');
    expect(mockUserStore.logout).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });
});
