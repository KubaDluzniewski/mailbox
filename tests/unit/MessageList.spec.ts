import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import MessageList from '../../src/components/MessageList.vue';

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

describe('MessageList.vue', () => {
  it('renders loading state', () => {
    const wrapper = mount(MessageList, {
      props: {
        loading: true,
      },
    });
    expect(wrapper.text()).toContain('common.loading');
  });

  it('renders error state', () => {
    const wrapper = mount(MessageList, {
      props: {
        error: 'Network error',
      },
    });
    expect(wrapper.text()).toContain('Network error');
  });

  it('renders empty messages state', () => {
    const wrapper = mount(MessageList, {
      props: {
        messages: [],
      },
    });
    expect(wrapper.text()).toContain('messageList.noMessages');
  });

  it('renders list of mock messages', () => {
    const messages = [
      { id: 1, subject: 'Test Subject 1', body: 'Body 1', sentDate: '2026-04-02T10:00:00Z' },
      { id: 2, subject: 'Test Subject 2', body: 'Body 2', sentDate: '2026-04-02T11:00:00Z' },
    ];
    // Cast to any to bypass exact GetMessageModel matching if testing minimally
    const wrapper = mount(MessageList, {
      props: {
        messages: messages as any,
      },
    });
    expect(wrapper.text()).toContain('Test Subject 1');
    expect(wrapper.text()).toContain('Test Subject 2');
  });

  it('emits select event when clicked', async () => {
    const messages = [
      { id: 1, subject: 'Test Subject 1', body: 'Body 1', sentDate: '2026-04-02T10:00:00Z' },
    ];
    const wrapper = mount(MessageList, {
      props: {
        messages: messages as any,
      },
    });
    
    await wrapper.find('button.flex-grow').trigger('click');
    expect(wrapper.emitted()).toHaveProperty('select');
    expect(wrapper.emitted('select')![0]).toEqual([{ message: messages[0], index: 0 }]);
  });
});
